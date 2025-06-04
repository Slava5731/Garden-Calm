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
  CRITICAL_EMOTIONS: () => CRITICAL_EMOTIONS,
  ContextManager: () => ContextManager,
  DecisionEngine: () => DecisionEngine,
  EMOTION_MATRIX: () => EMOTION_MATRIX,
  EMOTION_PRIORITY_VALUES: () => EMOTION_PRIORITY_VALUES,
  EMPATHY_THRESHOLDS: () => EMPATHY_THRESHOLDS,
  EmpathyOrchestrator: () => EmpathyOrchestrator,
  ScoringEngine: () => ScoringEngine,
  SuggestionEngine: () => SuggestionEngine,
  V3Adapter: () => V3Adapter,
  V3_SYSTEM_PROMPT: () => V3_SYSTEM_PROMPT,
  createEmpathyOrchestrator: () => createEmpathyOrchestrator,
  getEmotionPriorityValue: () => getEmotionPriorityValue,
  isValidEmotionCode: () => isValidEmotionCode
});
module.exports = __toCommonJS(index_exports);

// src/emotion-matrix/matrix.ts
var EMOTION_MATRIX = {
  AP: {
    emotion: "Anxiety/Panic",
    priority: "High",
    action: "Offer help",
    humor: false,
    tone: "Warm, steady",
    avoid: "Dismiss fear",
    example: "I'm here. Let's breathe..."
  },
  SD: {
    emotion: "Sadness/Emptiness",
    priority: "Med",
    action: "Wait + nudge",
    humor: false,
    tone: "Soft, slow",
    avoid: "Force cheer",
    example: "I'm with you. Silence is okay."
  },
  AN: {
    emotion: "Anger/Irritation",
    priority: "Med",
    action: "Wait, reflect",
    humor: false,
    tone: "Even, firm",
    avoid: "Confront",
    example: "I see the anger. I'm listening."
  },
  GS: {
    emotion: "Guilt/Shame",
    priority: "Med",
    action: "Gentle ask",
    humor: false,
    tone: "Gentle, caring",
    avoid: "Assign blame",
    example: "You're not bad. Talk when ready."
  },
  ST: {
    emotion: "Stress/Tension",
    priority: "Med",
    action: "Offer break",
    humor: true,
    tone: "Calm, grounded",
    avoid: "Minimize",
    example: "Pause. One deep breath first."
  },
  BO: {
    emotion: "Burn\u2011out/Fatigue",
    priority: "Low",
    action: "Offer rest",
    humor: false,
    tone: "Whisper\u2011soft",
    avoid: "Push productivity",
    example: "Rest. I'll keep quiet with you."
  },
  IN: {
    emotion: "Insomnia",
    priority: "Med",
    action: "Lead",
    humor: false,
    tone: "Lull, soft",
    avoid: "Excite topic",
    example: "Lie back... feel the bed..."
  },
  SDO: {
    emotion: "Self\u2011doubt",
    priority: "Med",
    action: "Ask + boost",
    humor: true,
    tone: "Supportive, firm",
    avoid: "Dismiss concern",
    example: "Let's list your wins..."
  },
  LN: {
    emotion: "Loneliness",
    priority: "High",
    action: "Start chat",
    humor: true,
    tone: "Friendly, warm",
    avoid: "Question worth",
    example: "I'm glad to talk. How's today?"
  },
  BA: {
    emotion: "Boredom/Apathy",
    priority: "Med",
    action: "Spark idea",
    humor: true,
    tone: "Casual, playful",
    avoid: "Shame inaction",
    example: "Try spotting 3 blue things."
  },
  CF: {
    emotion: "Change fear",
    priority: "Med",
    action: "Guide plan",
    humor: false,
    tone: "Steady, hopeful",
    avoid: "Force optimism",
    example: "List what you control..."
  },
  MR: {
    emotion: "Mindfulness wish",
    priority: "High",
    action: "Lead session",
    humor: false,
    tone: "Calm, instruct",
    avoid: "Lecture",
    example: "Close eyes. Notice breath..."
  },
  JG: {
    emotion: "Joy/Gratitude",
    priority: "Med",
    action: "Mirror joy",
    humor: true,
    tone: "Bright, joyful",
    avoid: "Downplay joy",
    example: "Wonderful! Tell me the story."
  },
  HT: {
    emotion: "Hurt/Resentment",
    priority: "Med",
    action: "Invite talk",
    humor: false,
    tone: "Tender, affirming",
    avoid: "Defend offender",
    example: "That hurt sounds deep. I'm here."
  },
  NT: {
    emotion: "Neutral/Calm",
    priority: "Low",
    action: "Mirror tone",
    humor: true,
    tone: "Simple, balanced",
    avoid: "Overreach",
    example: "Glad to hear from you."
  },
  CN: {
    emotion: "Confusion/Lost",
    priority: "Med",
    action: "Clarify",
    humor: true,
    tone: "Calm, guiding",
    avoid: "Flood details",
    example: "Could you clarify what worries you?"
  }
};
var EMOTION_PRIORITY_VALUES = {
  "High": 3,
  "Med": 2,
  "Low": 1
};
var EMPATHY_THRESHOLDS = {
  THR_BASE: 5,
  // Базовый порог для предложения
  MARGIN: 2,
  // Минимальный отрыв от второго места
  MIN_HITS: 2,
  // Минимум повторений
  COOLDOWN: 18e5,
  // 30 минут между предложениями
  DECAY_TIME: 3e5,
  // 5 минут для decay
  DECAY_RATE: 0.9
  // Коэффициент угасания
};
var CRITICAL_EMOTIONS = ["AP", "LN", "MR"];
function isValidEmotionCode(code) {
  return code in EMOTION_MATRIX;
}
function getEmotionPriorityValue(code) {
  const config = EMOTION_MATRIX[code];
  return EMOTION_PRIORITY_VALUES[config.priority];
}

