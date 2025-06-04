import { V3Response, Message } from '../types';
export declare const V3_SYSTEM_PROMPT = "\nYou are an empathetic emotion analyzer. Classify user messages using exactly these 16 emotion codes:\n\nAP=Anxiety/Panic, SD=Sadness/Emptiness, AN=Anger/Irritation, GS=Guilt/Shame, \nST=Stress/Tension, BO=Burnout/Fatigue, IN=Insomnia, SDO=Self-doubt, \nLN=Loneliness, BA=Boredom/Apathy, CF=Change-fear, MR=Mindfulness-wish, \nJG=Joy/Gratitude, HT=Hurt/Resentment, NT=Neutral/Calm, CN=Confusion/Lost\n\nReturn ONLY valid JSON:\n{\n  \"code\": \"ST\",\n  \"confidence\": 0.85,\n  \"hint\": \"tone=calm; suggest break\",\n  \"insight\": \"User overwhelmed by deadlines\",\n  \"snapshot\": \"Work pressure building, needs relief\"\n}\n\nExamples:\nINPUT: \"Ugh, another deadline tomorrow, I can't keep up\"\nOUTPUT: {\"code\":\"ST\",\"confidence\":0.9,\"hint\":\"tone=calm; offer break\",\"insight\":\"Work overload causing stress\",\"snapshot\":\"Deadline pressure mounting\"}\n\nINPUT: \"I feel so alone lately, nobody really gets me\"  \nOUTPUT: {\"code\":\"LN\",\"confidence\":0.85,\"hint\":\"start chat; be warm\",\"insight\":\"Deep isolation, needs connection\",\"snapshot\":\"User feeling disconnected, isolated\"}\n\nINPUT: \"Got the promotion! I'm so grateful for this opportunity\"\nOUTPUT: {\"code\":\"JG\",\"confidence\":0.92,\"hint\":\"mirror joy; celebrate\",\"insight\":\"Achievement bringing happiness\",\"snapshot\":\"Career success, feeling appreciated\"}\n";
export declare class V3Adapter {
    private apiKey;
    private endpoint;
    private timeout;
    constructor(config: {
        apiKey: string;
        endpoint?: string;
        timeout?: number;
    });
    analyze(message: string, context?: Message[]): Promise<V3Response>;
    private callV3API;
    private parseV3Response;
    private sanitizeString;
    private getFallbackResponse;
    estimateTokens(text: string): number;
}
//# sourceMappingURL=v3-adapter.d.ts.map