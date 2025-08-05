# main.py

import os
import json
import uuid
import torchaudio
from pathlib import Path
from yt_dlp import YoutubeDL
from transformers import pipeline

import torch
from transformers import AutoProcessor, SeamlessM4Tv2Model

# Directories
AUDIO_DIR = Path("audio")
AUDIO_DIR.mkdir(exist_ok=True)

# Supported output languages
LANGUAGES = [
    "en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko", "ar", "hi", "tr"
]

# ContentTranslation storage
CT_FILE = Path("ContentTranslation.json")

# Step 1: Download audio from YouTube
def download_youtube_audio(youtube_url: str) -> str:
    audio_id = str(uuid.uuid4())
    output_path = AUDIO_DIR / f"{audio_id}.wav"
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': str(output_path),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'wav',
            'preferredquality': '192',
        }],
        'quiet': True,
    }
    with YoutubeDL(ydl_opts) as ydl:
        ydl.download([youtube_url])
    return str(output_path)

# Step 2: Transcribe using Whisper (via Hugging Face)
def transcribe_audio(audio_path: str, model_size="large"):
    pipe = pipeline("automatic-speech-recognition", model=f"openai/whisper-{model_size}")
    result = pipe(audio_path)
    return result['text']

# Step 3: Translate & synthesize using SeamlessM4T-v2
def translate_speech(audio_path: str, tgt_lang: str):
    processor = AutoProcessor.from_pretrained("facebook/seamless-m4t-v2-large")
    model = SeamlessM4Tv2Model.from_pretrained("facebook/seamless-m4t-v2-large")

    # Load audio
    waveform, sample_rate = torchaudio.load(audio_path)
    if sample_rate != 16000:
        resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
        waveform = resampler(waveform)
    
    inputs = processor(audios=waveform.squeeze(), return_tensors="pt")
    output = model.generate(**inputs, tgt_lang=tgt_lang, generate_speech=True)

    # Save the generated audio
    translated_audio_path = AUDIO_DIR / f"{uuid.uuid4()}_{tgt_lang}.wav"
    torchaudio.save(str(translated_audio_path), output.audio[0].unsqueeze(0), 16000)
    return str(translated_audio_path)

# Step 4: Store metadata
def save_content_translation(original_text, translations_dict):
    data = {
        "original_text": original_text,
        "translations": translations_dict
    }
    if CT_FILE.exists():
        with open(CT_FILE, "r") as f:
            existing = json.load(f)
    else:
        existing = []

    existing.append(data)
    with open(CT_FILE, "w") as f:
        json.dump(existing, f, indent=2)

# Orchestrator
def process_youtube_audio(youtube_url: str):
    print("[1] Downloading audio...")
    audio_path = download_youtube_audio(youtube_url)

    print("[2] Transcribing with Whisper...")
    transcript = transcribe_audio(audio_path)

    print("[3] Translating & synthesizing into 13 languages...")
    translations = {}
    for lang in LANGUAGES:
        print(f"  - Translating to {lang}...")
        translated_audio = translate_speech(audio_path, lang)
        translations[lang] = {
            "translated_url": str(translated_audio),
        }

    print("[4] Storing translation data...")
    save_content_translation(transcript, translations)
    print("✅ Done.")

# === Entry Point ===
if __name__ == "__main__":
    yt_url = input("Enter YouTube URL: ")
    process_youtube_audio(yt_url)
