const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <rect width="200" height="150" fill="#e2e8f0"/>
  <g transform="translate(50,42)" fill="none" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 45 L15 20 Q20 10 32 10 L68 10 Q80 10 85 20 L95 45"/>
    <rect x="0" y="45" width="100" height="26" rx="7"/>
    <circle cx="22" cy="73" r="11" fill="#e2e8f0"/>
    <circle cx="78" cy="73" r="11" fill="#e2e8f0"/>
  </g>
  <text x="100" y="128" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#94a3b8">Photo indisponible</text>
</svg>`;

export const CAR_IMAGE_FALLBACK = `data:image/svg+xml,${encodeURIComponent(FALLBACK_SVG)}`;

export function handleImageError(e) {
  const img = e.currentTarget;
  img.onerror = null;
  img.src = CAR_IMAGE_FALLBACK;
}
