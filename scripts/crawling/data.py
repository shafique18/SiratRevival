import os
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from PyPDF2 import PdfReader
import yt_dlp
import whisper
import json
import pdfplumber
import pytesseract
from PIL import Image
import io

# =================== Config ===================
BASE_DIR = "./scholar_data"
WHISPER_MODEL = whisper.load_model("base")

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

def extract_text_from_pdf(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        text = "\n".join([page.extract_text() or '' for page in reader.pages])
        return text
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""

def save_metadata(scholar, data):
    meta_path = os.path.join(BASE_DIR, scholar.replace(" ", "_"), "metadata.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def text_cleaner(text):
    """
    Clean Quran/Hadith or generic text:
    - Remove common Quranic symbols and footnotes
    - But preserve letters from any language
    - Avoid aggressive diacritic removal to keep non-Arabic scripts intact
    """
    # Remove footnotes like [1], (comment), Quranic symbol ۞
    text = re.sub(r'\[[^\]]*\]', '', text)
    text = re.sub(r'\(.*?\)', '', text)
    text = re.sub(r'۞', '', text)

    # Remove ONLY Arabic diacritics, keep other languages intact
    text = re.sub(r'[\u0617-\u061A\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]', '', text)

    # Normalize whitespace
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
    
def fix_spacing(text):
    # Add space before uppercase letter if no space before it (camel case splitting)
    text = re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', text)
    # Add space between letter followed by digit or vice versa
    text = re.sub(r'(?<=[a-zA-Z])(?=\d)', ' ', text)
    text = re.sub(r'(?<=\d)(?=[a-zA-Z])', ' ', text)
    # Normalize multiple spaces
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_text_from_pdf(pdf_path):
    text = extract_text_from_pdf_pdfplumber(pdf_path)
    cleaned = text_cleaner(text)
    fixed = fix_spacing(cleaned)
    return fixed

def ocr_page_image(page):
    # Extract page image
    im = page.to_image(resolution=300).original
    # Run OCR on PIL Image
    text = pytesseract.image_to_string(im, lang='eng+ara+urd')  # add your languages
    return text

def extract_text_from_pdf_with_ocr(pdf_path, min_text_length=1000):
    """
    Try extracting text with pdfplumber first.
    If text is too short or poor, fallback to OCR on each page.
    """
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            # Extract text normally
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

        if len(text) < min_text_length or not is_meaningful(text):
            print("Extracted text too short or not meaningful, running OCR fallback...")
            text = ""
            with pdfplumber.open(pdf_path) as pdf:
                for i, page in enumerate(pdf.pages):
                    print(f"OCR processing page {i+1}/{len(pdf.pages)}...")
                    page_text = ocr_page_image(page)
                    text += page_text + "\n"

        return text
    except Exception as e:
        print(f"Error extracting or OCRing PDF: {e}")
        return ""
    
def is_meaningful(text):
    # Basic heuristic to check if text contains enough words
    words = text.strip().split()
    return len(words) > 100  # arbitrary threshold, adjust if needed

def is_pdf_scanned(pdf_path, threshold=100):
    """
    Returns True if PDF is likely scanned (mostly images), False otherwise.
    threshold: minimum number of characters expected for non-scanned PDF
    """
    try:
        with pdfplumber.open(pdf_path) as pdf:
            total_text = ""
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    total_text += text
            # If extracted text length is less than threshold, assume scanned
            if len(total_text.strip()) < threshold:
                return True
            else:
                return False
    except Exception as e:
        print(f"Error checking scanned status: {e}")
        # Assume scanned if error reading PDF
        return True

# =================== Whisper Transcription with Auto Language Detection ===================

def transcribe_audio_whisper(audio_path):
    """
    Transcribe audio with Whisper using auto language detection.
    """
    try:
        print(f"Transcribing (auto language detection): {audio_path}")
        result = WHISPER_MODEL.transcribe(audio_path)  # auto detect language
        cleaned_text = text_cleaner(result["text"])
        return cleaned_text
    except Exception as e:
        print(f"Whisper error: {e}")
        return ""

# =================== Iqbal Cyber Library Books PDF Downloader ===================

def download_iqbal_books_pdf(scholar_dir, scholar):
    """
    Crawl https://www.iqbalcyberlibrary.net/en/listbooks/listbytitle.php
    - Extract book table rows
    - For each row, get the book html link (6th column)
    - From that page, get the pdf link and download
    - Extract text from PDF and save metadata
    """
    base_list_url = "https://www.iqbalcyberlibrary.net/en/listbooks/listbytitle.php"
    print(f"Fetching Iqbal books list from: {base_list_url}")

    content = []
    try:
        response = requests.get(base_list_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
        
        # Find the main table (assuming first table)
        table = soup.find("table")
        if not table:
            print("No table found on the page!")
            return

        rows = table.find_all("tr")[1:]  # Skip header row
        for row in rows[:3]:
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

            # Visit book page to find PDF link
            book_response = requests.get(book_page_url)
            book_response.raise_for_status()
            book_soup = BeautifulSoup(book_response.content, "html.parser")

            # PDF link heuristic: find <a> with href ending with .pdf under known container
            pdf_link_tag = None
            for a in book_soup.find_all("a", href=True):
                href = a['href']
                if href.endswith(".pdf"):
                    pdf_link_tag = a
                    break
            
            if not pdf_link_tag:
                print(f"No PDF found for book: {title}")
                continue

            pdf_url = urljoin(book_page_url, pdf_link_tag['href'])
            print(f"Downloading PDF: {pdf_url}")
            pdf_path = download_file(pdf_url, scholar_dir)
            pdf_text = extract_text_from_pdf(pdf_path)
            pdf_text = text_cleaner(pdf_text)

            content.append({
                "type": "pdf",
                "title": title,
                "text": pdf_text,
                "source": pdf_url
            })

        save_metadata(scholar, content)

    except Exception as e:
        print(f"Error downloading Iqbal books PDF: {e}")

# =================== Archive.org Crawler ===================

def crawl_archive_org(query, scholar_dir, scholar, max_results=5):
    base_url = f"https://archive.org/search.php?query={query.replace(' ', '+')}"
    print(f"Searching Archive.org for: {query}")
    response = requests.get(base_url)
    soup = BeautifulSoup(response.text, "html.parser")
    links = soup.select('div.C234 a[href^="/details/"]')
    content = []
    for link in links[:max_results]:
        item_url = urljoin("https://archive.org", link['href'])
        print(f"Found: {item_url}")
        try:
            sub_response = requests.get(item_url)
            sub_soup = BeautifulSoup(sub_response.text, "html.parser")
            files = sub_soup.select('a[href$=".pdf"], a[href$=".mp3"], a[href$=".mp4"]')
            for file in files:
                file_url = urljoin(item_url, file['href'])
                downloaded = download_file(file_url, scholar_dir)
                if downloaded.endswith(".pdf"):
                    pdf_text = extract_text_from_pdf_with_ocr(downloaded)
                    pdf_text = text_cleaner(pdf_text)
                    pdf_text = fix_spacing(pdf_text)
                    # pdf_text = extract_text_from_pdf(downloaded)
                    # pdf_text = text_cleaner(pdf_text)
                    content.append({"type": "pdf", "text": pdf_text, "source": file_url})
                elif downloaded.endswith(".mp3"):
                    transcription = transcribe_audio_whisper(downloaded)
                    content.append({"type": "audio", "text": transcription, "source": file_url})
        except Exception as e:
            print(f"Error: {e}")
    save_metadata(scholar, content)

# =================== YouTube Downloader ===================

def download_youtube_playlist(playlist_url, scholar_dir, scholar):
    content = []
    ydl_opts = {
        'outtmpl': f'{scholar_dir}/%(title)s.%(ext)s',
        'format': 'bestaudio/best',
        'quiet': True,
        'no_warnings': True,
    }

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
    save_metadata(scholar, content)

# =================== Scholar Map ===================

scholars = {
    # "Dr. Israr Ahmed": {
    #     "archive_query": "Dr Israr Ahmed",
    #     "youtube_playlist": "https://www.youtube.com/playlist?list=PL9E2D7EE6E2E0AC49"
    # },
    "Allama Iqbal": {
        "iqbal_books_pdf": True
    },
    "Mufti Taqi Usmani": {
        "archive_query": "Mufti Taqi Usmani",
    },
    "Syed Abul A'la Maududi": {
        "archive_query": "Syed Maududi",
        "html_books_index": "https://www.englishtafsir.com/Quran/001/index.html"
    },
    "Molana Tariq Jameel": {
        "youtube_playlist": "https://www.youtube.com/@TariqJamilOfficial"
    },
    "Maulana Abul Kalam Azad": {
        "archive_query": "Abul Kalam Azad",
    },
    "Shah Waliullah Dehlawi": {
        "archive_query": "Shah Waliullah",
    },
    "Dr. Zakir Naik": {
        "youtube_playlist": "https://www.youtube.com/playlist?list=PL030C3752C881D069"
    },
    "Sheikh Bilal Philips": {
        "youtube_playlist": "https://www.youtube.com/@DrBilalPhilips/videos"
    },
    "Shaykh Ahmad Didat": {
        "youtube_playlist": "https://www.youtube.com/playlist?list=PLAEF70AC4231931E3"
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
        scholar_dir = create_dir(BASE_DIR, scholar)
        if "iqbal_books_pdf" in sources:
            download_iqbal_books_pdf(scholar_dir, scholar)
        if "archive_query" in sources:
            crawl_archive_org(sources["archive_query"], scholar_dir, scholar)
        if "youtube_playlist" in sources:
            download_youtube_playlist(sources["youtube_playlist"], scholar_dir, scholar)
        if "html_books_index" in sources:
            # You can still implement or keep the original HTML parser here if needed
            pass


    print("✅ All tasks completed. Check scholar_data/ for results.")
