/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./pages/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./components/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        appear: {
          "0%": { 
            transform: "translateX(100%)",
            opacity: 1,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
        disappear: {
          "0%": {
            transform: "translateX(0)",
            opacity: 1,
          },
          "100%": {
            transform: "translateX(-100%)",
            opacity: 1,
          },
        },
        poyo: {
          "0%": {
            transform: "scale(1.0)",
          },
          "40%": {
            transform: "scale(1.0)",
          },
          "50%": {
            transform: "scale(0.8)",
          },
          "60%": {
            transform: "scale(1.0)",
          },
          "70%": {
            transform: "scale(0.8)",
          },
          "80%": {
            transform: "scale(1.0)",
          }
        },
        fade: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },   
        }
      },
      animation: {
        appear: "appear 1s ease 0s 1 forwards",
        disappear: "disappear 1s ease 0s 1 forwards",
        poyo: "poyo 3s linear infinite",
        fade: "fade 1s ease 0s",
      },
    },
  },
  plugins: [],
}