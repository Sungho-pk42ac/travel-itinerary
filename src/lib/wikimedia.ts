/**
 * Wikimedia Commons 실사진 URL 헬퍼.
 * Special:FilePath는 파일명만으로 원본/리사이즈 이미지를 리다이렉트로 제공한다(무키).
 * 실패 시 호출부에서 onError 폴백 처리.
 */
export function wikimediaPhoto(file: string, width = 800): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`
}
