import dotenv from 'dotenv';
dotenv.config();

export interface ServerConfig {
  port: number;
  geminiApiKey: string | undefined;
  geminiModel: string;
  maxUploadSizeBytes: number;
}

export const config: ServerConfig = {
  // Ensure the app server binds to port 3000 in AI Studio dev environment
  port: parseInt(process.env.DEFAULT_APP_PORT || (process.env.PORT === '8080' ? '3000' : process.env.PORT || '3000'), 10),
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-transcribe',
  maxUploadSizeBytes: 16 * 1024 * 1024 // 16 MB limit
};
