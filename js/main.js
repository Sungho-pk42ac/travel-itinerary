/**
 * 오사카 커플 여행 슬라이드 컨트롤러
 * - 키보드(←→↑↓, Home/End), 클릭 버튼, 스와이프, 닷 인디케이터로 슬라이드 이동
 * - 스크롤 스냅과 동기화하여 진행바·카운터·활성 슬라이드 표시
 * - 모바일(<=600px)에서는 일반 스크롤로 동작 (스냅/네비 최소화)
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
      if (isMobile()) return; // 모바일은 네이티브 스크롤에 위임
      const dy = e.changedTouches[0].clientY - touchStartY;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const threshold = 50;
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

  // 초기 상태
  setActive(0);
})();
