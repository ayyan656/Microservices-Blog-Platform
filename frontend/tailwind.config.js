/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Editorial Color Palette (Wit & Delight inspired)
            colors: {
                // Base colors
                primary: '#1a1a1a',
                secondary: '#6b7280',

                // Editorial palette
                editorial: {
                    bg: '#FDFBF7',        // Warm off-white
                    cream: '#FAF8F5',     // Lighter cream
                    text: '#1a1a1a',      // Deep charcoal
                    muted: '#6b7280',     // Muted gray
                    accent: '#C9A77C',    // Warm gold
                    hover: '#b8956a',     // Darker gold for hover
                },

                // UI colors
                accent: '#FF4405',        // Vibrant orange CTA
                surface: '#f5f5f5',
                border: '#e5e5e5',
            },

            // Typography
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },

            // Font sizes for editorial scale
            fontSize: {
                'display': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'headline': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
                'title': ['2rem', { lineHeight: '1.3' }],
                'subtitle': ['1.25rem', { lineHeight: '1.5' }],
            },

            // Spacing
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },

            // Border radius
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },

            // Animations
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(-10px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },

            // Box shadows
            boxShadow: {
                'editorial': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
                'editorial-hover': '0 12px 40px -8px rgba(0, 0, 0, 0.15)',
            },

            // Grid template columns for asymmetric layouts
            gridTemplateColumns: {
                'editorial-hero': '7fr 5fr',
                'editorial-feature': '8fr 4fr',
            },
        },
    },
    plugins: [],
}