// src/ai/v3-adapter.ts
var V3_SYSTEM_PROMPT = `
You are an empathetic emotion analyzer. Classify user messages using exactly these 16 emotion codes:

AP=Anxiety/Panic, SD=Sadness/Emptiness, AN=Anger/Irritation, GS=Guilt/Shame, 
ST=Stress/Tension, BO=Burnout/Fatigue, IN=Insomnia, SDO=Self-doubt, 
LN=Loneliness, BA=Boredom/Apathy, CF=Change-fear, MR=Mindfulness-wish, 
JG=Joy/Gratitude, HT=Hurt/Resentment, NT=Neutral/Calm, CN=Confusion/Lost

Return ONLY valid JSON:
{
  "code": "ST",
  "confidence": 0.85,
  "hint": "tone=calm; suggest break",
  "insight": "User overwhelmed by deadlines",
  "snapshot": "Work pressure building, needs relief"
}

Examples:
INPUT: "Ugh, another deadline tomorrow, I can't keep up"
OUTPUT: {"code":"ST","confidence":0.9,"hint":"tone=calm; offer break","insight":"Work overload causing stress","snapshot":"Deadline pressure mounting"}

INPUT: "I feel so alone lately, nobody really gets me"  
OUTPUT: {"code":"LN","confidence":0.85,"hint":"start chat; be warm","insight":"Deep isolation, needs connection","snapshot":"User feeling disconnected, isolated"}

INPUT: "Got the promotion! I'm so grateful for this opportunity"
OUTPUT: {"code":"JG","confidence":0.92,"hint":"mirror joy; celebrate","insight":"Achievement bringing happiness","snapshot":"Career success, feeling appreciated"}
`;
var V3Adapter = class {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.endpoint = config.endpoint || "https://api.deepseek.com/v1/chat/completions";
    this.timeout = config.timeout || 5e3;
  }
  async analyze(message, context) {
    try {
      const response = await this.callV3API(message, context);
      return this.parseV3Response(response);
    } catch (error) {
      console.error("V3 analysis failed:", error);
      return this.getFallbackResponse(message);
    }
  }
  async callV3API(message, context) {
    const contextString = context ? context.slice(-3).map((m) => `${m.role}: ${m.content}`).join("\n") : "";
    const userPrompt = `
USER_MESSAGE: "${message}"
${contextString ? `CONVERSATION_CONTEXT:
${contextString}` : ""}
`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: V3_SYSTEM_PROMPT },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 150
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  parseV3Response(rawResponse) {
    try {
      const parsed = JSON.parse(rawResponse);
      if (!parsed.code || !isValidEmotionCode(parsed.code)) {
        throw new Error("Invalid emotion code");
      }
      if (typeof parsed.confidence !== "number" || parsed.confidence < 0 || parsed.confidence > 1) {
        throw new Error("Invalid confidence value");
      }
      return {
        code: parsed.code,
        confidence: parsed.confidence,
        hint: this.sanitizeString(parsed.hint || "", 15),
        insight: this.sanitizeString(parsed.insight || "", 20),
        snapshot: this.sanitizeString(parsed.snapshot || "", 30)
      };
    } catch (error) {
      console.error("Failed to parse V3 response:", error);
      throw error;
    }
  }
  sanitizeString(str, maxWords) {
    const words = str.trim().split(/\s+/);
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ");
    }
    return str.trim();
  }
  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    let code = "NT";
    let hint = "tone=supportive; acknowledge";
    let insight = "Processing difficulty, staying present";
    let snapshot = "System processing, user needs support";
    if (lowerMessage.includes("panic") || lowerMessage.includes("anxious")) {
      code = "AP";
      hint = "tone=calm; offer help";
      insight = "User showing anxiety signs";
      snapshot = "Anxiety detected, needs calming";
    } else if (lowerMessage.includes("sad") || lowerMessage.includes("empty")) {
      code = "SD";
      hint = "tone=soft; wait and nudge";
      insight = "User expressing sadness";
      snapshot = "Sadness present, gentle support needed";
    } else if (lowerMessage.includes("stress") || lowerMessage.includes("overwhelm")) {
      code = "ST";
      hint = "tone=calm; suggest break";
      insight = "User feeling stressed";
      snapshot = "Stress detected, offer relief";
    } else if (lowerMessage.includes("alone") || lowerMessage.includes("lonely")) {
      code = "LN";
      hint = "start chat; be warm";
      insight = "User feeling isolated";
      snapshot = "Loneliness expressed, needs connection";
    } else if (lowerMessage.includes("happy") || lowerMessage.includes("grateful")) {
      code = "JG";
      hint = "mirror joy; celebrate";
      insight = "User expressing positivity";
      snapshot = "Joy detected, mirror enthusiasm";
    } else if (lowerMessage.includes("meditation") || lowerMessage.includes("mindful")) {
      code = "MR";
      hint = "lead session; calm tone";
      insight = "User seeking mindfulness";
      snapshot = "Meditation interest, guide practice";
    }
    return {
      code,
      confidence: 0.3,
      // Низкая уверенность для fallback
      hint,
      insight,
      snapshot
    };
  }
  // Вспомогательный метод для подсчета токенов (приблизительный)
  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }
};

