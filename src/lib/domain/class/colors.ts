/**
 * Fixed color palette to visually identify classes.
 *
 * 20 curated OKLCH tones spanning the full hue wheel. Unlike a uniform series,
 * lightness (L≈0.48–0.76) and chroma (C≈0.11–0.21) vary from color to color, so
 * neighboring tones don't look repeated and each class gets a distinct visual
 * identity — while staying legible in both the light and dark themes.
 *
 * The values are literal and immutable on purpose: a class's color must be fixed
 * and never change across renders, sessions, or versions.
 */
export const CLASS_COLORS = [
	'oklch(0.62 0.19 25)', // red
	'oklch(0.70 0.17 55)', // orange
	'oklch(0.76 0.15 80)', // amber
	'oklch(0.72 0.16 110)', // lime
	'oklch(0.66 0.17 145)', // green
	'oklch(0.60 0.14 165)', // emerald
	'oklch(0.68 0.12 190)', // teal
	'oklch(0.72 0.13 210)', // cyan
	'oklch(0.64 0.15 235)', // sky blue
	'oklch(0.56 0.17 260)', // blue
	'oklch(0.52 0.18 275)', // indigo
	'oklch(0.58 0.19 295)', // violet
	'oklch(0.55 0.20 315)', // purple
	'oklch(0.62 0.21 340)', // magenta
	'oklch(0.68 0.18 355)', // pink
	'oklch(0.64 0.16 10)', // rose
	'oklch(0.58 0.12 45)', // terracotta
	'oklch(0.62 0.11 100)', // olive
	'oklch(0.55 0.11 200)', // petrol blue
	'oklch(0.48 0.16 300)' // deep purple
] as const;

/**
 * Deterministic djb2 hash of a string. Returns an unsigned integer.
 */
function hashString(value: string): number {
	let hash = 5381;
	for (let i = 0; i < value.length; i++) {
		hash = (hash * 33) ^ value.charCodeAt(i);
	}
	return hash >>> 0;
}

/**
 * Returns the palette color assigned to a class based on its `id`.
 *
 * The assignment is deterministic: the same class always gets the same color,
 * regardless of list order or pagination.
 */
export function getClassColor(id: string): string {
	return CLASS_COLORS[hashString(id) % CLASS_COLORS.length];
}
