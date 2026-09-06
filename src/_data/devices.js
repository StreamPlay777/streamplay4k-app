/**
 * Devices offered by the single interactive setup page (/setup-guide/).
 * `id` doubles as the URL hash: /setup-guide/#firestick
 *
 * Step-by-step instructions are deliberately NOT here yet — they arrive with
 * the setup-guide prompt. Per-device SEO articles live in the blog instead of
 * separate setup routes.
 */
export default [
  { id: "firestick", label: "Firestick", order: 1 },
  { id: "smart-tv", label: "Smart TV", order: 2 },
  { id: "android-tv", label: "Android TV", order: 3 },
  { id: "apple-tv", label: "Apple TV", order: 4 },
  { id: "mobile", label: "Mobile", order: 5 },
  { id: "computer", label: "Computer", order: 6 }
];
