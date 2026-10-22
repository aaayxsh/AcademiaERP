/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6547F5',       // Primary violet
          secondary: '#8B5CF6',     // Secondary purple
          lavender: '#E9E2FF',      // Light lavender
          bg: '#F7F6FC',            // Main background
          surface: '#FFFFFF',       // Surface white
          indigo: '#191A2E',        // Midnight indigo
          text: '#202039',          // Primary text
          muted: '#77768E',         // Secondary text
          emerald: '#16A579',       // Success emerald
          amber: '#F4A340',         // Warning amber
          red: '#E45469',           // Error red
          border: '#E9E7F2',        // Borders
        },
      },
      backgroundImage: {
        'violet-gradient': 'linear-gradient(135deg, #6547F5 0%, #8B5CF6 100%)',
        'soft-gradient': 'linear-gradient(135deg, #F0ECFF 0%, #FFFFFF 100%)',
        'card-gradient': 'linear-gradient(135deg, #FAF8FF 0%, #FFFFFF 100%)',
        'dark-indigo-gradient': 'linear-gradient(145deg, #191A2E 0%, #252642 100%)',
      },
      borderRadius: {
        'card': '18px',
        'card-lg': '22px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(101, 71, 245, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 12px 32px -4px rgba(101, 71, 245, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'violet-glow': '0 8px 24px -2px rgba(101, 71, 245, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
