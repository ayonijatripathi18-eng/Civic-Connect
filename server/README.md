# CIVIC-CONNECT Backend — Speech-to-Text Service

This directory contains the Node.js + Express + TypeScript backend service for **CIVIC-CONNECT**, providing AI-powered speech-to-text capabilities for citizen issue reporting.

---

## Architecture Overview

```
server/
├── .env.example              # Environment variables template
├── README.md                 # Backend documentation
├── app.ts                    # Express app configuration & middleware
├── config.ts                 # Environment configuration loader
├── index.ts                  # Server entry point with Vite middleware support
├── middleware/
│   └── uploadMiddleware.ts   # Multer file upload handler & audio MIME validator
├── routes/
│   ├── healthRoutes.ts       # Health probe: GET /api/health
│   └── speechRoutes.ts       # Speech-to-text: POST /api/speech/transcribe
└── services/
    └── geminiSpeechService.ts # Gemini API integration (@google/genai)
```

---

## Required Environment Variables

Create a `.env` file in the project root or configure your hosting environment:

| Variable | Required | Description | Default |
| :--- | :---: | :--- | :--- |
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key used for transcribing user audio | *(None)* |
| `PORT` | No | Server listening port | `3000` |
| `GEMINI_MODEL` | No | Primary audio transcription model | `gemini-3.5-transcribe` |

> **Security Note:** Never commit `GEMINI_API_KEY` or expose it in client-side bundles. All Gemini API calls are strictly executed server-side.

---

## API Endpoints

### 1. Health Probe
- **Endpoint**: `GET /api/health`
- **Description**: Returns server status.
- **Response**:
  ```json
  {
    "status": "ok",
    "service": "civic-connect-api",
    "version": "1.0.0",
    "timestamp": "2026-10-08T10:00:00.000Z"
  }
  ```

---

### 2. Speech-to-Text Transcription
- **Endpoint**: `POST /api/speech/transcribe`
- **Content-Type**: `multipart/form-data` (or `application/json` with base64 `audio`)
- **Payload Field**: `audio` or `file` containing the audio binary.
- **Supported Formats**: `audio/webm`, `audio/ogg`, `audio/wav`, `audio/mp3`, `audio/mp4`, `audio/m4a`, `audio/aac`, `audio/flac`
- **Max File Size**: 16 MB

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "text": "There is a severe crater-like pothole on Main Road near the market crossing causing traffic accidents."
}
```

#### Failure Responses
- `400 Bad Request` — Missing audio payload or invalid file format
  ```json
  {
    "success": false,
    "error": "No audio file provided. Please record or upload an audio file."
  }
  ```
- `413 Payload Too Large` — Audio file exceeds 16MB limit
  ```json
  {
    "success": false,
    "error": "Audio file exceeds maximum allowed size (16MB)."
  }
  ```
- `415 Unsupported Media Type` — Format is not an accepted audio type
  ```json
  {
    "success": false,
    "error": "Unsupported audio format 'video/mp4'. Supported formats include webm, ogg, wav, mp3, mp4, m4a, flac."
  }
  ```
- `503 Service Unavailable` — Missing server Gemini API key
  ```json
  {
    "success": false,
    "error": "Gemini API key is not configured on the server. Please set GEMINI_API_KEY."
  }
  ```

---

## How to Run the Backend

### Integrated Full-Stack Mode (Default)
Starts Express and mounts Vite development middleware on port 3000:
```bash
npm run dev
```

### Production Build & Run
```bash
npm run build
npm start
```

---

## How to Test Speech-to-Text

### Testing with `curl`

1. **Verify Health Endpoint:**
   ```bash
   curl -s http://localhost:3000/api/health
   ```

2. **Test Speech-to-Text with an Audio File:**
   ```bash
   curl -X POST http://localhost:3000/api/speech/transcribe \
     -F "audio=@/path/to/recording.webm;type=audio/webm"
   ```

3. **Test with JSON Base64 Payload:**
   ```bash
   curl -X POST http://localhost:3000/api/speech/transcribe \
     -H "Content-Type: application/json" \
     -d '{"audio": "<base64_encoded_audio>", "mimeType": "audio/webm"}'
   ```
