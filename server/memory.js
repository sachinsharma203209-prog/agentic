class ConversationMemory {
  constructor(limit = 12) {
    this.limit = limit;
    this.store = new Map();
  }

  get(sessionId) {
    return this.store.get(sessionId) || [];
  }

  append(sessionId, messages) {
    const current = this.get(sessionId);
    const next = [...current, ...messages].slice(-this.limit);
    this.store.set(sessionId, next);
    return next;
  }

  clear(sessionId) {
    this.store.delete(sessionId);
  }
}

export const memory = new ConversationMemory();