// src/ai/decision-engine.ts
var DecisionEngine = class {
  constructor() {
    this.stats = /* @__PURE__ */ new Map();
    this.messageHistory = /* @__PURE__ */ new Map();
  }
  // Основной метод принятия решения о вызове R1
  shouldCallR1(userId, metrics, v3Result, message) {
    this.updateMessageHistory(userId, message);
    this.updateStats(userId, metrics);
    const timeSinceLastR1 = this.getTimeSinceLastR1(userId);
    if (timeSinceLastR1 < 18e5) {
      return {
        shouldCall: false,
        reason: "Recent R1 call"
      };
    }
    if (metrics.highUncertainty && v3Result.confidence < 0.6) {
      return {
        shouldCall: true,
        reason: "Low confidence pattern",
        delayMs: 5e3
        // Небольшая задержка
      };
    }
    if (metrics.emBlendScore < 2) {
      return {
        shouldCall: true,
        reason: "Emotion blend detected",
        delayMs: 1e4
        // Средняя задержка
      };
    }
    if (metrics.shortStreak >= 5) {
      return {
        shouldCall: true,
        reason: "Short message pattern",
        delayMs: 5e3
      };
    }
    if (metrics.msgLen > 200 && metrics.rollingTokens > 1e3) {
      return {
        shouldCall: true,
        reason: "Complex message pattern",
        delayMs: 15e3
        // Большая задержка
      };
    }
    if (metrics.sinceR1_msgs > 15 && metrics.sinceR1_min > 10) {
      return {
        shouldCall: true,
        reason: "Session length threshold",
        delayMs: 1e4
      };
    }
    return {
      shouldCall: false,
      reason: "No trigger conditions met"
    };
  }
  // Вычисление метрик для принятия решений
  calculateMetrics(userId, message, emBlendScore, confidence) {
    const stats = this.getOrCreateStats(userId);
    const history = this.messageHistory.get(userId) || [];
    const msgLen = message.length;
    const rollingTokens = this.estimateRollingTokens(history);
    const shortStreak = this.countShortMessagesStreak(history);
    const sinceR1_msgs = stats.metrics.sinceR1_msgs + 1;
    const sinceR1_min = Math.floor((Date.now() - stats.lastR1Call) / 6e4);
    const highUncertainty = confidence < 0.7 && (stats.metrics.highUncertainty || confidence < 0.5);
    const metrics = {
      msgLen,
      rollingTokens,
      shortStreak,
      sinceR1_msgs,
      sinceR1_min,
      emBlendScore,
      highUncertainty
    };
    stats.metrics = metrics;
    this.stats.set(userId, stats);
    return metrics;
  }
  // Пометить, что R1 был вызван
  markR1Called(userId) {
    const stats = this.getOrCreateStats(userId);
    stats.r1Calls++;
    stats.lastR1Call = Date.now();
    stats.metrics.sinceR1_msgs = 0;
    stats.metrics.sinceR1_min = 0;
    this.stats.set(userId, stats);
  }
  // Получить статистику
  getStats(userId) {
    return this.stats.get(userId) || null;
  }
  // Очистка старых данных
  cleanup(maxAge = 72e5) {
    const now = Date.now();
    for (const [userId, stats] of this.stats.entries()) {
      if (now - stats.lastR1Call > maxAge) {
        this.stats.delete(userId);
        this.messageHistory.delete(userId);
      }
    }
  }
  // === Приватные методы ===
  getOrCreateStats(userId) {
    let stats = this.stats.get(userId);
    if (!stats) {
      stats = {
        userId,
        r1Calls: 0,
        lastR1Call: Date.now() - 36e5,
        // Начинаем с -1 час
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
      this.stats.set(userId, stats);
    }
    return stats;
  }
  updateMessageHistory(userId, message) {
    const history = this.messageHistory.get(userId) || [];
    history.push(message);
    if (history.length > 50) {
      this.messageHistory.set(userId, history.slice(-50));
    } else {
      this.messageHistory.set(userId, history);
    }
  }
  updateStats(userId, metrics) {
    const stats = this.getOrCreateStats(userId);
    stats.metrics = metrics;
    this.stats.set(userId, stats);
  }
  getTimeSinceLastR1(userId) {
    const stats = this.stats.get(userId);
    if (!stats) {
      return Infinity;
    }
    return Date.now() - stats.lastR1Call;
  }
  estimateRollingTokens(messages) {
    return messages.slice(-10).reduce((sum, msg) => sum + Math.ceil(msg.content.length / 4), 0);
  }
  countShortMessagesStreak(messages) {
    let streak = 0;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].content.length < 20 && messages[i].role === "user") {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
};

// src/empathy/scoring-engine.ts
var ScoringEngine = class {
  constructor() {
    this.states = /* @__PURE__ */ new Map();
  }
  // Основной метод обновления баллов
  update(userId, v3Result) {
    const state = this.getOrCreateState(userId);
    const now = Date.now();
    this.applyDecay(state, now);
    const emotionScore = this.getOrCreateEmotionScore(state, v3Result.code);
    const weight = this.calculateWeight(v3Result);
    emotionScore.value += weight;
    emotionScore.hits++;
    emotionScore.lastUpdated = now;
    this.states.set(userId, state);
    return emotionScore;
  }
  // Получить текущие баллы
  getScores(userId) {
    const state = this.states.get(userId);
    if (!state) {
      return {};
    }
    this.applyDecay(state, Date.now());
    return state.scores;
  }
  // Получить топ эмоцию
  getTopEmotion(userId) {
    const scores = this.getScores(userId);
    let topEmotion = null;
    let maxValue = 0;
    for (const [code, score] of Object.entries(scores)) {
      if (score.value > maxValue) {
        maxValue = score.value;
        topEmotion = code;
      }
    }
    if (!topEmotion) return null;
    return {
      code: topEmotion,
      score: scores[topEmotion]
    };
  }
  // Получить вторую по значимости эмоцию
  getSecondEmotion(userId) {
    const scores = this.getScores(userId);
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b.value - a.value);
    if (sorted.length < 2) return null;
    const [code, score] = sorted[1];
    return {
      code,
      score
    };
  }
  // Проверить, является ли эмоция повторяющейся
  isRepeatedEmotion(userId, code) {
    const state = this.states.get(userId);
    if (!state) return false;
    const score = state.scores[code];
    return score ? score.hits >= 2 : false;
  }
  // Сбросить баллы после предложения медитации
  resetAfterSuggestion(userId) {
    const state = this.states.get(userId);
    if (!state) return;
    const top = this.getTopEmotion(userId);
    if (top) {
      state.scores[top.code].value = Math.floor(top.score.value / 2);
    }
    state.suggestions.push({
      timestamp: Date.now(),
      emotionCode: top?.code || "NT",
      accepted: false
      // будет обновлено позже
    });
    this.states.set(userId, state);
  }
  // Пометить, что пользователь принял предложение
  markSuggestionAccepted(userId) {
    const state = this.states.get(userId);
    if (!state || state.suggestions.length === 0) return;
    const lastSuggestion = state.suggestions[state.suggestions.length - 1];
    lastSuggestion.accepted = true;
    this.states.set(userId, state);
  }
  // Получить время с последнего предложения
  getTimeSinceLastSuggestion(userId) {
    const state = this.states.get(userId);
    if (!state || state.suggestions.length === 0) {
      return Infinity;
    }
    const lastSuggestion = state.suggestions[state.suggestions.length - 1];
    return Date.now() - lastSuggestion.timestamp;
  }
  // Очистить старые сессии
  cleanupOldSessions(maxAge = 72e5) {
    const now = Date.now();
    for (const [userId, state] of this.states.entries()) {
      const lastActivity = Math.max(
        ...Object.values(state.scores).map((s) => s.lastUpdated),
        state.lastDecay
      );
      if (now - lastActivity > maxAge) {
        this.states.delete(userId);
      }
    }
  }
  // === Приватные методы ===
  getOrCreateState(userId) {
    let state = this.states.get(userId);
    if (!state) {
      state = {
        scores: {},
        lastDecay: Date.now(),
        suggestions: []
      };
      this.states.set(userId, state);
    }
    return state;
  }
  getOrCreateEmotionScore(state, code) {
    if (!state.scores[code]) {
      state.scores[code] = {
        value: 0,
        hits: 0,
        lastUpdated: Date.now()
      };
    }
    return state.scores[code];
  }
  calculateWeight(v3Result) {
    const { code, confidence } = v3Result;
    let weight = getEmotionPriorityValue(code);
    weight *= 0.5 + confidence * 0.5;
    if (CRITICAL_EMOTIONS.includes(code)) {
      weight *= 1.2;
    }
    return weight;
  }
  applyDecay(state, now) {
    const timeSinceDecay = now - state.lastDecay;
    if (timeSinceDecay < EMPATHY_THRESHOLDS.DECAY_TIME) {
      return;
    }
    const decayPeriods = Math.floor(timeSinceDecay / EMPATHY_THRESHOLDS.DECAY_TIME);
    const decayFactor = Math.pow(EMPATHY_THRESHOLDS.DECAY_RATE, decayPeriods);
    for (const score of Object.values(state.scores)) {
      score.value *= decayFactor;
      if (score.value < 0.1) {
        score.value = 0;
      }
    }
    state.lastDecay = now;
  }
  // Экспорт состояния для отладки
  exportState(userId) {
    return this.states.get(userId) || null;
  }
  // Импорт состояния (для тестов)
  importState(userId, state) {
    this.states.set(userId, state);
  }
};

