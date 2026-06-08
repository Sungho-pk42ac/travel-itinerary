/// <reference types="vite/client" />

// 환경변수 타입(프론트 노출용 VITE_ 접두사만). 미설정 시 graceful 폴백.
interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_KEY?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
