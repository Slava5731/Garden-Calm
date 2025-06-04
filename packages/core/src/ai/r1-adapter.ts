// packages/core/src/ai/r1-adapter.ts
import { R1Context } from '@garden-calm/types';

export const R1_SYSTEM_PROMPT = `
You are a strategic emotional pattern analyzer for Garden Calm.
Analyze the user's emotional journey and provide insights for better support.
Focus on understanding patterns, themes, and what kind of support would help most.
Return structured insights without clinical language.
`;

interface R1Config {
  apiKey: string;
  endpoint?: string;
  model?: string;
  timeout?: number;
}

interface R1Response {
  deepInsight: string;          // Глубокое понимание ситуации
  suggestedTone: string;        // Рекомендуемый тон для Haiku
  meditationRecommended: boolean; // Нужна ли медитация
  keyThemes: string[];          // Основные темы
  supportStrategy: string;      // Как лучше поддержать
}

export class R1Adapter {
  private config: Required<R1Config>;

  constructor(config: R1Config) {
    this.config = {
      apiKey: config.apiKey,
      endpoint: config.endpoint || 'https://api.deepseek.com/v1/chat/completions',
      model: config.model || 'deepseek-r1-0528',
      timeout: config.timeout || 30000
    };
  }

  async analyze(context: R1Context): Promise<R1Response> {
    try {
      const prompt = this.buildPrompt(context);
      const response = await this.callAPI(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('R1 error:', error);
      return this.getFallback(context);
    }
  }

  private buildPrompt(context: R1Context): string {
    let prompt = 'Analyze this emotional journey:\n\n';

    // Добавляем детальный снапшот
    prompt += `CURRENT STATE:\n${context.detailedSnapshot}\n\n`;

    // Эмоциональная динамика
    if (context.emotionalTimeline.length > 0) {
      prompt += 'EMOTIONAL PROGRESSION:\n';
      context.emotionalTimeline.forEach((point, i) => {
        prompt += `${i + 1}. ${point.code} (${point.confidence}): ${point.message}\n`;
      });
      prompt += '\n';
    }

    // Последние сообщения для контекста
    if (context.fullHistory.length > 0) {
      prompt += 'RECENT CONVERSATION:\n';
      context.fullHistory.slice(-10).forEach(msg => {
        prompt += `${msg.role}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    prompt += `
Provide analysis in this format:
{
  "deepInsight": "What's really happening emotionally",
  "suggestedTone": "How Haiku should respond (calm/warm/gentle/etc)",
  "meditationRecommended": true/false,
  "keyThemes": ["theme1", "theme2"],
  "supportStrategy": "Best way to support this person"
}`;

    return prompt;
  }

  private async callAPI(prompt: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            { role: 'system', content: R1_SYSTEM_PROMPT },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 500
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

  private parseResponse(response: string): R1Response {
    try {
      const parsed = JSON.parse(response);
      return {
        deepInsight: parsed.deepInsight || 'User needs emotional support',
        suggestedTone: parsed.suggestedTone || 'warm and gentle',
        meditationRecommended: parsed.meditationRecommended || false,
        keyThemes: parsed.keyThemes || [],
        supportStrategy: parsed.supportStrategy || 'Listen and validate'
      };
    } catch (error) {
      console.error('Parse error:', error);
      throw error;
    }
  }

  private getFallback(context: R1Context): R1Response {
    // Простой фоллбек на основе эмоциональной динамики
    const hasStress = context.emotionalTimeline.some(p => 
      ['ST', 'AP', 'AN'].includes(p.code)
    );

    return {
      deepInsight: 'User experiencing emotional fluctuations',
      suggestedTone: hasStress ? 'calm and grounding' : 'warm and supportive',
      meditationRecommended: hasStress,
      keyThemes: ['emotional support', 'self-care'],
      supportStrategy: 'Provide consistent, non-judgmental support'
    };
  }

  // Генерация long summary для контекста
  async generateLongSummary(
    history: string,
    emotionalJourney: string[],
    keyInsights: string[]
  ): Promise<string> {
    const prompt = `
Create a comprehensive summary of this session:

Emotional journey: ${emotionalJourney.join(' → ')}
Key insights: ${keyInsights.join(', ')}
History summary: ${history}

Provide a 200-400 word summary focusing on:
1. Overall emotional arc
2. Main concerns and themes
3. Progress or changes noticed
4. Recommended support approach
`;

    try {
      const response = await this.callAPI(prompt);
      return response;
    } catch (error) {
      return `Session showed emotional progression through ${emotionalJourney.join(', ')}. 
Key themes included ${keyInsights.join(' and ')}. 
Continued empathetic support recommended.`;
    }
  }
}
