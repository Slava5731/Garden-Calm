import { V3Response, Message, EmotionCode, HaikuContext, R1Context, IMemoryStore } from '@garden-calm/types';
import { ScoringEngine } from './scoring-engine';
import { ContextManager } from './context-manager';
import { SuggestionEngine } from './suggestion-engine';
import { DecisionEngine } from '../ai/decision-engine';
export interface OrchestratorConfig {
    v3ApiKey: string;
    v3Endpoint?: string;
    memoryStore?: IMemoryStore;
    scoringEngine?: ScoringEngine;
    contextManager?: ContextManager;
    suggestionEngine?: SuggestionEngine;
    decisionEngine?: DecisionEngine;
}
export interface AnalysisResult {
    v3Response: V3Response;
    shouldSuggestMeditation: boolean;
    suggestedEmotion?: EmotionCode;
    shouldCallR1: boolean;
    r1Reason?: string;
    haikuContext: HaikuContext;
    timestamp: number;
}
export declare class EmpathyOrchestrator {
    private v3Adapter;
    private memoryStore;
    private scoringEngine;
    private contextManager;
    private suggestionEngine;
    private decisionEngine;
    private createDefaultMemoryStore;
    constructor(config: OrchestratorConfig);
    analyzeMessage(userId: string, message: string, messageId: string): Promise<AnalysisResult>;
    onMeditationAccepted(userId: string): Promise<void>;
    onMeditationDeclined(userId: string): void;
    getR1Context(userId: string): Promise<R1Context>;
    getMeditationReadiness(userId: string): ReturnType<SuggestionEngine['analyzeMeditationReadiness']>;
    getRecommendedEmotions(userId: string, limit?: number): EmotionCode[];
    saveAssistantMessage(userId: string, message: Message): void;
    cleanup(): void;
    exportState(userId: string): {
        session: any;
        empathyState: any;
        contextSession: any;
        decisionStats: any;
    };
    private handleR1Call;
    getSystemStats(): {
        memory: ReturnType<IMemoryStore['getStats']>;
        activeSessions: number;
        totalAnalyses: number;
    };
}
export declare function createEmpathyOrchestrator(config: {
    v3ApiKey: string;
    v3Endpoint?: string;
}): EmpathyOrchestrator;
//# sourceMappingURL=orchestrator.d.ts.map