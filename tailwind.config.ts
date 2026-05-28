import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sf: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        macos: {
          bg: '#1c1c1e',
          window: '#2a2a2e',
          sidebar: '#252528',
          border: '#3a3a3e',
          text: '#e5e5e7',
          muted: '#8e8e93',
          accent: '#0a84ff',
          red: '#ff5f57',
          yellow: '#febc2e',
          green: '#28c840',
          orange: '#ff9500',
          purple: '#bf5af2',
        }
      },
      boxShadow: {
        'macos': '0 22px 70px 4px rgba(0,0,0,0.56)',
        'macos-sm': '0 4px 16px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        'macos': '10px',
      }
    },
  },
  plugins: [],
}

export default config
