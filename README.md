# centeragent

Minimal Lovable-style AI architecture with clear separation:

- `app/` — Simple frontend chat client.
- `server/index.js` — Express API (`POST /chat`).
- `server/agent.js` — Agent orchestration + tool calling.
- `server/tools.js` — Tool definitions and implementations.
- `server/memory.js` — In-memory conversation store.

## Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment file:

   ```bash
   cp .env.example .env
   ```

3. Add your OpenAI key to `.env`.

4. Start server:

   ```bash
   npm start
   ```

5. Open `app/index.html` in a browser.
