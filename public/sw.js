/*
 * 자기파괴(self-destroying) 서비스워커.
 *
 * 배경: 이전 바닐라 PWA가 등록한 옛 서비스워커가 cache-first로 stale한
 * 옛 앱 셸을 계속 서빙하여 새 React 배포가 사용자에게 보이지 않는 문제가 있었다.
 * sw.js를 단순 삭제(404)해도 브라우저는 기존 등록을 유지하므로, 같은 스코프에
 * "스스로를 해제하는" 새 SW를 배포해 옛 등록을 확실히 제거한다.
 *
 * 동작: 브라우저가 navigation 시 SW 스크립트 업데이트를 확인하면 이 새 스크립트를
 * 받아 install 즉시 활성화 → 모든 캐시 삭제 → 자기 등록 해제 → 열려있는 클라이언트
 * 새로고침. 이후 이 오리진엔 SW가 없으므로 새 React 앱이 그대로 로드된다.
 *
 * NOTE: PWA 슬라이스에서 vite-plugin-pwa가 관리형 SW를 도입하면 이 파일은 제거된다.
 */
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 옛 SW가 만든 캐시 전부 삭제
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      // 자기 자신 등록 해제
      await self.registration.unregister()
      // 제어 중이던 모든 탭을 새로고침해 새 앱을 즉시 반영
      const clients = await self.clients.matchAll({ type: 'window' })
      for (const client of clients) {
        try {
          client.navigate(client.url)
        } catch {
          // 일부 환경에서 navigate 불가 — 무시(다음 새로고침 시 정상)
        }
      }
    })(),
  )
})
