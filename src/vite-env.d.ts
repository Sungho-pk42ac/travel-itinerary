/// <reference types="vite/client" />

// 환경변수 타입(프론트 노출용 VITE_ 접두사만). 미설정 시 graceful 폴백.
interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_KEY?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** 선택: 설정 시 커플 메모리 잠금해제에 정확히 일치해야 함(소프트 게이트) */
  readonly VITE_COUPLE_PASSPHRASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
