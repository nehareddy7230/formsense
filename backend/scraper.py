import httpx
from bs4 import BeautifulSoup
import fitz
from playwright.async_api import async_playwright
import traceback


async def scrape_url(url: str) -> str:
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }

        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(
                url,
                headers=headers,
                follow_redirects=True
            )
            response.raise_for_status()

        content_type = response.headers.get("content-type", "")

        # PDF
        if "pdf" in content_type or url.lower().endswith(".pdf"):
            pdf = fitz.open(stream=response.content, filetype="pdf")
            text = ""
            for page in pdf:
                text += page.get_text()
            return text[:8000]

        # HTML
        soup = BeautifulSoup(response.text, "html.parser")

        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()

        text = soup.get_text(separator="\n")
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        clean_text = "\n".join(lines)

        if len(clean_text) > 500:
            print("Using HTTPX scrape")
            return clean_text[:8000]

        print("Using Playwright scrape")
        return await scrape_with_playwright(url)

    except Exception as e:
        print("HTTPX Error:", str(e))
        print("Using Playwright scrape")
        return await scrape_with_playwright(url)


async def scrape_with_playwright(url: str) -> str:
    try:
        print("Starting Playwright")

        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    "--no-sandbox",
                    "--disable-dev-shm-usage"
                ]
            )

            page = await browser.new_page(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            )

            await page.goto(
                url,
                wait_until="networkidle",
                timeout=30000
            )

            await page.wait_for_timeout(2000)

            text = await page.inner_text("body")

            await browser.close()

            lines = [line.strip() for line in text.splitlines() if line.strip()]
            clean_text = "\n".join(lines)

            return clean_text[:8000]

    except Exception as e:
        print("Playwright Error:", str(e))
        print(traceback.format_exc())

        return (
            f"Error scraping URL:\n\n"
            f"{str(e)}\n\n"
            f"{traceback.format_exc()}"
        )