import prisma from '../config/database';
import { ENV } from '../config/env';

export interface StylometricResult {
  status: string;
  aiLikelihoodScore: number;
  confidence: string;
  signals: Record<string, any>;
  disclaimer: string;
  processingTimeMs: number;
  modelVersion: string;
  limitations?: string[];
}

export class AiValidationService {
  /**
   * Invokes the FastAPI AI Validation microservice with graceful fallback.
   * Ensures assignment submission and grading workflows NEVER fail if AI is offline.
   */
  static async analyzeSubmissionText(
    submissionId: string,
    text: string
  ): Promise<StylometricResult> {
    const startTime = Date.now();

    try {
      // 1. Attempt calling the Python FastAPI microservice
      const response = await fetch(`${ENV.AI_SERVICE_URL}/analyze/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, text }),
        signal: AbortSignal.timeout(4000), // 4-second bounded timeout
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        
        const submissionExists = await prisma.submission.findUnique({
          where: { id: submissionId },
        });

        if (submissionExists) {
          await prisma.aiAssessment.upsert({
            where: { submissionId },
            create: {
              submissionId,
              status: data.status || 'COMPLETED',
              aiLikelihoodScore: data.aiLikelihoodScore || 0.0,
              confidence: data.confidence || 'LOW',
              signalsJson: JSON.stringify(data.signals || {}),
              disclaimer: data.disclaimer || 'Heuristic stylometric indicator only.',
              processingTimeMs: data.processingTimeMs || (Date.now() - startTime),
              modelVersion: data.modelVersion || 'stylometry-nlp-v1.2',
            },
            update: {
              status: data.status || 'COMPLETED',
              aiLikelihoodScore: data.aiLikelihoodScore || 0.0,
              confidence: data.confidence || 'LOW',
              signalsJson: JSON.stringify(data.signals || {}),
              processingTimeMs: data.processingTimeMs || (Date.now() - startTime),
              analyzedAt: new Date(),
            },
          });
        }

        return data as StylometricResult;
      }
    } catch (error) {
      console.warn('AI validation service unavailable or timed out. Falling back to local offline heuristic.');
    }

    // 2. Offline Resilience Fallback: Compute lightweight CPU stylometrics locally
    const fallbackResult = this.computeLocalHeuristic(text);
    const duration = Date.now() - startTime;

    const submissionExists = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (submissionExists) {
      await prisma.aiAssessment.upsert({
        where: { submissionId },
        create: {
          submissionId,
          status: fallbackResult.status,
          aiLikelihoodScore: fallbackResult.aiLikelihoodScore,
          confidence: fallbackResult.confidence,
          signalsJson: JSON.stringify(fallbackResult.signals),
          disclaimer: 'Generated via local offline fallback heuristic (AI microservice in standby).',
          processingTimeMs: duration,
          modelVersion: 'local-offline-fallback-v1.0',
        },
        update: {
          status: fallbackResult.status,
          aiLikelihoodScore: fallbackResult.aiLikelihoodScore,
          confidence: fallbackResult.confidence,
          signalsJson: JSON.stringify(fallbackResult.signals),
          processingTimeMs: duration,
          analyzedAt: new Date(),
        },
      });
    }

    return {
      ...fallbackResult,
      processingTimeMs: duration,
      modelVersion: 'local-offline-fallback-v1.0',
    };
  }

  /**
   * Lightweight local stylometric fallback so system functions completely without external processes
   */
  private static computeLocalHeuristic(text: string): StylometricResult {
    const words = text.toLowerCase().match(/\b[a-zA-Z]{2,}\b/g) || [];
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 3);

    if (words.length < 60) {
      return {
        status: 'INSUFFICIENT_EVIDENCE',
        aiLikelihoodScore: 0.0,
        confidence: 'LOW',
        signals: { sampleSufficiency: false, wordCount: words.length },
        disclaimer: 'Sample too brief for stylometric profiling. Faculty review is mandatory.',
        processingTimeMs: 5,
        modelVersion: 'local-offline-fallback-v1.0',
      };
    }

    const uniqueWords = new Set(words);
    const ttr = uniqueWords.size / words.length;
    const sentenceLengths = sentences.map((s) => (s.match(/\b\w+\b/g) || []).length);
    const meanLen = sentenceLengths.reduce((a, b) => a + b, 0) / Math.max(1, sentenceLengths.length);
    const variance = sentenceLengths.reduce((acc, l) => acc + Math.pow(l - meanLen, 2), 0) / Math.max(1, sentenceLengths.length);
    const stdDev = Math.sqrt(variance);

    // AI text generally exhibits lower sentence length variance
    let score = 0.15;
    if (stdDev < 4.0) score += 0.35;
    else if (stdDev < 6.0) score += 0.20;

    const markers = ['in conclusion', 'moreover', 'furthermore', 'pivotal role', 'multifaceted'];
    let markerHits = 0;
    markers.forEach((m) => {
      if (text.toLowerCase().includes(m)) markerHits++;
    });
    score += Math.min(0.3, markerHits * 0.1);

    const clampedScore = Math.min(0.92, Math.max(0.05, Math.round(score * 100) / 100));

    return {
      status: 'COMPLETED',
      aiLikelihoodScore: clampedScore,
      confidence: clampedScore >= 0.65 ? 'HIGH' : clampedScore >= 0.4 ? 'MODERATE' : 'LOW',
      signals: {
        wordCount: words.length,
        sentenceCount: sentences.length,
        typeTokenRatio: Math.round(ttr * 100) / 100,
        meanSentenceLength: Math.round(meanLen * 10) / 10,
        sentenceLengthStdDev: Math.round(stdDev * 10) / 10,
        markerHits,
      },
      disclaimer: 'Heuristic stylometric indicator only. Does not constitute proof of academic misconduct. Faculty members retain sole authority.',
      processingTimeMs: 8,
      modelVersion: 'local-offline-fallback-v1.0',
      limitations: [
        'Heuristic analysis does not access raw model weights.',
        'High false-positive rate on formulaic STEM lab reports.',
      ],
    };
  }
}
