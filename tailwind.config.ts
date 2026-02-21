import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0B',
        foreground: '#FFFFFF',
        card: '#151515',
        'card-foreground': '#FFFFFF',
        primary: '#FF4F00',
        'primary-foreground': '#FFFFFF',
        secondary: '#1a1a1a',
        muted: '#2a2a2a',
        'muted-foreground': '#a1a1a1',
        accent: '#FF4F00',
        border: 'rgba(255, 255, 255, 0.1)',
        ring: '#FF4F00',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
        arabic: ['"Cairo"', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
      },
    },
  },
  plugins: [],
}

export default config
