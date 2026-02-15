import express from "express";
import dotenv from "dotenv";
import { runAgent } from "./agent.js";
import { memory } from "./memory.js";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, sessionId = "default" } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "A string 'message' is required" });
  }

  try {
    const reply = await runAgent({ userMessage: message, sessionId });
    res.json({ reply, sessionId, historyLength: memory.get(sessionId).length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
