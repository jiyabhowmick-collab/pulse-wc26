import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: "#070B14",
          900: "#0B1120",
          800: "#111A2E",
          700: "#1A2740",
        },
        signal: {
          DEFAULT: "#00E28A",
          dim: "#0B7A50",
        },
        alert: {
          DEFAULT: "#FF5B39",
          dim: "#8C2E1C",
        },
        cream: "#F5F3EA",
        steel: "#7C8DB5",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(124,141,181,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,141,181,0.08) 1px, transparent 1px)",
      },
      keyframes: {
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulse2: "pulse2 2s ease-in-out infinite",
        rise: "rise 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
