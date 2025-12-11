/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'brand-green': {
                    light: '#dcfce7',
                    DEFAULT: '#22c55e',
                    dark: '#166534',
                },
                'brand-gray': {
                    light: '#f9fafb',
                    DEFAULT: '#6b7280',
                    dark: '#1f2937',
                }
            },
            fontFamily: {
                sans: ['Roboto', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
