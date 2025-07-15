import axios from 'axios';

const baseURL = "http://localhost:8000/api/ai_translations";

export async function translateText(text, targetLang) {
  try {
    const response = await axios.post(`${baseURL}/translate`, {
      text,
      target_lang: targetLang
    });
    return response.data.translated_text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;  // fallback to original text
  }
}
