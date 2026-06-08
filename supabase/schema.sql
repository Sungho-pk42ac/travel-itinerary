-- ===========================================================================
-- Osaka Travel OS — 커플 공유 메모리 스키마 (신규 "깨끗한" Supabase 프로젝트용)
-- ⚠ AI Arena 등 기존 프로젝트 재사용 금지. 전용 새 프로젝트에서 실행할 것.
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- 추억 로그
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  day int,
  author text not null,
  text text not null,
  photo_url text,
  created_at timestamptz not null default now()
);

-- 버킷리스트
create table if not exists public.bucket_list (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  done boolean not null default false,
  done_by text,
  done_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS — anon 키로 select/insert/update 허용(둘 전용 저민감 데이터 + 앱단 passphrase 게이트).
-- ⚠ 정직한 한계: "프로젝트 URL 비공개 + 암호 UI 게이트" 수준(약함).
--   민감정보·결제·신원 데이터는 절대 저장 금지.
-- ---------------------------------------------------------------------------
alter table public.memories enable row level security;
alter table public.bucket_list enable row level security;

create policy "memories anon read"   on public.memories   for select using (true);
create policy "memories anon insert" on public.memories   for insert with check (true);

create policy "bucket anon read"     on public.bucket_list for select using (true);
create policy "bucket anon insert"   on public.bucket_list for insert with check (true);
create policy "bucket anon update"   on public.bucket_list for update using (true) with check (true);

-- Realtime 발행(양 폰 실시간 동기화)
alter publication supabase_realtime add table public.memories;
alter publication supabase_realtime add table public.bucket_list;
