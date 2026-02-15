import OpenAI from "openai";
import { scrapeTool, toolSpecs } from "./tools.js";
import { memory } from "./memory.js";
import { saveChatMessage } from "./db.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function toToolRoleMessage(toolCallId, content) {
  return {
    role: "tool",
    tool_call_id: toolCallId,
    content
  };
}

async function executeToolCall(toolCall, sessionId) {
  const { name, arguments: argsString } = toolCall.function;
  const args = JSON.parse(argsString || "{}");

  if (name === "scrape") {
    return scrapeTool(args.url, sessionId);
  }

  throw new Error(`Unknown tool: ${name}`);
}

export async function runAgent({ userMessage, sessionId = "default" }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
  }

  await saveChatMessage({ sessionId, role: "user", content: userMessage });

  const priorMessages = memory.get(sessionId);

  const firstResponse = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a smart AI agent. Use tools if needed." },
      ...priorMessages,
      { role: "user", content: userMessage }
    ],
    tools: toolSpecs
  });

  const message = firstResponse.choices[0].message;
  const newMemoryMessages = [{ role: "user", content: userMessage }];

  if (message.tool_calls?.length) {
    const toolMessages = [];

    for (const toolCall of message.tool_calls) {
      const toolResult = await executeToolCall(toolCall, sessionId);
      toolMessages.push(toToolRoleMessage(toolCall.id, toolResult));
    }

    const finalResponse = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a smart AI agent." },
        ...priorMessages,
        { role: "user", content: userMessage },
        message,
        ...toolMessages
      ]
    });

    const finalText = finalResponse.choices[0].message.content || "";
    newMemoryMessages.push({ role: "assistant", content: finalText });
    memory.append(sessionId, newMemoryMessages);
    await saveChatMessage({ sessionId, role: "assistant", content: finalText });
    return finalText;
  }

  const directText = message.content || "";
  newMemoryMessages.push({ role: "assistant", content: directText });
  memory.append(sessionId, newMemoryMessages);
  await saveChatMessage({ sessionId, role: "assistant", content: directText });
  return directText;
}
