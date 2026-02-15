# centeragent

Minimal Lovable-style AI architecture with clear separation:

- `app/` — Simple frontend chat client.
- `server/index.js` — Express API (`POST /chat`).
- `server/agent.js` — Agent orchestration + tool calling.
- `server/tools.js` — Tool definitions + Playwright website scraping.
- `server/memory.js` — In-memory conversation store.
- `server/db.js` — MongoDB persistence for chats and scrape results.

## Features

- Tool calling with OpenAI function tools (`scrape`)
- Real website scraping via Playwright
- MongoDB persistence for:
  - `chat_messages`
  - `scrape_results`

## Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment file:

   ```bash
   cp .env.example .env
   ```

3. Fill environment values (`OPENAI_API_KEY`, `MONGODB_URI`).

4. Start server:

   ```bash
   npm start
   ```

5. Open `app/index.html` in a browser.
