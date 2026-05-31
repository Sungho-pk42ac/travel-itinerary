/**
 * 오사카 커플 여행 슬라이드 컨트롤러
 * - 키보드(←→↑↓, Home/End), 클릭 버튼, 스와이프, 닷 인디케이터로 슬라이드 이동
 * - 스크롤 스냅과 동기화하여 진행바·카운터·활성 슬라이드 표시
 * - 모바일(<=600px)에서도 풀스크린 스냅 슬라이드: 가로 스와이프로 페이지 전환,
 *   세로 스와이프는 긴 일정 본문 읽기 스크롤, 하단 닷 탭으로 이동
 */
(function () {
  "use strict";

  const deck = document.getElementById("deck");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const progressBar = document.getElementById("progressBar");
  const slideNow = document.getElementById("slideNow");
  const slideTotal = document.getElementById("slideTotal");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsWrap = document.getElementById("dots");

  let current = 0;
  const total = slides.length;
  const isMobile = () => window.matchMedia("(max-width: 600px)").matches;

  // 총 슬라이드 수 표시
  slideTotal.textContent = String(total).padStart(2, "0");

  /** 닷 인디케이터 생성 — 각 슬라이드 제목을 aria-label로 부여 */
  slides.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", (s.dataset.title || "슬라이드 " + (i + 1)));
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  /** 특정 인덱스로 이동 (모바일/데스크탑 모두 스크롤로 처리) */
  function goTo(index) {
    const i = Math.max(0, Math.min(total - 1, index));
    if (i !== current && navigator.vibrate) navigator.vibrate(8); // 햅틱 피드백
    slides[i].scrollIntoView({ behavior: "smooth", block: "start" });
    // 모바일은 IntersectionObserver가 상태를 갱신하므로 즉시 반영만 보조
    if (isMobile()) setActive(i);
  }

  /** UI 상태 갱신 (진행바·카운터·닷·버튼 비활성화) */
  function setActive(i) {
    if (i === current) {
      // 그래도 active 클래스는 보장
    }
    current = i;
    slides.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
    dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
    slideNow.textContent = String(i + 1).padStart(2, "0");
    progressBar.style.width = ((i + 1) / total) * 100 + "%";
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === total - 1;
    playReveal(slides[i]); // 자식 요소 순차 등장
    maybeCountUp(slides[i]); // 예산 슬라이드 숫자 카운트업
  }

  // 현재 보이는 슬라이드 감지 — 스크롤/스냅과 동기화
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const idx = slides.indexOf(entry.target);
          if (idx !== -1) setActive(idx);
        }
      });
    },
    { threshold: [0.5] }
  );
  slides.forEach((s) => io.observe(s));

  // 버튼
  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  // 키보드 네비게이션
  window.addEventListener("keydown", (e) => {
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) {
      e.preventDefault();
      goTo(current + 1);
    } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      goTo(current - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(total - 1);
    }
  });

  // 터치 스와이프 (모바일 일반 스크롤과 충돌하지 않도록 데스크탑/태블릿 위주)
  let touchStartY = 0;
  let touchStartX = 0;
  deck.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.changedTouches[0].clientY;
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  deck.addEventListener(
    "touchend",
    (e) => {
      const dy = e.changedTouches[0].clientY - touchStartY;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const threshold = 45;
      if (isMobile()) {
        // 모바일: 가로 스와이프로만 페이지 전환(세로는 긴 일정 본문 읽기 스크롤)
        if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
          goTo(dx < 0 ? current + 1 : current - 1);
        }
        return;
      }
      // 데스크탑/태블릿: 세로·가로 스와이프 모두 페이지 전환
      if (Math.abs(dy) > threshold && Math.abs(dy) > Math.abs(dx)) {
        goTo(dy < 0 ? current + 1 : current - 1);
      } else if (Math.abs(dx) > threshold) {
        goTo(dx < 0 ? current + 1 : current - 1);
      }
    },
    { passive: true }
  );

  // 이미지 로드 실패 시 그라데이션 폴백 (Unsplash 차단/오프라인 대비)
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.background =
        "linear-gradient(135deg, #c9785b 0%, #7c8c6b 100%)";
      img.style.objectFit = "cover";
      img.removeAttribute("src");
    });
  });

  /* ---------------------------------------------------------
   * 인터랙션 강화 (리빌 · 카운트업 · 시차 · 리플 · 힌트 · PWA)
   * ------------------------------------------------------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 점진적 향상: JS가 돌 때만 리빌용 숨김 적용
  document.body.classList.add("js-ready");

  // 각 슬라이드에서 애니메이션할 자식 요소에 .r-item 부여
  const REVEAL_SEL =
    ".kicker, .h2, .lead, .timeline .tl, .cards .card, .plan li, .bullets li, " +
    ".btable tr, .daily .bar, .note, .rain, .day__head, .tips__col, .tablebox, " +
    ".dl, .cover__eyebrow, .cover__title, .cover__sub, .cover__meta, .cover__hint, .checklist li";
  slides.forEach((s) => {
    s.querySelectorAll(REVEAL_SEL).forEach((el) => el.classList.add("r-item"));
  });

  /** 활성 슬라이드 자식 요소를 스태거로 등장(재진입 시 재생) */
  function playReveal(slide) {
    const items = slide.querySelectorAll(".r-item");
    items.forEach((el, idx) => {
      el.classList.remove("in");
      el.style.transitionDelay = Math.min(idx * 45, 420) + "ms";
    });
    void slide.offsetWidth; // 리플로우로 트랜지션 재시작 보장
    items.forEach((el) => el.classList.add("in"));
  }

  /** 예산 슬라이드 숫자 카운트업(최초 1회) */
  let counted = false;
  function maybeCountUp(slide) {
    if (counted || reduceMotion || slide.dataset.title !== "예산") return;
    counted = true;
    slide.querySelectorAll(".btable .num, .bar__val").forEach(countUp);
  }
  function countUp(el) {
    const raw = el.dataset.val || el.textContent;
    el.dataset.val = raw;
    const m = raw.match(/[\d,]+/);
    if (!m) return;
    const target = parseInt(m[0].replace(/,/g, ""), 10);
    const prefix = raw.slice(0, m.index);
    const suffix = raw.slice(m.index + m[0].length);
    const dur = 900;
    const t0 = performance.now();
    (function step(t) {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased).toLocaleString("en-US") + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  // 시차(parallax): 풀블리드 배경 이미지만(레이아웃 안전), 스크롤에 살짝 반응
  if (!reduceMotion) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const vh = window.innerHeight;
        slides.forEach((s) => {
          const img = s.querySelector(".slide__bg");
          if (!img) return;
          const r = s.getBoundingClientRect();
          if (r.bottom < -40 || r.top > vh + 40) return;
          const prog = (r.top + r.height / 2 - vh / 2) / vh; // 화면 중심 기준 진행도
          img.style.transform = "translateY(" + (prog * 26).toFixed(1) + "px) scale(1.08)";
        });
      });
    };
    deck.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // 탭 리플 효과
  function addRipple(e) {
    const t = e.currentTarget;
    const rect = t.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const span = document.createElement("span");
    span.className = "rip";
    span.style.width = span.style.height = size + "px";
    const cx = e.clientX != null ? e.clientX : rect.left + rect.width / 2;
    const cy = e.clientY != null ? e.clientY : rect.top + rect.height / 2;
    span.style.left = cx - rect.left - size / 2 + "px";
    span.style.top = cy - rect.top - size / 2 + "px";
    t.appendChild(span);
    setTimeout(() => span.remove(), 600);
  }
  document.querySelectorAll(".nav__btn, .card, .dl").forEach((el) => {
    el.classList.add("ripple");
    el.addEventListener("pointerdown", addRipple);
  });

  // 모바일 스와이프 힌트(최초, 첫 터치 시 사라짐)
  if (isMobile()) {
    const hint = document.createElement("div");
    hint.className = "swipe-hint show";
    hint.textContent = "← 좌우로 밀어서 넘기기 →";
    document.body.appendChild(hint);
    const hide = () => hint.classList.remove("show");
    setTimeout(hide, 3600);
    deck.addEventListener("touchstart", hide, { once: true, passive: true });
  }

  // 서비스워커 등록(PWA: 오프라인 + 홈화면 설치)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  // 초기 상태
  setActive(0);
})();
