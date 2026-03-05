import httpx
from bs4 import BeautifulSoup
import fitz
import io
from playwright.async_api import async_playwright

async def scrape_url(url: str) -> str:
    try:
        # First try fast method
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(url, headers=headers, follow_redirects=True)
            response.raise_for_status()

        content_type = response.headers.get("content-type", "")

        # If it's a PDF URL
        if "pdf" in content_type or url.lower().endswith(".pdf"):
            pdf = fitz.open(stream=response.content, filetype="pdf")
            text = ""
            for page in pdf:
                text += page.get_text()
            return text[:8000]

        # Try fast scrape first
        soup = BeautifulSoup(response.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        text = soup.get_text(separator="\n")
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        clean_text = "\n".join(lines)

        # If we got enough text, return it
        if len(clean_text) > 500:
            return clean_text[:8000]

        # Otherwise use Playwright for JS-heavy sites
        return await scrape_with_playwright(url)

    except Exception:
        # Fallback to Playwright
        return await scrape_with_playwright(url)


async def scrape_with_playwright(url: str) -> str:
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            )
            await page.goto(url, wait_until="networkidle", timeout=30000)
            await page.wait_for_timeout(2000)  # wait 2s for JS to finish

            # Get full page text
            text = await page.inner_text("body")
            await browser.close()

            lines = [line.strip() for line in text.splitlines() if line.strip()]
            clean_text = "\n".join(lines)
            return clean_text[:8000]

    except Exception as e:
        return f"Error scraping URL: {str(e)}"