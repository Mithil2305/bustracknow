/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 uses the content array to determine which files to scan
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#0D9488",
          600: "#0F766E",
          700: "#115e59",
          800: "#134e4a",
          900: "#042f2e",
        },
      },
    },
  },
  plugins: [],
};
