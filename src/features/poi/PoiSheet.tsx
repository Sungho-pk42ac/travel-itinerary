import { useState } from 'react'
import BottomSheet from '../../components/BottomSheet'
import { getPoi } from '../../data/poi'
import { wikimediaPhoto } from '../../lib/wikimedia'
import { googleDirectionsUrl, googleSearchUrl } from '../../lib/maps'

/**
 * POI 바텀시트 — 실사진(onError 폴백) + 소개 + 예약/지도 버튼.
 * poiId가 null이면 닫힘.
 */
export default function PoiSheet({ poiId, onClose }: { poiId: string | null; onClose: () => void }) {
  const poi = poiId ? getPoi(poiId) : undefined
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <BottomSheet open={Boolean(poi)} title={poi?.name ?? ''} onClose={onClose}>
      {poi && (
        <div className="space-y-4">
          {/* 사진 or 그라데이션 폴백 */}
          <div className="aspect-[16/10] w-full overflow-hidden rounded-card bg-gradient-to-br from-rosegold-soft to-coral-soft">
            {poi.photoFile && !imgFailed ? (
              <img
                src={wikimediaPhoto(poi.photoFile, 800)}
                alt={poi.name}
                loading="lazy"
                onError={() => setImgFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-rosegold">
                <span className="font-display text-lg font-semibold">{poi.name}</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            {poi.blurb.map((line, i) => (
              <p key={i} className="text-sm text-charcoal">
                {line}
              </p>
            ))}
          </div>

          <div className="flex gap-2">
            {poi.bookingUrl && (
              <a
                href={poi.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-pill bg-coral px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                {poi.bookingLabel ?? '예약/정보'}
              </a>
            )}
            <a
              href={googleDirectionsUrl(poi.coords)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-pill border border-line bg-surface px-4 py-2.5 text-center text-sm font-semibold text-charcoal"
            >
              길찾기
            </a>
            <a
              href={googleSearchUrl(poi.name, poi.coords)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="구글맵에서 보기"
              className="rounded-pill border border-line bg-surface px-4 py-2.5 text-center text-sm font-semibold text-charcoal"
            >
              🗺️
            </a>
          </div>
        </div>
      )}
    </BottomSheet>
  )
}