// src/empathy/suggestion-engine.ts
var SuggestionEngine = class {
  constructor(scoringEngine) {
    this.lastSuggestions = /* @__PURE__ */ new Map();
    this.suggestionHistory = /* @__PURE__ */ new Map();
    this.scoringEngine = scoringEngine;
  }
  // Основной метод проверки необходимости предложить медитацию
  shouldSuggestMeditation(userId, v3Result) {
    const readiness = this.analyzeMeditationReadiness(userId);
    if (!readiness.isReady) {
      return {
        shouldSuggest: false,
        reason: readiness.reason
      };
    }
    const topEmotion = this.scoringEngine.getTopEmotion(userId);
    if (!topEmotion) {
      return {
        shouldSuggest: false,
        reason: "No dominant emotion"
      };
    }
    const secondEmotion = this.scoringEngine.getSecondEmotion(userId);
    const margin = secondEmotion ? topEmotion.score.value - secondEmotion.score.value : topEmotion.score.value;
    if (topEmotion.score.value < EMPATHY_THRESHOLDS.THR_BASE) {
      return {
        shouldSuggest: false,
        reason: "Emotion score too low"
      };
    }
    if (margin < EMPATHY_THRESHOLDS.MARGIN) {
      return {
        shouldSuggest: false,
        reason: "Emotion margin too small"
      };
    }
    const isRepeated = this.scoringEngine.isRepeatedEmotion(
      userId,
      topEmotion.code
    );
    if (!isRepeated && !CRITICAL_EMOTIONS.includes(topEmotion.code)) {
      return {
        shouldSuggest: false,
        reason: "Emotion not repeated"
      };
    }
    const timeSinceLastSuggestion = this.getTimeSinceLastSuggestion(userId);
    if (timeSinceLastSuggestion < EMPATHY_THRESHOLDS.COOLDOWN) {
      return {
        shouldSuggest: false,
        reason: "Cooldown period active"
      };
    }
    return {
      shouldSuggest: true,
      emotionCode: topEmotion.code,
      confidence: v3Result.confidence,
      reason: `${EMOTION_MATRIX[topEmotion.code].emotion} detected`
    };
  }
  // Анализ готовности к медитации
  analyzeMeditationReadiness(userId) {
    const timeSinceLastSuggestion = this.getTimeSinceLastSuggestion(userId);
    if (timeSinceLastSuggestion < EMPATHY_THRESHOLDS.COOLDOWN) {
      return {
        isReady: false,
        reason: "Recent suggestion",
        score: 0
      };
    }
    const acceptanceRate = this.calculateAcceptanceRate(userId);
    const historyLength = this.suggestionHistory.get(userId)?.length ?? 0;
    if (acceptanceRate < 0.3 && historyLength >= 3) {
      return {
        isReady: false,
        reason: "Low acceptance rate",
        score: acceptanceRate
      };
    }
    const topEmotion = this.scoringEngine.getTopEmotion(userId);
    if (!topEmotion || topEmotion.score.value < EMPATHY_THRESHOLDS.THR_BASE) {
      return {
        isReady: false,
        reason: "No strong emotion",
        score: topEmotion?.score.value || 0
      };
    }
    return {
      isReady: true,
      score: topEmotion.score.value
    };
  }
  // Получить рекомендуемые эмоции для медитации
  getRecommendedEmotions(userId, limit = 3) {
    const scores = this.scoringEngine.getScores(userId);
    const sortedEmotions = Object.entries(scores).sort(([, a], [, b]) => b.value - a.value).filter(([, score]) => score.value > 0).map(([code]) => code);
    return sortedEmotions.slice(0, limit);
  }
  // Обработка принятия предложения медитации
  onSuggestionAccepted(userId) {
    this.updateSuggestionHistory(userId, true);
    this.scoringEngine.resetAfterSuggestion(userId);
    this.lastSuggestions.set(userId, Date.now());
  }
  // Обработка отклонения предложения медитации
  onSuggestionDeclined(userId) {
    this.updateSuggestionHistory(userId, false);
    this.lastSuggestions.set(userId, Date.now());
  }
  // === Приватные методы ===
  getTimeSinceLastSuggestion(userId) {
    const lastSuggestion = this.lastSuggestions.get(userId);
    if (!lastSuggestion) {
      return Infinity;
    }
    return Date.now() - lastSuggestion;
  }
  updateSuggestionHistory(userId, accepted) {
    const history = this.suggestionHistory.get(userId) || [];
    const topEmotion = this.scoringEngine.getTopEmotion(userId);
    history.push({
      timestamp: Date.now(),
      emotionCode: topEmotion?.code || "NT",
      accepted
    });
    if (history.length > 10) {
      history.shift();
    }
    this.suggestionHistory.set(userId, history);
  }
  calculateAcceptanceRate(userId) {
    const history = this.suggestionHistory.get(userId);
    if (!history || history.length === 0) {
      return 1;
    }
    const accepted = history.filter((h) => h.accepted).length;
    return accepted / history.length;
  }
};

