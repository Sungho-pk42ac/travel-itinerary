import { expect, test } from '@playwright/test'

test.describe('워킹 스켈레톤', () => {
  test('홈으로 진입하고 대시보드가 보인다', async ({ page }) => {
    const appErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return
      const t = msg.text()
      // 외부 API 실패(네트워크/리소스)는 앱 에러로 보지 않음(graceful 폴백 설계)
      if (/open-meteo|er-api|wikimedia|Failed to load resource|net::|ERR_/i.test(t)) return
      appErrors.push(t)
    })

    await page.goto('/')
    await expect(page).toHaveURL(/\/home$/)
    await expect(page.getByText('지금 / 다음 일정')).toBeVisible()
    expect(appErrors, '앱(스크립트) 콘솔 에러 0이어야 함').toEqual([])
  })

  test('하단 탭으로 지도·정보로 이동한다', async ({ page }) => {
    await page.goto('/home')
    // 하단 네비 링크만 특정(Home의 "지도 →" 링크와 구분)
    await page.getByRole('link', { name: '지도', exact: true }).click()
    await expect(page).toHaveURL(/\/map$/)
    await page.getByRole('link', { name: '정보', exact: true }).click()
    await expect(page).toHaveURL(/\/info$/)
  })

  test('Day 1 타임라인에 실제 일정(USJ)이 렌더된다', async ({ page }) => {
    await page.goto('/day/1')
    await expect(page.getByRole('heading', { name: /USJ 오후 입장/ })).toBeVisible()
    await expect(page.getByText('14:00')).toBeVisible()
    // 하이라이트/우천 칩 등 타임라인 요소 존재
    await expect(page.getByText('마일스톤 핵심 체험')).toBeVisible()
  })
})
