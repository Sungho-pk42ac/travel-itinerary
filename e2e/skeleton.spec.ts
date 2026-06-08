import { expect, test } from '@playwright/test'

test.describe('워킹 스켈레톤', () => {
  test('홈으로 진입하고 D-day 카드가 보인다', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.goto('/')
    await expect(page).toHaveURL(/\/home$/)
    await expect(page.getByText('우리 여행의 커맨드 센터')).toBeVisible()
    expect(consoleErrors, '콘솔 에러 0이어야 함').toEqual([])
  })

  test('하단 탭으로 지도·정보로 이동한다', async ({ page }) => {
    await page.goto('/home')
    await page.getByRole('link', { name: '지도' }).click()
    await expect(page).toHaveURL(/\/map$/)
    await page.getByRole('link', { name: '정보' }).click()
    await expect(page).toHaveURL(/\/info$/)
  })

  test('Day 1 타임라인에 실제 일정(USJ)이 렌더된다', async ({ page }) => {
    await page.goto('/day/1')
    await expect(page.getByRole('heading', { name: /USJ 오후 입장/ })).toBeVisible()
    await expect(page.getByText('12:30')).toBeVisible()
    // 하이라이트/우천 칩 등 타임라인 요소 존재
    await expect(page.getByText('마일스톤 핵심 체험')).toBeVisible()
  })
})
