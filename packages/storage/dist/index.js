"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  MemoryStore: () => MemoryStore
});
module.exports = __toCommonJS(index_exports);

// src/memory-store.ts
var MemoryStore = class {
  constructor(config = {}) {
    this.sessions = /* @__PURE__ */ new Map();
    this.config = {
      type: "memory",
      ttl: 72e5,
      // 2 часа по умолчанию
      ...config
    };
  }
  // Получить сессию пользователя
  getSession(userId) {
    return this.sessions.get(userId) || null;
  }
  // Создать новую сессию
  createSession(userId) {
    const session = {
      userId,
      messages: [],
      currentEmotion: "NT",
      emotionScores: {},
      lastSuggestion: 0,
      lastR1Call: 0,
      sessionStart: Date.now(),
      metrics: {
        msgLen: 0,
        rollingTokens: 0,
        shortStreak: 0,
        sinceR1_msgs: 0,
        sinceR1_min: 0,
        emBlendScore: 100,
        highUncertainty: false
      }
    };
    this.sessions.set(userId, session);
    return session;
  }
  // Получить или создать сессию
  getOrCreateSession(userId) {
    return this.getSession(userId) || this.createSession(userId);
  }
  // Добавить сообщение в историю
  addMessage(userId, message) {
    const session = this.getOrCreateSession(userId);
    session.messages.push(message);
    if (session.messages.length > 100) {
      session.messages = session.messages.slice(-100);
    }
    this.sessions.set(userId, session);
  }
  // Получить последние сообщения
  getRecentMessages(userId, count = 10) {
    const session = this.getSession(userId);
    if (!session) {
      return [];
    }
    return session.messages.slice(-count);
  }
  // Обновить текущую эмоцию
  updateCurrentEmotion(userId, emotion) {
    const session = this.getOrCreateSession(userId);
    session.currentEmotion = emotion;
    this.sessions.set(userId, session);
  }
  // Обновить время последнего предложения медитации
  updateLastSuggestion(userId) {
    const session = this.getOrCreateSession(userId);
    session.lastSuggestion = Date.now();
    this.sessions.set(userId, session);
  }
  // Обновить время последнего вызова R1
  updateLastR1Call(userId) {
    const session = this.getOrCreateSession(userId);
    session.lastR1Call = Date.now();
    this.sessions.set(userId, session);
  }
  // Обновить метрики сессии
  updateMetrics(userId, metrics) {
    const session = this.getOrCreateSession(userId);
    session.metrics = metrics;
    this.sessions.set(userId, session);
  }
  // Очистить старые сессии
  cleanup() {
    const now = Date.now();
    const ttl = this.config.ttl || 72e5;
    for (const [userId, session] of this.sessions.entries()) {
      const lastActivity = Math.max(
        session.lastSuggestion,
        session.lastR1Call,
        session.messages.length > 0 ? session.messages[session.messages.length - 1].timestamp : 0
      );
      if (now - lastActivity > ttl) {
        this.sessions.delete(userId);
      }
    }
  }
  // Получить статистику хранилища
  getStats() {
    let totalMessages = 0;
    let oldestSession = Date.now();
    let newestSession = 0;
    for (const session of this.sessions.values()) {
      totalMessages += session.messages.length;
      if (session.sessionStart < oldestSession) {
        oldestSession = session.sessionStart;
      }
      if (session.sessionStart > newestSession) {
        newestSession = session.sessionStart;
      }
    }
    return {
      totalSessions: this.sessions.size,
      totalMessages,
      averageMessagesPerSession: this.sessions.size > 0 ? totalMessages / this.sessions.size : 0,
      oldestSession,
      newestSession
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MemoryStore
});
