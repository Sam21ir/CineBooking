/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_N8N_BOOKING_WEBHOOK?: string;
  readonly VITE_N8N_REMINDER_WEBHOOK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

