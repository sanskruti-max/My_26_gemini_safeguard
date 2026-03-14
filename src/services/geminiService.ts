import { GoogleGenAI, Type, Modality, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisResult {
  id: string;
  timestamp: number;
  safetyScore: number; // 0 to 100
  riskLevel: 'Low' | 'Medium' | 'High';
  summary: string;
  detailedAnalysis: string;
  threatsDetected: string[];
  categories: {
    phishing: number;
    malware: number;
    hateSpeech: number;
    spam: number;
    harassment: number;
  };
  emotionalIntelligence: {
    tone: string;
    intensity: number; // 0 to 100
    deEscalatedVersion: string;
  };
  adversarialDefense: {
    attackProbability: number; // 0 to 100
    techniqueDetected: string | null;
    isJailbreakAttempt: boolean;
  };
  neuralFingerprint: {
    aiProbability: number; // 0 to 100
    originStyle: string; // e.g., "LLM-Optimized", "Human-Casual", "Technical-Formal"
    complexityScore: number; // 0 to 100
    dnaSequence: string; // A mock hex string representing the text's "DNA"
  };
  socialMedia: {
    engagementPotential: number; // 0 to 100
    viralProbability: number; // 0 to 100
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    suggestedHashtags: string[];
    platformOptimization: {
      twitter: string;
      instagram: string;
      linkedIn: string;
    };
  };
}

export async function generateSpeech(text: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak clearly and articulately: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
    return null;
  } catch (error) {
    console.error("Speech generation failed:", error);
    return null;
  }
}

export async function analyzeMessage(text: string): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze the following social media post or message for impact, engagement, and safety.
  Provide a safety score (0-100), a risk level, a concise summary (max 15 words), a brief detailed analysis in markdown, and a list of specific threats detected.
  Also provide a probability score (0-100) for each of these categories: phishing, malware, hateSpeech, spam, harassment.
  
  BE CONCISE. SPEED IS CRITICAL.
  
  SOCIAL MEDIA ANALYSIS REQUIREMENTS:
  1. Engagement Potential: How likely is this to get likes/shares (0-100)?
  2. Viral Probability: Likelihood of going viral (0-100).
  3. Sentiment: Positive, Neutral, or Negative.
  4. Suggested Hashtags: Provide 3-5 relevant hashtags.
  5. Platform Optimization: Provide a short tip for Twitter, Instagram, and LinkedIn.
  
  EXISTING REQUIREMENTS:
  1. Emotional Intelligence: Analyze tone and intensity. Provide a "deEscalatedVersion".
  2. Adversarial Defense: Check for prompt injection/jailbreaking.
  3. Neural Fingerprinting: Determine AI probability, originStyle, complexityScore, and a 16-char hex "dnaSequence".
  
  Content: "${text}"`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          safetyScore: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          summary: { type: Type.STRING },
          detailedAnalysis: { type: Type.STRING },
          threatsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
          categories: {
            type: Type.OBJECT,
            properties: {
              phishing: { type: Type.NUMBER },
              malware: { type: Type.NUMBER },
              hateSpeech: { type: Type.NUMBER },
              spam: { type: Type.NUMBER },
              harassment: { type: Type.NUMBER },
            },
            required: ["phishing", "malware", "hateSpeech", "spam", "harassment"],
          },
          emotionalIntelligence: {
            type: Type.OBJECT,
            properties: {
              tone: { type: Type.STRING },
              intensity: { type: Type.NUMBER },
              deEscalatedVersion: { type: Type.STRING },
            },
            required: ["tone", "intensity", "deEscalatedVersion"],
          },
          adversarialDefense: {
            type: Type.OBJECT,
            properties: {
              attackProbability: { type: Type.NUMBER },
              techniqueDetected: { type: Type.STRING, nullable: true },
              isJailbreakAttempt: { type: Type.BOOLEAN },
            },
            required: ["attackProbability", "techniqueDetected", "isJailbreakAttempt"],
          },
          neuralFingerprint: {
            type: Type.OBJECT,
            properties: {
              aiProbability: { type: Type.NUMBER },
              originStyle: { type: Type.STRING },
              complexityScore: { type: Type.NUMBER },
              dnaSequence: { type: Type.STRING },
            },
            required: ["aiProbability", "originStyle", "complexityScore", "dnaSequence"],
          },
          socialMedia: {
            type: Type.OBJECT,
            properties: {
              engagementPotential: { type: Type.NUMBER },
              viralProbability: { type: Type.NUMBER },
              sentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative"] },
              suggestedHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              platformOptimization: {
                type: Type.OBJECT,
                properties: {
                  twitter: { type: Type.STRING },
                  instagram: { type: Type.STRING },
                  linkedIn: { type: Type.STRING },
                },
                required: ["twitter", "instagram", "linkedIn"],
              },
            },
            required: ["engagementPotential", "viralProbability", "sentiment", "suggestedHashtags", "platformOptimization"],
          },
        },
        required: ["safetyScore", "riskLevel", "summary", "detailedAnalysis", "threatsDetected", "categories", "emotionalIntelligence", "adversarialDefense", "neuralFingerprint", "socialMedia"],
      },
    },
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return {
      ...data,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
    } as AnalysisResult;
  } catch (error) {
    console.error("Failed to parse analysis result:", error);
    throw new Error("Failed to analyze message");
  }
}
