import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

import json
import uuid
from pathlib import Path
from typing import List
from urllib.parse import urlparse
import torch
torch.cuda.empty_cache()
import torchaudio
from yt_dlp import YoutubeDL
from transformers import (
    AutoProcessor, SeamlessM4Tv2Model,
    WhisperProcessor, WhisperForConditionalGeneration,
    pipeline
)

from backend.core.config import settings

os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["HF_HUB_DISABLE_SYMLINKS"] = "1"
settings.AUDIO_DIR.mkdir(parents=True, exist_ok=True)

# device = "cuda" if torch.cuda.is_available() else "cpu"
device = "cpu"
whisper_processor = WhisperProcessor.from_pretrained(settings.WHISPER_MODEL)
whisper_model = WhisperForConditionalGeneration.from_pretrained(settings.WHISPER_MODEL).to(device)
seamless_processor = AutoProcessor.from_pretrained(settings.SEAMLESS_MODEL)
seamless_model = SeamlessM4Tv2Model.from_pretrained(settings.SEAMLESS_MODEL).to(device)

asr = pipeline("automatic-speech-recognition", model=settings.WHISPER_MODEL, device=device, return_timestamps="word")

def extract_youtube_shorts_id(url: str) -> str:
    parsed_url = urlparse(url)
    path_parts = parsed_url.path.strip("/").split("/")
    return path_parts[1] if len(path_parts) >= 2 and path_parts[0] == "shorts" else None

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

def transcribe_with_segments(audio_path: str):
    result = asr(audio_path,chunk_length_s=30, batch_size=1)
    return result.get("chunks", [])

def detect_language_of_text(text: str) -> str:
    import langdetect
    try:
        return langdetect.detect(text)
    except:
        return "unknown"

def split_audio_segment(audio_path, start_time, end_time, output_path):
    waveform, sr = torchaudio.load(audio_path)
    start_sample = int(start_time * sr)
    end_sample = int(end_time * sr)
    segment = waveform[:, start_sample:end_sample]
    torchaudio.save(output_path, segment, sr)

def translate_urdu_segments(audio_path: str, segments: List[dict], output_dir: Path):
    urdu_segments = [seg for seg in segments if detect_language_of_text(seg["text"]) == "ur"]
    translations = {}

    for i, segment in enumerate(urdu_segments):
        start = segment["timestamp"][0]
        end = segment["timestamp"][1]
        text = segment["text"]
        segment_audio_path = output_dir / f"urdu_segment_{i}.wav"
        split_audio_segment(audio_path, start, end, segment_audio_path)

        for lang in settings.TRANSLATE_LANGUAGES:
            print(f"  - Translating Urdu segment {i} to {lang}...")
            waveform, sample_rate = torchaudio.load(segment_audio_path)
            if sample_rate != 16000:
                waveform = torchaudio.functional.resample(waveform, sample_rate, 16000)
            inputs = seamless_processor(audios=waveform.squeeze(), sampling_rate=16000, return_tensors="pt")
            inputs = {k: v.to(device) for k, v in inputs.items()}
            output = seamless_model.generate(**inputs, tgt_lang=lang, generate_speech=True)
            print(output)

            translated_audio_path = output_dir / f"translated_segment_{i}_{lang}.wav"
            torchaudio.save(str(translated_audio_path), output.unsqueeze(0), 16000)

            translations[f"segment_{i}_{lang}"] = {
                "original_text": text,
                "translated_audio_path": str(translated_audio_path)
            }
    return translations

def save_content_translation(original_segments, translations_dict, track):
    CT_FILE = Path(f"Pillar_{track}.json")
    data = {
        "urdu_segments": original_segments,
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

        print("[2] Transcribing with timestamps...")
        segments = transcribe_with_segments(audio_path)
        for seg in segments:
            seg["language"] = detect_language_of_text(seg["text"])

        print("[3] Filtering and translating Urdu segments...")
        output_dir = settings.AUDIO_DIR / "segments"
        output_dir.mkdir(exist_ok=True)
        translations = translate_urdu_segments(audio_path, segments, output_dir)

        short_name = extract_youtube_shorts_id(youtube_url)
        print("[4] Saving data...")
        urdu_segments = [seg for seg in segments if seg["language"] == "ur"]
        save_content_translation(urdu_segments, translations, short_name)
        print("✅ Done.")

if __name__ == "__main__":
    yt_urls = [
        "https://www.youtube.com/shorts/wwCk7qgMm7g?feature=share",
        "https://www.youtube.com/shorts/FBhsQCw_HoY?feature=share",
        "https://www.youtube.com/shorts/6yWannrONGs?feature=share",
        "https://www.youtube.com/shorts/hLUvVLv1cxs?feature=share",
        "https://www.youtube.com/shorts/PgHfTZ9Mcxk?feature=share"
    ]
    process_youtube_audio(yt_urls)