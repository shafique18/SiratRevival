/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx,html}",
    ],
    theme: {
        extend: {
            fontFamily: {
            sans: ['Poppins', 'sans-serif'],
            },
            transform: ['group-hover'],
        },
    },
    plugins: [],
}

