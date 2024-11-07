/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content:
    ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#59504e",
        secondary: {
          DEFAULT: "#df45ff",
          100: "#d921ff",
          200: "#d400ff",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        bblack: ["Barlow-Black", "sans-serif"],
        bblackitalic: ["Barlow-BlackItalic", "sans-serif"],
        bbold: ["Barlow-Bold", "sans-serif"],
        bbolditalic: ["Barlow-BoldItalic", "sans-serif"],
        bextrabold: ["Barlow-ExtraBold", "sans-serif"],
        bextrabolditalic: ["Barlow-ExtraBoldItalic", "sans-serif"],
        bextralight: ["Barlow-ExtraLight", "sans-serif"],
        bextralightitalic: ["Barlow-ExtraLightItalic", "sans-serif"],
        bitalic: ["Barlow-Italic", "sans-serif"],
        blight: ["Barlow-Light", "sans-serif"],
        blightitalic: ["Barlow-LightItalic", "sans-serif"],
        bmedium: ["Barlow-Medium", "sans-serif"],
        bmediumitalic: ["Barlow-MediumItalic", "sans-serif"],
        bregular: ["Barlow-Regular", "sans-serif"],
        bsemibold: ["Barlow-SemiBold", "sans-serif"],
        bdemibolditalic: ["Barlow-SemiBoldItalic", "sans-serif"],
        bthin: ["Barlow-Thin", "sans-serif"],
        bthinitalic: ["Barlow-ThinItalic", "sans-serif"]
      },
    },
  },
  plugins: [],
}