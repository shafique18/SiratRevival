import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

import json
import uuid
from pathlib import Path
from typing import List
from urllib.parse import urlparse
import torch
import torchaudio
from yt_dlp import YoutubeDL
from transformers import AutoProcessor, SeamlessM4Tv2Model, WhisperProcessor, WhisperForConditionalGeneration, WhisperModel, pipeline

from backend.core.config import settings

# Setup
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["HF_HUB_DISABLE_SYMLINKS"] = "1"

# Ensure audio directory exists
settings.AUDIO_DIR.mkdir(parents=True, exist_ok=True)

# Preload models
device = "cuda" if torch.cuda.is_available() else "cpu"
whisper_base = WhisperModel.from_pretrained(settings.WHISPER_MODEL).to(device)
whisper_processor = WhisperProcessor.from_pretrained(settings.WHISPER_MODEL)
whisper_model = WhisperForConditionalGeneration.from_pretrained(settings.WHISPER_MODEL).to(device)
seamless_processor = AutoProcessor.from_pretrained(settings.SEAMLESS_MODEL).to(device)
seamless_model = SeamlessM4Tv2Model.from_pretrained(settings.SEAMLESS_MODEL).to(device)

def extract_youtube_shorts_id(url: str) -> str:
    parsed_url = urlparse(url)
    path_parts = parsed_url.path.strip("/").split("/")
    if len(path_parts) >= 2 and path_parts[0] == "shorts":
        return path_parts[1]
    return None

def download_youtube_audio(youtube_url: str) -> str:
    audio_id = str(uuid.uuid4())
    temp_path = settings.AUDIO_DIR / f"{audio_id}.%(ext)s"
    ydl_opts = {
        'format': 'bestaudio/best',
        'ffmpeg_location': settings.FFMPEG_PATH,
        'outtmpl': str(temp_path),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'wav',
            'preferredquality': '192',
        }],
        'quiet': True,
    }
    with YoutubeDL(ydl_opts) as ydl:
        ydl.download([youtube_url])
    final_path = list(settings.AUDIO_DIR.glob(f"{audio_id}*.wav"))
    if not final_path:
        raise FileNotFoundError(f"Failed to find WAV output for {audio_id}")
    return str(final_path[0])

asr = pipeline("automatic-speech-recognition", model="openai/whisper-base", device=0)

def detect_language_whisper(audio_path: str) -> str:
    result = asr(audio_path, return_timestamps=True)
    detected_lang = result.get("language", "unknown")
    print(f"[INFO] Detected language (Whisper): {detected_lang}")
    return detected_lang

# def detect_language_whisper(audio_path: str) -> str:
#     waveform, sr = torchaudio.load(audio_path)
#     if sr != 16000:
#         waveform = torchaudio.functional.resample(waveform, sr, 16000)
#     waveform = waveform.mean(dim=0)

#     inputs = whisper_processor(waveform, sampling_rate=16000, return_tensors="pt")
#     input_features = inputs.input_features.to(device)

#     with torch.no_grad():
#         # Encode audio
#         encoder_outputs = whisper_base.encoder(input_features=input_features)
        
#         # Predict language token with decoder
#         decoder_input_ids = torch.tensor([[whisper_processor.tokenizer.lang_to_id["<|en|>"]]], device=device)
#         logits = whisper_base.decoder(
#             input_ids=decoder_input_ids,
#             encoder_hidden_states=encoder_outputs.last_hidden_state
#         ).logits

#         language_probs = torch.softmax(logits[:, 0, :], dim=-1)
#         language_token = torch.argmax(language_probs, dim=-1)
#         language_str = whisper_processor.tokenizer.convert_ids_to_tokens(language_token)[0]
#         lang = language_str.strip("<|>").replace("_", "-")
#         print(f"[INFO] Detected language (Whisper): {lang}")
#         return lang

def transcribe_audio(audio_path: str) -> str:
    waveform, sample_rate = torchaudio.load(audio_path)
    if sample_rate != 16000:
        waveform = torchaudio.functional.resample(waveform, sample_rate, 16000)
    waveform = waveform.mean(dim=0)
    inputs = whisper_processor(waveform, sampling_rate=16000, return_tensors="pt")
    input_features = inputs.input_features.to(device)
    predicted_ids = whisper_model.generate(input_features)
    transcription = whisper_processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
    return transcription

def translate_speech(audio_path: str, tgt_lang: str) -> str:
    waveform, sample_rate = torchaudio.load(audio_path)
    if sample_rate != 16000:
        waveform = torchaudio.functional.resample(waveform, sample_rate, 16000)
    inputs = seamless_processor(audios=waveform.squeeze(),sampling_rate=16000, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}
    output = seamless_model.generate(**inputs, tgt_lang=tgt_lang, generate_speech=True)
    translated_audio_path = settings.AUDIO_DIR / f"{uuid.uuid4()}_{tgt_lang}.wav"
    torchaudio.save(str(translated_audio_path), output.audio[0].unsqueeze(0), 16000)
    return str(translated_audio_path)

def save_content_translation(original_text, translations_dict, track):
    CT_FILE = Path(f"Pillar_{track}.json")
    data = {
        "original_text": original_text,
        "translations": translations_dict
    }
    existing = []
    if CT_FILE.exists():
        with open(CT_FILE, "r") as f:
            existing = json.load(f)
    existing.append(data)
    with open(CT_FILE, "w") as f:
        json.dump(existing, f, indent=2)

def process_youtube_audio(youtube_urls: List[str]):
    for youtube_url in youtube_urls:
        print(f"\n🔗 Processing: {youtube_url}")
        print("[1] Downloading audio...")
        audio_path = download_youtube_audio(youtube_url)

        print("[2] Detecting language...")
        detected_lang = detect_language_whisper(audio_path)

        print("[3] Transcribing with Whisper...")
        transcript = transcribe_audio(audio_path)
        print(f"[INFO] Transcription: {transcript}")

        print("[4] Translating & synthesizing into 13 languages...")
        translations = {}
        for lang in settings.TRANSLATE_LANGUAGES:
            print(f"  - Translating to {lang}...")
            translated_audio = translate_speech(audio_path, lang)
            translations[lang] = {
                "translated_url": translated_audio
            }

        short_name = extract_youtube_shorts_id(youtube_url)
        print("[5] Storing translation data...")
        save_content_translation(transcript, translations, short_name)
        print("✅ Done.")

# === Entry Point ===
if __name__ == "__main__":
    yt_urls = [
        "https://www.youtube.com/shorts/wwCk7qgMm7g?feature=share",
        "https://www.youtube.com/shorts/FBhsQCw_HoY?feature=share",
        "https://www.youtube.com/shorts/6yWannrONGs?feature=share",
        "https://www.youtube.com/shorts/hLUvVLv1cxs?feature=share",
        "https://www.youtube.com/shorts/PgHfTZ9Mcxk?feature=share"
    ]
    process_youtube_audio(yt_urls)
