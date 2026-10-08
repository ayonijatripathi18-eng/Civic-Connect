import multer from 'multer';
import { Request } from 'express';
import { config } from '../config.js';

// Clean standard audio MIME types supported by Gemini audio processing
export const ALLOWED_AUDIO_MIME_PREFIXES = [
  'audio/webm',
  'audio/ogg',
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/m4a',
  'audio/x-m4a',
  'audio/aac',
  'audio/flac',
  'audio/opus',
  'audio/3gpp',
  'audio/3gpp2'
];

export function isSupportedAudioMime(mime: string): boolean {
  if (!mime) return false;
  const baseMime = mime.split(';')[0].trim().toLowerCase();
  return ALLOWED_AUDIO_MIME_PREFIXES.includes(baseMime) || baseMime.startsWith('audio/');
}

export function sanitizeAudioMime(mime: string): string {
  if (!mime) return 'audio/webm';
  const baseMime = mime.split(';')[0].trim().toLowerCase();
  return baseMime;
}

const storage = multer.memoryStorage();

export const uploadAudio = multer({
  storage,
  limits: {
    fileSize: config.maxUploadSizeBytes
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!file) {
      return cb(new Error('No file attached in upload request.'));
    }

    if (isSupportedAudioMime(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported audio format '${file.mimetype}'. Supported formats: webm, ogg, wav, mp3, mp4, m4a, flac, aac.`));
    }
  }
});
