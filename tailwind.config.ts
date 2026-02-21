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
        background: '#FFFFFF',
        foreground: '#1A2B4C',
        card: '#F9FAFB',
        'card-foreground': '#1A2B4C',
        primary: '#1A2B4C',
        'primary-foreground': '#FFFFFF',
        secondary: '#4B5563',
        muted: '#F3F4F6',
        'muted-foreground': '#6B7280',
        accent: '#FF4F00',
        border: '#E5E7EB',
        ring: '#1A2B4C',
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