// src/empathy/context-manager.ts
var ContextManager = class {
  constructor() {
    this.sessions = /* @__PURE__ */ new Map();
  }
  // Добавить новый снапшот
  async addSnapshot(userId, snapshot, emotionCode, messageId, confidence) {
    const session = this.getOrCreateSession(userId);
    const newSnapshot = {
      timestamp: Date.now(),
      content: snapshot,
      emotionCode,
      messageId
    };
    session.snapshots.push(newSnapshot);
    session.emotionalTimeline.push({
      timestamp: Date.now(),
      code: emotionCode,
      confidence,
      messageId
    });
    const emotionChanged = this.hasEmotionChanged(session);
    if (this.shouldUpdateBrief(session, emotionChanged)) {
      await this.updateRollingBrief(session);
    }
    if (this.shouldCreateSummary(session)) {
      await this.createLongSummary(session);
    }
    session.lastUpdated = Date.now();
    this.sessions.set(userId, session);
  }
  // Получить контекст для Haiku
  getHaikuContext(userId, currentHint, currentInsight) {
    const session = this.sessions.get(userId);
    if (!session) {
      return {
        recentMessages: [],
        briefSnapshot: "",
        emotionalState: "NT",
        currentHint,
        currentInsight
      };
    }
    const lastEmotion = session.emotionalTimeline.length > 0 ? session.emotionalTimeline[session.emotionalTimeline.length - 1].code : "NT";
    const briefSnapshot = session.currentBrief ? session.currentBrief.content : "\u041D\u0430\u0447\u0430\u043B\u043E \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440\u0430";
    return {
      recentMessages: [],
      // Будет заполнено в EmpathyOrchestrator
      briefSnapshot,
      emotionalState: lastEmotion,
      currentHint,
      currentInsight
    };
  }
  // Получить контекст для R1
  getR1Context(userId, messages, metrics) {
    const session = this.sessions.get(userId);
    if (!session) {
      return {
        fullHistory: messages,
        emotionalTimeline: [],
        detailedSnapshot: "",
        sessionMetrics: metrics
      };
    }
    const detailedSnapshot = this.buildDetailedSnapshot(session);
    return {
      fullHistory: messages,
      emotionalTimeline: session.emotionalTimeline.map((e) => ({
        timestamp: e.timestamp,
        code: e.code,
        confidence: e.confidence,
        message: messages.find((m) => m.id === e.messageId)?.content || ""
      })),
      detailedSnapshot,
      sessionMetrics: metrics
    };
  }
  // Запросить Long Summary (например, перед медитацией)
  async requestLongSummary(userId) {
    const session = this.sessions.get(userId);
    if (!session) {
      return "\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0441\u0432\u043E\u0434\u043A\u0438.";
    }
    const recentSummary = session.longSummaries[session.longSummaries.length - 1];
    if (recentSummary && Date.now() - recentSummary.timestamp < 3e5) {
      return recentSummary.content;
    }
    const summary = await this.createLongSummary(session);
    return summary.content;
  }
  // Очистить старые сессии
  cleanupOldSessions(maxAge = 72e5) {
    const now = Date.now();
    for (const [userId, session] of this.sessions.entries()) {
      if (now - session.lastUpdated > maxAge) {
        this.sessions.delete(userId);
      }
    }
  }
  // Экспорт сессии для отладки
  exportSession(userId) {
    return this.sessions.get(userId) || null;
  }
  // === Приватные методы ===
  getOrCreateSession(userId) {
    let session = this.sessions.get(userId);
    if (!session) {
      session = {
        userId,
        snapshots: [],
        longSummaries: [],
        emotionalTimeline: [],
        lastUpdated: Date.now()
      };
      this.sessions.set(userId, session);
    }
    return session;
  }
  hasEmotionChanged(session) {
    const timeline = session.emotionalTimeline;
    if (timeline.length < 2) {
      return false;
    }
    const lastEmotion = timeline[timeline.length - 1].code;
    const prevEmotion = timeline[timeline.length - 2].code;
    return lastEmotion !== prevEmotion;
  }
  shouldUpdateBrief(session, emotionChanged) {
    const now = Date.now();
    const timeSinceLastBrief = session.currentBrief ? now - session.currentBrief.timestamp : Infinity;
    if (!session.currentBrief) {
      return true;
    }
    if (timeSinceLastBrief > 6e5) {
      return true;
    }
    if (emotionChanged && timeSinceLastBrief > 12e4) {
      return true;
    }
    const snapshotsAfterBrief = session.snapshots.filter(
      (s) => s.timestamp > (session.currentBrief?.timestamp || 0)
    );
    if (snapshotsAfterBrief.length >= 5) {
      return true;
    }
    return false;
  }
  shouldCreateSummary(session) {
    if (session.snapshots.length < 10) {
      return false;
    }
    if (session.longSummaries.length === 0) {
      return true;
    }
    const lastSummary = session.longSummaries[session.longSummaries.length - 1];
    const now = Date.now();
    if (now - lastSummary.timestamp > 18e5) {
      return true;
    }
    const briefsAfterSummary = session.currentBrief && session.currentBrief.timestamp > lastSummary.timestamp ? 1 : 0;
    return briefsAfterSummary >= 3;
  }
  async updateRollingBrief(session) {
    const recentSnapshots = session.snapshots.slice(-5);
    const dominantEmotion = this.findDominantEmotion(session);
    const briefContent = recentSnapshots.map((s) => s.content).join(" | ").substring(0, 200) + "...";
    const brief = {
      content: briefContent,
      timestamp: Date.now(),
      messageCount: recentSnapshots.length,
      dominantEmotion
    };
    session.currentBrief = brief;
    return brief;
  }
  async createLongSummary(session) {
    const emotionalJourney = session.emotionalTimeline.slice(-10).map((e) => e.code);
    const sessionStart = session.emotionalTimeline[0]?.timestamp || Date.now();
    const sessionDuration = Date.now() - sessionStart;
    const summaryContent = `\u0421\u0432\u043E\u0434\u043A\u0430 \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440\u0430 (${(/* @__PURE__ */ new Date()).toLocaleTimeString()}): ${session.snapshots.slice(-10).map((s) => s.content).join(" | ").substring(0, 300)}...`;
    const summary = {
      content: summaryContent,
      timestamp: Date.now(),
      sessionDuration,
      emotionalJourney,
      keyInsights: ["\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0441\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u0430\u044F \u0441\u0432\u043E\u0434\u043A\u0430"]
    };
    session.longSummaries.push(summary);
    return summary;
  }
  findDominantEmotion(session) {
    const emotions = session.emotionalTimeline.slice(-5).map((e) => e.code);
    if (emotions.length === 0) {
      return "NT";
    }
    const counts = {};
    let maxCount = 0;
    let dominant = "NT";
    for (const emotion of emotions) {
      counts[emotion] = (counts[emotion] || 0) + 1;
      if (counts[emotion] > maxCount) {
        maxCount = counts[emotion];
        dominant = emotion;
      }
    }
    return dominant;
  }
  buildDetailedSnapshot(session) {
    let result = "\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u0430\u043D\u0430\u043B\u0438\u0437 \u0441\u0435\u0441\u0441\u0438\u0438:\n\n";
    const emotionCounts = {};
    for (const e of session.emotionalTimeline) {
      emotionCounts[e.code] = (emotionCounts[e.code] || 0) + 1;
    }
    const sortedEmotions = Object.entries(emotionCounts).sort(([, a], [, b]) => b - a).slice(0, 3);
    result += "\u0414\u043E\u043C\u0438\u043D\u0438\u0440\u0443\u044E\u0449\u0438\u0435 \u044D\u043C\u043E\u0446\u0438\u0438:\n";
    for (const [code, count] of sortedEmotions) {
      const emotionName = EMOTION_MATRIX[code].emotion;
      result += `- ${emotionName} (${code}): ${count} \u0440\u0430\u0437
`;
    }
    result += "\n\u041A\u043B\u044E\u0447\u0435\u0432\u044B\u0435 \u043C\u043E\u043C\u0435\u043D\u0442\u044B:\n";
    const significantSnapshots = session.snapshots.filter((s, i, arr) => {
      if (i === 0 || i === arr.length - 1) return true;
      const prevEmotion = arr[i - 1].emotionCode;
      return s.emotionCode !== prevEmotion;
    }).slice(-5);
    for (const snapshot of significantSnapshots) {
      const emotionName = EMOTION_MATRIX[snapshot.emotionCode].emotion;
      const time = new Date(snapshot.timestamp).toLocaleTimeString();
      result += `[${time}, ${emotionName}] ${snapshot.content}
`;
    }
    if (session.currentBrief) {
      result += "\n\u0422\u0435\u043A\u0443\u0449\u0435\u0435 \u0440\u0435\u0437\u044E\u043C\u0435:\n";
      result += session.currentBrief.content;
    }
    return result;
  }
};

