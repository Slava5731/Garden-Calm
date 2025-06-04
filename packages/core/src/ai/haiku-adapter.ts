// packages/core/src/ai/haiku-adapter.ts
import { HaikuContext } from '@garden-calm/types';

export const HAIKU_SYSTEM_PROMPT = `
You are Claude, an empathetic companion. Respond naturally and warmly.
Never diagnose or use therapeutic language. Just be a caring friend who listens.
Keep responses conversational, 2-3 sentences max.
`;

interface HaikuConfig {
  apiKey: string;
  endpoint?: string;
  model?: string;
  timeout?: number;
}

export class HaikuAdapter {
  private config: Required<HaikuConfig>;

  constructor(config: HaikuConfig) {
    this.config = {
      apiKey: config.apiKey,
      endpoint: config.endpoint || 'https://api.anthropic.com/v1/messages',
      model: config.model || 'claude-3-haiku-20240307',
      timeout: config.timeout || 3000
    };
  }

  async respond(message: string, context: HaikuContext): Promise<string> {
    try {
      const prompt = this.buildPrompt(message, context);
      const response = await this.callAPI(prompt);
      return response;
    } catch (error) {
      console.error('Haiku error:', error);
      return this.getFallback(context);
    }
  }

  private buildPrompt(message: string, context: HaikuContext): string {
    let prompt = '';

    // Добавляем контекст из V3
    if (context.currentHint) {
      prompt += `GUIDANCE: ${context.currentHint}\n`;
    }
    if (context.currentInsight) {
      prompt += `INSIGHT: ${context.currentInsight}\n`;
    }
    if (context.briefSnapshot && context.briefSnapshot !== 'No prior context') {
      prompt += `CONTEXT: ${context.briefSnapshot}\n\n`;
    }

    // Последние сообщения для контекста
    if (context.recentMessages?.length > 0) {
      prompt += 'Recent conversation:\n';
      context.recentMessages.slice(-3).forEach(msg => {
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    prompt += `User: ${message}\n`;
    prompt += 'Respond empathetically following the guidance.';

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
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.config.model,
          max_tokens: 150,
          temperature: 0.7,
          system: HAIKU_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private getFallback(context: HaikuContext): string {
    // Простые фоллбеки на основе hint
    if (context.currentHint?.includes('calm')) {
      return "I hear you. Let's take a moment to breathe together.";
    }
    if (context.currentHint?.includes('warm')) {
      return "I'm glad you're here. How are you feeling right now?";
    }
    if (context.currentHint?.includes('acknowledge')) {
      return "I understand. That sounds really challenging.";
    }
    return "I'm here with you. Tell me what's on your mind.";
  }
}
