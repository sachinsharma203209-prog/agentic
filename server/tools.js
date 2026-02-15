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

export async function scrapeTool(url) {
  console.log("🔧 Tool called:", url);

  if (!url || typeof url !== "string") {
    throw new Error("Tool 'scrape' requires a URL string");
  }

  return `This is fake scraped content from ${url}`;
}