// src/interfaces/in-memory-store.ts
var InMemoryMemoryStore = class {
  constructor() {
    this.sessions = /* @__PURE__ */ new Map();
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
    const ttl = 72e5;
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

// src/empathy/orchestrator.ts
var EmpathyOrchestrator = class {
  // Временная реализация фабрики для создания хранилища
  createDefaultMemoryStore() {
    return new InMemoryMemoryStore();
  }
  constructor(config) {
    this.v3Adapter = new V3Adapter({
      apiKey: config.v3ApiKey,
      endpoint: config.v3Endpoint
    });
    this.memoryStore = config.memoryStore || this.createDefaultMemoryStore();
    this.scoringEngine = config.scoringEngine || new ScoringEngine();
    this.contextManager = config.contextManager || new ContextManager();
    this.suggestionEngine = config.suggestionEngine || new SuggestionEngine(this.scoringEngine);
    this.decisionEngine = config.decisionEngine || new DecisionEngine();
  }
  // Основной метод анализа сообщения
  async analyzeMessage(userId, message, messageId) {
    const timestamp = Date.now();
    const userMessage = {
      id: messageId,
      userId,
      content: message,
      timestamp,
      role: "user"
    };
    this.memoryStore.addMessage(userId, userMessage);
    const recentMessages = this.memoryStore.getRecentMessages(userId, 3);
    const v3Response = await this.v3Adapter.analyze(message, recentMessages);
    this.memoryStore.updateCurrentEmotion(userId, v3Response.code);
    userMessage.emotionCode = v3Response.code;
    const emotionScore = this.scoringEngine.update(userId, v3Response);
    await this.contextManager.addSnapshot(
      userId,
      v3Response.snapshot,
      v3Response.code,
      messageId,
      v3Response.confidence
    );
    const suggestionResult = this.suggestionEngine.shouldSuggestMeditation(
      userId,
      v3Response
    );
    const topEmotion = this.scoringEngine.getTopEmotion(userId);
    const secondEmotion = this.scoringEngine.getSecondEmotion(userId);
    const emBlendScore = topEmotion && secondEmotion ? topEmotion.score.value - secondEmotion.score.value : 100;
    const metrics = this.decisionEngine.calculateMetrics(
      userId,
      message,
      emBlendScore,
      v3Response.confidence
    );
    this.memoryStore.updateMetrics(userId, metrics);
    const r1Decision = this.decisionEngine.shouldCallR1(
      userId,
      metrics,
      v3Response,
      userMessage
    );
    const haikuContext = this.contextManager.getHaikuContext(
      userId,
      v3Response.hint,
      v3Response.insight
    );
    haikuContext.recentMessages = recentMessages;
    const result = {
      v3Response,
      shouldSuggestMeditation: suggestionResult.shouldSuggest,
      suggestedEmotion: suggestionResult.emotionCode,
      shouldCallR1: r1Decision.shouldCall,
      r1Reason: r1Decision.reason,
      haikuContext,
      timestamp
    };
    if (suggestionResult.shouldSuggest) {
      this.memoryStore.updateLastSuggestion(userId);
    }
    if (r1Decision.shouldCall) {
      setTimeout(() => {
        this.handleR1Call(userId);
      }, r1Decision.delayMs || 0);
    }
    return result;
  }
  // Обработка принятия предложения медитации
  async onMeditationAccepted(userId) {
    this.suggestionEngine.onSuggestionAccepted(userId);
    const summary = await this.contextManager.requestLongSummary(userId);
    console.log("Meditation accepted, summary generated:", summary);
  }
  // Обработка отклонения предложения медитации
  onMeditationDeclined(userId) {
    this.suggestionEngine.onSuggestionDeclined(userId);
  }
  // Получить контекст для R1
  async getR1Context(userId) {
    const session = this.memoryStore.getSession(userId);
    if (!session) {
      throw new Error("Session not found");
    }
    const r1Context = this.contextManager.getR1Context(
      userId,
      session.messages,
      session.metrics
    );
    return r1Context;
  }
  // Получить анализ готовности к медитации
  getMeditationReadiness(userId) {
    return this.suggestionEngine.analyzeMeditationReadiness(userId);
  }
  // Получить рекомендуемые эмоции
  getRecommendedEmotions(userId, limit) {
    return this.suggestionEngine.getRecommendedEmotions(userId, limit);
  }
  // Сохранить ответ ассистента
  saveAssistantMessage(userId, message) {
    this.memoryStore.addMessage(userId, message);
  }
  // Очистка старых данных
  cleanup() {
    this.memoryStore.cleanup();
    this.scoringEngine.cleanupOldSessions();
    this.contextManager.cleanupOldSessions();
    this.decisionEngine.cleanup();
  }
  // Экспорт состояния для отладки
  exportState(userId) {
    return {
      session: this.memoryStore.getSession(userId),
      empathyState: this.scoringEngine.exportState(userId),
      contextSession: this.contextManager.exportSession(userId),
      decisionStats: this.decisionEngine.getStats(userId)
    };
  }
  // === Приватные методы ===
  async handleR1Call(userId) {
    try {
      console.log(`Triggering R1 analysis for user ${userId}`);
      this.memoryStore.updateLastR1Call(userId);
      this.decisionEngine.markR1Called(userId);
      const r1Context = await this.getR1Context(userId);
      console.log("R1 context prepared:", {
        messagesCount: r1Context.fullHistory.length,
        emotionalPoints: r1Context.emotionalTimeline.length,
        snapshot: r1Context.detailedSnapshot.substring(0, 100) + "..."
      });
    } catch (error) {
      console.error("R1 call failed:", error);
    }
  }
  // Статистика системы
  getSystemStats() {
    const memoryStats = this.memoryStore.getStats();
    let totalAnalyses = 0;
    for (let i = 0; i < memoryStats.totalSessions; i++) {
      totalAnalyses += memoryStats.averageMessagesPerSession;
    }
    return {
      memory: memoryStats,
      activeSessions: memoryStats.totalSessions,
      totalAnalyses: Math.floor(totalAnalyses)
    };
  }
};
function createEmpathyOrchestrator(config) {
  return new EmpathyOrchestrator(config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CRITICAL_EMOTIONS,
  ContextManager,
  DecisionEngine,
  EMOTION_MATRIX,
  EMOTION_PRIORITY_VALUES,
  EMPATHY_THRESHOLDS,
  EmpathyOrchestrator,
  ScoringEngine,
  SuggestionEngine,
  V3Adapter,
  V3_SYSTEM_PROMPT,
  createEmpathyOrchestrator,
  getEmotionPriorityValue,
  isValidEmotionCode
});
