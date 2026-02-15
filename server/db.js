import { MongoClient } from "mongodb";

let client;
let database;
let dbDisabled = false;

export async function getDb() {
  if (dbDisabled) {
    return null;
  }

  if (database) {
    return database;
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "centeragent";

  if (!uri) {
    return null;
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    database = client.db(dbName);
    return database;
  } catch (error) {
    dbDisabled = true;
    console.warn("MongoDB unavailable, continuing without persistence:", error.message);
    return null;
  }
}

export async function saveChatMessage({ sessionId, role, content }) {
  const db = await getDb();
  if (!db) {
    return;
  }

  await db.collection("chat_messages").insertOne({
    sessionId,
    role,
    content,
    createdAt: new Date()
  });
}

export async function saveScrapeResult({ sessionId, url, title, content }) {
  const db = await getDb();
  if (!db) {
    return;
  }

  await db.collection("scrape_results").insertOne({
    sessionId,
    url,
    title,
    content,
    createdAt: new Date()
  });
}
