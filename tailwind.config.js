/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // Importante para el modo luz/oscuro
  theme: {
    extend: {
      colors: {
        // Mapeo de tus variables CSS
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        tertiary: 'var(--bg-tertiary)',
        'input-bg': 'var(--bg-input)',
        'text-main': 'var(--text-primary)',
        'text-sec': 'var(--text-secondary)',
        'accent-code': 'var(--accent-code)',
        'accent-btn': 'var(--accent-button)',
        'border-main': 'var(--border-color)',
        'border-input': 'var(--border-input-btn)',
      },
    },
  },
  plugins: [],
}