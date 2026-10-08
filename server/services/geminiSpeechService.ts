import { GoogleGenAI } from '@google/genai';
import { config } from '../config.js';

let genAIClient: GoogleGenAI | null = null;

function getGenAIClient(): GoogleGenAI {
  const apiKey = config.geminiApiKey;
  if (!apiKey || !apiKey.trim()) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }

  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }

  return genAIClient;
}

export interface TranscribeOptions {
  audioBuffer: Buffer;
  mimeType: string;
}

/**
 * Extracts transcription text from both standard text parts and specialized audioTranscription parts.
 */
function extractTranscriptionText(response: any): string {
  // 1. Direct response.text getter
  if (response?.text && typeof response.text === 'string' && response.text.trim()) {
    return response.text.trim();
  }

  // 2. Inspect candidates for audioTranscription parts (used by gemini-3.5-transcribe)
  const candidate = response?.candidates?.[0];
  const parts = candidate?.content?.parts;
  if (Array.isArray(parts)) {
    for (const part of parts) {
      if (part?.audioTranscription?.text && typeof part.audioTranscription.text === 'string') {
        const text = part.audioTranscription.text.trim();
        if (text) return text;
      }
      if (part?.text && typeof part.text === 'string') {
        const text = part.text.trim();
        if (text) return text;
      }
    }
  }

  return '';
}

/**
 * Transcribe audio buffer using Gemini API.
 * Never logs raw audio bytes, API keys, or personal details.
 */
export async function transcribeAudioWithGemini(options: TranscribeOptions): Promise<string> {
  const { audioBuffer, mimeType } = options;

  if (!audioBuffer || audioBuffer.length === 0) {
    throw new Error('Audio payload is empty. Cannot transcribe zero-byte audio.');
  }

  const ai = getGenAIClient();
  const base64Audio = audioBuffer.toString('base64');
  const cleanMime = mimeType.split(';')[0].trim().toLowerCase();

  // Development diagnostics: log metadata safely
  console.log(`[GeminiSpeechService] Starting transcription: mime=${cleanMime}, bufferSize=${audioBuffer.length} bytes`);

  const promptText =
    'You are a speech-to-text transcriber for a municipal civic issue reporting application. ' +
    'Transcribe all spoken words from the audio accurately and verbatim in the language spoken. ' +
    'If the user is describing a civic issue (such as potholes, broken lights, water leakage, garbage), capture details clearly. ' +
    'Output ONLY the transcribed speech as plain text. Do not include markdown formatting, explanations, timestamps, or quotes.';

  const audioPart = {
    inlineData: {
      mimeType: cleanMime,
      data: base64Audio
    }
  };

  const modelsToTry = [
    config.geminiModel || 'gemini-3.5-transcribe',
    'gemini-flash-latest',
    'gemini-3.8-flash'
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[GeminiSpeechService] Requesting model=${modelName}...`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            audioPart,
            { text: promptText }
          ]
        }
      });

      const transcription = extractTranscriptionText(response);
      console.log(`[GeminiSpeechService] Model=${modelName} response received: hasCandidates=${Boolean(response?.candidates?.length)}, extractedTextLength=${transcription.length}`);

      if (transcription) {
        return transcription;
      }

      // If text was empty on this model, continue to next fallback model
      console.log(`[GeminiSpeechService] Model=${modelName} returned empty text, trying fallback model...`);
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || '';
      console.log(`[GeminiSpeechService] Model=${modelName} failed: ${errMsg}`);

      const isModelError = errMsg.includes('not found') || errMsg.includes('404') || errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('high demand');
      if (!isModelError) {
        // Critical error like invalid API key
        throw err;
      }
    }
  }

  if (lastError) {
    throw lastError;
  }

  return '';
}
