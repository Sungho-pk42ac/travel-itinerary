/**
 * 오사카 여행 가이드 — 서비스워커
 * 코어 자산은 cache-first(오프라인 즉시 로딩),
 * Unsplash 사진은 stale-while-revalidate(빠른 표시 + 백그라운드 갱신).
 */
const CACHE = "osaka-trip-v3";
const CORE = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/main.js",
  "./manifest.webmanifest",
  "./data/itinerary.csv",
  "./icons/icon.svg",
  "./icons/icon-maskable.svg",
];

// 설치: 코어 자산 미리 캐시
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

// 활성화: 이전 버전 캐시 정리
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Unsplash 이미지: stale-while-revalidate
  if (/images\.unsplash\.com/.test(url.hostname)) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const network = fetch(req)
          .then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // 그 외(코어/동일 출처): cache-first → 네트워크 폴백
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      if (res && res.status === 200 && url.origin === self.location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
