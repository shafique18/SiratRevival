from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def scrape_archive():
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # run in headless mode
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")

    # Path to chromedriver, adjust if needed
    service = Service('/Users/shafique.khan@diconium.com/Downloads/chromedriver-mac-x64/chromedriver')  

    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.get("https://archive.org/search?query=Mufti+Taqi+Usmani")

    try:
        # Wait until at least one article with class 'cell-container' is visible
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "article.cell-container"))
        )

        # Now find all article elements representing search results
        articles = driver.find_elements(By.CSS_SELECTOR, "article.cell-container")

        results = []
        for article in articles:
            # The visible content is inside a shadow DOM or React components, but the article itself
            # should have some attributes or inner text after rendering.
            # Let's extract the title or link from child elements.

            # Try to find a title link inside the article
            try:
                title_link = article.find_element(By.CSS_SELECTOR, "a.result-title")
                title = title_link.text.strip()
                url = title_link.get_attribute("href")
                results.append({"title": title, "url": url})
            except:
                # If no link found, skip this article
                continue

        return results

    finally:
        driver.quit()

if __name__ == "__main__":
    items = scrape_archive()
    for item in items:
        print(item)
