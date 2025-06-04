import { V3Response, Message } from '../types';
import { EmotionCode } from '../types/emotion';
import { isValidEmotionCode } from '../emotion-matrix/matrix';

// System prompt для V3
export const V3_SYSTEM_PROMPT = `
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

export class V3Adapter {
  private apiKey: string;
  private endpoint: string;
  private timeout: number;

  constructor(config: {
    apiKey: string;
    endpoint?: string;
    timeout?: number;
  }) {
    this.apiKey = config.apiKey;
    this.endpoint = config.endpoint || 'https://api.deepseek.com/v1/chat/completions';
    this.timeout = config.timeout || 5000;
  }

  async analyze(message: string, context?: Message[]): Promise<V3Response> {
    try {
      const response = await this.callV3API(message, context);
      return this.parseV3Response(response);
    } catch (error) {
      console.error('V3 analysis failed:', error);
      return this.getFallbackResponse(message);
    }
  }

  private async callV3API(message: string, context?: Message[]): Promise<any> {
    const contextString = context 
      ? context.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')
      : '';

    const userPrompt = `
USER_MESSAGE: "${message}"
${contextString ? `CONVERSATION_CONTEXT:\n${contextString}` : ''}
`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: V3_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
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

  private parseV3Response(rawResponse: string): V3Response {
    try {
      const parsed = JSON.parse(rawResponse);
      
      // Валидация обязательных полей
      if (!parsed.code || !isValidEmotionCode(parsed.code)) {
        throw new Error('Invalid emotion code');
      }

      if (typeof parsed.confidence !== 'number' || parsed.confidence < 0 || parsed.confidence > 1) {
        throw new Error('Invalid confidence value');
      }

      return {
        code: parsed.code as EmotionCode,
        confidence: parsed.confidence,
        hint: this.sanitizeString(parsed.hint || '', 15),
        insight: this.sanitizeString(parsed.insight || '', 20),
        snapshot: this.sanitizeString(parsed.snapshot || '', 30)
      };
    } catch (error) {
      console.error('Failed to parse V3 response:', error);
      throw error;
    }
  }

  private sanitizeString(str: string, maxWords: number): string {
    const words = str.trim().split(/\s+/);
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ');
    }
    return str.trim();
  }

  private getFallbackResponse(message: string): V3Response {
    // Простая эвристика для fallback
    const lowerMessage = message.toLowerCase();
    
    let code: EmotionCode = 'NT';
    let hint = 'tone=supportive; acknowledge';
    let insight = 'Processing difficulty, staying present';
    let snapshot = 'System processing, user needs support';

    // Базовое распознавание ключевых слов
    if (lowerMessage.includes('panic') || lowerMessage.includes('anxious')) {
      code = 'AP';
      hint = 'tone=calm; offer help';
      insight = 'User showing anxiety signs';
      snapshot = 'Anxiety detected, needs calming';
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('empty')) {
      code = 'SD';
      hint = 'tone=soft; wait and nudge';
      insight = 'User expressing sadness';
      snapshot = 'Sadness present, gentle support needed';
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelm')) {
      code = 'ST';
      hint = 'tone=calm; suggest break';
      insight = 'User feeling stressed';
      snapshot = 'Stress detected, offer relief';
    } else if (lowerMessage.includes('alone') || lowerMessage.includes('lonely')) {
      code = 'LN';
      hint = 'start chat; be warm';
      insight = 'User feeling isolated';
      snapshot = 'Loneliness expressed, needs connection';
    } else if (lowerMessage.includes('happy') || lowerMessage.includes('grateful')) {
      code = 'JG';
      hint = 'mirror joy; celebrate';
      insight = 'User expressing positivity';
      snapshot = 'Joy detected, mirror enthusiasm';
    } else if (lowerMessage.includes('meditation') || lowerMessage.includes('mindful')) {
      code = 'MR';
      hint = 'lead session; calm tone';
      insight = 'User seeking mindfulness';
      snapshot = 'Meditation interest, guide practice';
    }

    return {
      code,
      confidence: 0.3, // Низкая уверенность для fallback
      hint,
      insight,
      snapshot
    };
  }

  // Вспомогательный метод для подсчета токенов (приблизительный)
  estimateTokens(text: string): number {
    // Простая эвристика: ~1 токен на 4 символа
    return Math.ceil(text.length / 4);
  }
}
