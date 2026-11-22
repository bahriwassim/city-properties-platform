// CSS custom properties in app/globals.css are the source of truth.
const config = {
  theme: { extend: { colors: {
    navy: { 950: "var(--navy-950)", 900: "var(--navy-900)", 800: "var(--navy-800)", 700: "var(--navy-700)" },
    grey: { 50: "var(--grey-50)", 100: "var(--grey-100)", 200: "var(--grey-200)", 400: "var(--grey-400)", 600: "var(--grey-600)", 800: "var(--grey-800)" },
    red: { 100: "var(--red-100)", 600: "var(--red-600)", 700: "var(--red-700)" },
    white: "var(--white)", text: "var(--text)", muted: "var(--text-muted)", surface: "var(--surface)", border: "var(--border)", focus: "var(--focus)"
  } } }
};
export default config;
