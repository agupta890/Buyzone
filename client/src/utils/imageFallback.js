// Shared placeholder for product images that are missing or fail to load.
// It's an inline SVG data URI (no network request, so it can never itself 404).
const placeholderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <g fill="none" stroke="#cbd5e1" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <rect x="62" y="68" width="116" height="94" rx="10"/>
    <circle cx="92" cy="98" r="11"/>
    <path d="M68 150l30-27 22 18 18-15 28 24"/>
  </g>
  <text x="120" y="192" font-family="system-ui, sans-serif" font-size="15" font-weight="700"
        fill="#94a3b8" text-anchor="middle">No image</text>
</svg>`;

export const PLACEHOLDER_IMAGE = `data:image/svg+xml,${encodeURIComponent(placeholderSvg.trim())}`;

// onError handler: swap a broken image for the placeholder, once (prevents loops).
export const onImageError = (e) => {
  const img = e.currentTarget;
  img.onerror = null;
  img.src = PLACEHOLDER_IMAGE;
};
