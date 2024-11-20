/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'project-pink' : '#e6648c',
        'project-pink-buttons' : '#f65586',
        'project-dark' : '#20211a',
        'project-dark-bg' : '#37392d',
        'project-blue' : '#c4e6e9',
        'project-blue-buttons' : '#a2d8dd',
        'project-yellow' : '#ffed90',
        'project-yellow-buttons' : '#ffe14d',
      }
    },
  },
  plugins: [],
}

