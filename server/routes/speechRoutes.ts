import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import {
  uploadAudio,
  isSupportedAudioMime,
  sanitizeAudioMime
} from '../middleware/uploadMiddleware.js';
import { transcribeAudioWithGemini } from '../services/geminiSpeechService.js';

export const speechRouter = Router();

// Middleware to catch Multer errors specifically
function handleMulterUpload(req: Request, res: Response, next: NextFunction) {
  const uploadSingle = uploadAudio.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]);

  uploadSingle(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            success: false,
            error: 'Audio file exceeds maximum allowed size (16MB).'
          });
        }
        return res.status(400).json({
          success: false,
          error: `File upload error: ${err.message}`
        });
      }

      // Format validation errors from fileFilter
      return res.status(400).json({
        success: false,
        error: err.message || 'Invalid audio file.'
      });
    }
    next();
  });
}

/**
 * POST /api/speech/transcribe
 * Accepts an audio recording and returns transcribed text via Gemini API.
 */
speechRouter.post(
  '/transcribe',
  handleMulterUpload,
  async (req: Request, res: Response) => {
    try {
      let audioBuffer: Buffer | null = null;
      let mimeType = 'audio/webm';

      // 1. Check if uploaded via multipart form data
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const uploadedFile = files?.audio?.[0] || files?.file?.[0];

      if (uploadedFile) {
        audioBuffer = uploadedFile.buffer;
        mimeType = uploadedFile.mimetype || 'audio/webm';
        console.log(`[SpeechRoute] Upload received via multipart: filename=${uploadedFile.originalname}, mime=${mimeType}, size=${uploadedFile.size} bytes`);
      } else if (req.body && req.body.audio) {
        // 2. Check if provided as base64 in JSON payload
        const rawBase64 = typeof req.body.audio === 'string' ? req.body.audio : '';
        if (!rawBase64.trim()) {
          return res.status(400).json({
            success: false,
            error: 'No audio data found in payload. Please record or upload an audio file.'
          });
        }

        // Clean any data URI prefix if present (e.g. data:audio/webm;base64,...)
        const dataUriMatch = rawBase64.match(/^data:([^;]+);base64,(.+)$/);
        let base64Data = rawBase64;
        if (dataUriMatch) {
          mimeType = dataUriMatch[1];
          base64Data = dataUriMatch[2];
        } else if (req.body.mimeType) {
          mimeType = req.body.mimeType;
        }

        if (!isSupportedAudioMime(mimeType)) {
          return res.status(415).json({
            success: false,
            error: `Unsupported audio format '${mimeType}'. Supported formats include webm, ogg, wav, mp3, mp4, m4a, flac.`
          });
        }

        audioBuffer = Buffer.from(base64Data, 'base64');
        console.log(`[SpeechRoute] Upload received via JSON base64: mime=${mimeType}, bufferSize=${audioBuffer.length} bytes`);
      }

      // Validate audio file existence
      if (!audioBuffer || audioBuffer.length === 0) {
        console.log('[SpeechRoute] Rejected: Empty audio buffer');
        return res.status(400).json({
          success: false,
          error: 'No audio file provided. Please record or upload an audio file.'
        });
      }

      const cleanMime = sanitizeAudioMime(mimeType);

      // Perform speech transcription via Gemini
      const transcribedText = await transcribeAudioWithGemini({
        audioBuffer,
        mimeType: cleanMime
      });

      if (!transcribedText || !transcribedText.trim()) {
        console.log('[SpeechRoute] Transcription completed: No speech detected in audio file.');
        return res.status(200).json({
          success: true,
          text: '',
          message: 'No speech was detected in the audio recording.'
        });
      }

      console.log(`[SpeechRoute] Transcription succeeded: textLength=${transcribedText.length}`);
      return res.status(200).json({
        success: true,
        text: transcribedText.trim()
      });
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to process speech-to-text request.';
      console.error(`[SpeechRoute] Transcription error: ${errorMessage}`);

      // Check if it's an API key configuration issue
      if (errorMessage.includes('GEMINI_API_KEY')) {
        return res.status(503).json({
          success: false,
          error: 'Gemini API key is not configured on the server. Please set GEMINI_API_KEY.'
        });
      }

      // Check for Google GenAI authentication/permission errors
      if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('403') || errorMessage.includes('permission denied')) {
        return res.status(502).json({
          success: false,
          error: 'Invalid or unauthorized Gemini API credentials.'
        });
      }

      // Generic error response (never log audio content)
      return res.status(500).json({
        success: false,
        error: errorMessage
      });
    }
  }
);
