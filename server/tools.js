import { chromium } from "playwright";
import { saveScrapeResult } from "./db.js";

export const toolSpecs = [
  {
    type: "function",
    function: {
      name: "scrape",
      description: "Scrape website content",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "Website URL to scrape" }
        },
        required: ["url"]
      }
    }
  }
];

export async function scrapeTool(url, sessionId = "default") {
  if (!url || typeof url !== "string") {
    throw new Error("Tool 'scrape' requires a URL string");
  }

  console.log("🔧 Tool called:", url);

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const title = await page.title();
    const textContent = await page.evaluate(() => {
      return (document.body?.innerText || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 4000);
    });

    await saveScrapeResult({
      sessionId,
      url,
      title,
      content: textContent
    });

    return `Scraped ${url}\nTitle: ${title}\nContent: ${textContent}`;
  } finally {
    await browser.close();
  }
}
