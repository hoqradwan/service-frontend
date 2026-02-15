import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4DBC60",
        secondary: "#26547C",
        customRed: "#E2241B", // Custom color definition
      },
      keyframes: {
        blink: {
          "0%, 100%": {
            backgroundColor: ({ theme }) => theme("colors.customRed"),
            color: "white",
          },
          "50%": { backgroundColor: "white", color: "red", borderColor: "red" },
        },
      },
      animation: {
        blink: "blink 2s infinite",
      },
      borderRadius: {
        lg: "12px", // Customize as needed.
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
