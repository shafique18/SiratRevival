import os
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from PyPDF2 import PdfReader
import yt_dlp
import whisper
import json
import pdfplumber
import pytesseract
from PIL import Image, ImageEnhance
import cv2
import numpy as np

# =================== Config ===================
BASE_DIR = "./scholar_data"
WHISPER_MODEL = whisper.load_model("base")  # or "small", "medium" for better accuracy/slower

# =================== Utilities ===================

def create_dir(base, scholar):
    path = os.path.join(base, scholar.replace(" ", "_"))
    os.makedirs(path, exist_ok=True)
    return path

def download_file(url, dest_folder):
    local_filename = url.split("/")[-1].split("?")[0]
    filepath = os.path.join(dest_folder, local_filename)
    if not os.path.exists(filepath):
        print(f"Downloading: {url}")
        with requests.get(url, stream=True) as r:
            r.raise_for_status()
            with open(filepath, "wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
    else:
        print(f"File already exists: {filepath}")
    return filepath

def text_cleaner(text):
    # Remove footnotes, Quranic symbols, preserve letters and basic diacritics carefully
    text = re.sub(r'\[[^\]]*\]', '', text)
    text = re.sub(r'\(.*?\)', '', text)
    text = re.sub(r'۞', '', text)
    # Remove Arabic diacritics only (not all unicode marks)
    text = re.sub(r'[\u0617-\u061A\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]', '', text)
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def fix_spacing(text):
    text = re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', text)
    text = re.sub(r'(?<=[a-zA-Z])(?=\d)', ' ', text)
    text = re.sub(r'(?<=\d)(?=[a-zA-Z])', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_text_from_pdf_pdfplumber(pdf_path):
    try:
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    except Exception as e:
        print(f"pdfplumber extraction error: {e}")
        return ""

def ocr_page_image(page):
    im = page.to_image(resolution=300).original
    text = pytesseract.image_to_string(im, lang='eng+ara+urd')  # add other languages as needed
    return text

def ocr_pdf_multilang(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            im = page.to_image(resolution=300).original
            page_text = pytesseract.image_to_string(im, lang='eng+urd+hin+deu+fas+ara')
            text += page_text + "\n"
    return text

def enhance_pil_image(image):
    image = image.convert('L')  # grayscale
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2)  # increase contrast
    image = image.resize((image.width*2, image.height*2), Image.LANCZOS)
    return image

def preprocess_image(pil_image):
    cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (gray.shape[1]*2, gray.shape[0]*2), interpolation=cv2.INTER_CUBIC)
    processed = cv2.adaptiveThreshold(resized, 255,
                                      cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                      cv2.THRESH_BINARY, 31, 2)
    return Image.fromarray(processed)

def ocr_pdf_low_quality(pdf_path, languages='eng+ara+urd+hin+deu+fas'):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            pil_image = page.to_image(resolution=300).original
            processed_image = preprocess_image(pil_image)
            page_text = pytesseract.image_to_string(processed_image, lang=languages)
            text += page_text + "\n"
    return text

def is_meaningful(text):
    words = text.strip().split()
    return len(words) > 100

def is_pdf_scanned(pdf_path, threshold=100):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            total_text = ""
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    total_text += t
            return len(total_text.strip()) < threshold
    except Exception as e:
        print(f"Error checking scanned status: {e}")
        return True  # Assume scanned if error

def extract_text_from_pdf_with_ocr(pdf_path, min_text_length=1000):
    # First try pdfplumber extraction
    text = extract_text_from_pdf_pdfplumber(pdf_path)
    if len(text) < min_text_length or not is_meaningful(text):
        print("Text too short or unmeaningful, running OCR fallback...")
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                print(f"OCR page {i+1}/{len(pdf.pages)}...")
                text += ocr_page_image(page) + "\n"
    return text_cleaner(fix_spacing(text))

def transcribe_audio_whisper(audio_path):
    try:
        print(f"Transcribing audio (auto language detection): {audio_path}")
        result = WHISPER_MODEL.transcribe(audio_path)
        cleaned = text_cleaner(result["text"])
        return cleaned
    except Exception as e:
        print(f"Whisper transcription error: {e}")
        return ""

def save_metadata(scholar, data):
    meta_path = os.path.join(BASE_DIR, scholar.replace(" ", "_"), "metadata.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# =================== Iqbal Cyber Library Downloader ===================

def download_iqbal_books_pdf(scholar_dir, scholar):
    base_list_url = "https://www.iqbalcyberlibrary.net/en/listbooks/listbytitle.php"
    print(f"Fetching Iqbal books list from: {base_list_url}")

    content = []
    try:
        response = requests.get(base_list_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
        
        table = soup.find("table")
        if not table:
            print("No table found on the page!")
            return

        rows = table.find_all("tr")[1:]  # skip header
        for row in rows[:1]:
            cols = row.find_all("td")
            if len(cols) < 6:
                continue

            title = cols[1].get_text(strip=True)
            book_page_link = cols[5].find("a")
            if not book_page_link or not book_page_link.get("href"):
                continue

            book_page_url = urljoin(base_list_url, book_page_link["href"])
            print(f"Processing book: {title}")
            print(f"Book page URL: {book_page_url}")

            book_response = requests.get(book_page_url)
            book_response.raise_for_status()
            book_soup = BeautifulSoup(book_response.content, "html.parser")

            # Find PDF link
            pdf_link_tag = None
            for a in book_soup.find_all("a", href=True):
                if a['href'].endswith(".pdf"):
                    pdf_link_tag = a
                    break
            
            if not pdf_link_tag:
                print(f"No PDF found for book: {title}")
                continue

            pdf_url = urljoin(book_page_url, pdf_link_tag['href'])
            pdf_path = download_file(pdf_url, scholar_dir)
            pdf_text = extract_text_from_pdf_with_ocr(pdf_path)

            content.append({
                "type": "pdf",
                "title": title,
                "text": pdf_text,
                "source": pdf_url
            })

        save_metadata(scholar, content)
        print(f"Iqbal books downloaded and processed: {len(content)} items")

    except Exception as e:
        print(f"Error downloading Iqbal books PDF: {e}")

# =================== Archive.org Crawler ===================

def crawl_archive_org(query, scholar_dir, scholar, max_results=5):
    base_url = f"https://archive.org/search.php?query={query.replace(' ', '+')}"
    print(f"Searching Archive.org for: {query}")

    content = []
    try:
        response = requests.get(base_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        links = soup.select('div.C234 a[href^="/details/"]')

        for link in links[:max_results]:
            item_url = urljoin("https://archive.org", link['href'])
            print(f"Found item: {item_url}")
            try:
                sub_response = requests.get(item_url)
                sub_response.raise_for_status()
                sub_soup = BeautifulSoup(sub_response.text, "html.parser")

                files = sub_soup.select('a[href$=".pdf"], a[href$=".mp3"], a[href$=".mp4"]')

                for file in files:
                    file_url = urljoin(item_url, file['href'])
                    downloaded = download_file(file_url, scholar_dir)

                    if downloaded.endswith(".pdf"):
                        pdf_text = extract_text_from_pdf_with_ocr(downloaded)
                        content.append({"type": "pdf", "text": pdf_text, "source": file_url})
                    elif downloaded.endswith(".mp3"):
                        transcription = transcribe_audio_whisper(downloaded)
                        content.append({"type": "audio", "text": transcription, "source": file_url})
            except Exception as e:
                print(f"Error processing archive item {item_url}: {e}")

        save_metadata(scholar, content)
        print(f"Archive.org content downloaded for {scholar}")

    except Exception as e:
        print(f"Error searching Archive.org: {e}")

# =================== YouTube Downloader ===================

def download_youtube_playlist(playlist_url, scholar_dir, scholar):
    content = []
    ydl_opts = {
        'outtmpl': f'{scholar_dir}/%(title)s.%(ext)s',
        'format': 'bestaudio/best',
        'quiet': True,
        'no_warnings': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(playlist_url, download=True)
            if "entries" in info_dict:
                for entry in info_dict['entries']:
                    if entry and 'title' in entry:
                        ext = entry.get('ext', 'webm')
                        filename = os.path.join(scholar_dir, f"{entry['title']}.{ext}")
                        if os.path.exists(filename):
                            transcription = transcribe_audio_whisper(filename)
                            content.append({"type": "audio", "text": transcription, "source": entry.get('webpage_url', '')})
    except Exception as e:
        print(f"Error downloading YouTube playlist: {e}")

    save_metadata(scholar, content)
    print(f"YouTube playlist processed for {scholar}")

# =================== Scholar Map ===================

scholars = {
    "Allama Iqbal": {
        "iqbal_books_pdf": True
    },
    "Mufti Taqi Usmani": {
        "archive_query": "Mufti Taqi Usmani",
    },
    "Syed Abul A'la Maududi": {
        "archive_query": "Syed Maududi",
    },
    "Molana Tariq Jameel": {
        "youtube_playlist": "https://www.youtube.com/@TariqJamilOfficial",
    },
    "Maulana Abul Kalam Azad": {
        "archive_query": "Abul Kalam Azad",
    },
    "Shah Waliullah Dehlawi": {
        "archive_query": "Shah Waliullah",
    },
    "Dr. Zakir Naik": {
        "youtube_playlist": "https://www.youtube.com/playlist?list=PL030C3752C881D069",
    },
    "Sheikh Bilal Philips": {
        "youtube_playlist": "https://www.youtube.com/@DrBilalPhilips/videos",
    },
    "Shaykh Ahmad Didat": {
        "youtube_playlist": "https://www.youtube.com/playlist?list=PLAEF70AC4231931E3",
    },
    "Shaykh Muhammad Al-Ghazali": {
        "archive_query": "Muhammad Al Ghazali",
    },
    "Maulana Muhammad Ishaq Madni": {
        "archive_query": "Ishaq Madni",
    },
}

# =================== Main Loop ===================

if __name__ == "__main__":
    for scholar, sources in scholars.items():
        print(f"\n====== Processing scholar: {scholar} ======")
        scholar_dir = create_dir(BASE_DIR, scholar)

        if sources.get("iqbal_books_pdf"):
            download_iqbal_books_pdf(scholar_dir, scholar)

        if "archive_query" in sources:
            crawl_archive_org(sources["archive_query"], scholar_dir, scholar)

        if "youtube_playlist" in sources:
            download_youtube_playlist(sources["youtube_playlist"], scholar_dir, scholar)

        print(f"Completed processing for {scholar}")
