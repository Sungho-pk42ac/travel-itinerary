/**
 * OSAKA '26 — 커플 여행 가이드 앱 컨트롤러
 * 탭 전환 · D-day 카운터 · 스크롤 리빌 · 체크리스트 저장 · SW 등록
 * camelCase 변수 / 한국어 주석
 */
(() => {
  'use strict';

  /** 가벼운 햅틱 진동 (지원 기기 한정) */
  const buzz = (ms = 8) => { try { navigator.vibrate?.(ms); } catch { /* noop */ } };

  // 일부 환경(자동화·WebView)에서 behavior:'smooth'가 무시되므로 rAF로 직접 보간한다.
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  /**
   * 페이지를 지정 y 위치로 부드럽게(또는 즉시) 스크롤한다.
   * @param {number} targetY - 목표 scrollTop
   * @param {number} [duration=420] - 애니메이션 시간(ms)
   */
  const scrollPageTo = (targetY, duration = 420) => {
    const el = document.scrollingElement || document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    const to = Math.max(0, Math.min(targetY, max));
    // 환경별 차이를 흡수: window / scrollingElement / body 모두에 적용
    const apply = (y) => { window.scrollTo(0, y); el.scrollTop = y; document.body.scrollTop = y; };
    const from = el.scrollTop || window.scrollY || 0;
    const dist = to - from;
    if (prefersReduced || Math.abs(dist) < 2 || duration <= 0) { apply(to); return; }
    const start = performance.now();
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2); // easeInOutQuad
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      apply(from + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- 탭 네비게이션 ---------- */
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = Array.from(document.querySelectorAll('.panel'));
  const tabsTrack = document.getElementById('tabsTrack');

  /**
   * 지정한 탭으로 전환한다.
   * @param {string} key - data-tab 값 (overview/d1.../info)
   * @param {boolean} [scrollUp=true] - 전환 후 콘텐츠 상단으로 스크롤할지
   */
  const activateTab = (key, scrollUp = true) => {
    let activeEl = null;
    tabs.forEach((t) => {
      const on = t.dataset.tab === key;
      t.classList.toggle('is-active', on);
      if (on) activeEl = t;
    });
    panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === key));

    // 새 패널의 리빌 요소를 다시 관찰 대상으로
    observeReveals();

    // 활성 탭을 탭바 안에서 가로 중앙으로 (세로 페이지 스크롤은 건드리지 않음)
    if (activeEl && tabsTrack) {
      tabsTrack.scrollLeft = activeEl.offsetLeft - (tabsTrack.clientWidth - activeEl.clientWidth) / 2;
    }

    // 콘텐츠가 보이도록 스티키 탭바를 화면 상단까지 세로 스크롤
    if (scrollUp) {
      const navEl = document.getElementById('nav');
      if (navEl) scrollPageTo(navEl.offsetTop);
    }
  };

  tabs.forEach((t) => t.addEventListener('click', () => { buzz(); activateTab(t.dataset.tab); }));

  // 개요의 동선 행 클릭 → 해당 Day 탭으로 점프
  document.querySelectorAll('[data-goto]').forEach((el) => {
    el.addEventListener('click', () => { buzz(); activateTab(el.dataset.goto); });
  });

  /* ---------- D-day 카운터 ---------- */
  const ddayNum = document.getElementById('ddayNum');
  if (ddayNum) {
    const departure = new Date(2026, 5, 26); // 2026-06-26 (월 0-base)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((departure - today) / 86400000);
    let label;
    if (diffDays > 0) label = `D-${diffDays}`;
    else if (diffDays === 0) label = 'D-DAY';
    else if (diffDays >= -3) label = '여행 중 ✈';
    else label = '다녀옴 🌸';
    ddayNum.textContent = label;
  }

  /* ---------- 스크롤 진행 바 + 맨위로 ---------- */
  const progress = document.getElementById('scrollProgress');
  const toTop = document.getElementById('toTop');
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const ratio = max > 0 ? (h.scrollTop / max) : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;
    if (toTop) toTop.classList.toggle('show', h.scrollTop > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop?.addEventListener('click', () => { buzz(); scrollPageTo(0); });

  /* ---------- 스크롤 리빌(IntersectionObserver) ---------- */
  let revealObserver = null;
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  }
  /** 현재 활성 패널의 미관찰 리빌 요소들을 관찰 시작 */
  function observeReveals() {
    const active = document.querySelector('.panel.is-active');
    if (!active) return;
    const targets = active.querySelectorAll('.reveal:not(.in), .time li:not(.in)');
    if (!revealObserver) { targets.forEach((t) => t.classList.add('in')); return; }
    targets.forEach((t) => revealObserver.observe(t));
  }
  observeReveals();

  /* ---------- 체크리스트 로컬 저장 ---------- */
  const boxes = Array.from(document.querySelectorAll('#checklist input[type="checkbox"]'));
  const STORE_KEY = 'osaka26-checklist';
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    boxes.forEach((b, i) => { b.checked = !!saved[i]; });
  } catch { /* noop */ }
  boxes.forEach((b) => b.addEventListener('change', () => {
    buzz(6);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(boxes.map((x) => x.checked))); } catch { /* noop */ }
  }));

  /* ---------- 키보드 좌우로 탭 이동(데스크탑) ---------- */
  window.addEventListener('keydown', (e) => {
    const idx = tabs.findIndex((t) => t.classList.contains('is-active'));
    if (idx < 0) return;
    if (e.key === 'ArrowRight' && idx < tabs.length - 1) activateTab(tabs[idx + 1].dataset.tab);
    if (e.key === 'ArrowLeft' && idx > 0) activateTab(tabs[idx - 1].dataset.tab);
  });

  /* ---------- 서비스워커(PWA) ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => { /* 오프라인 캐시 실패 무시 */ });
    });
  }
})();
