import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0e2a3a",
        "navy-2": "#123649",
        ink: "#1c2733",
        teal: "#7fd1c0",
        "teal-dark": "#2f7d5c",
        gold: "#c8a23a",
        danger: "#b3402e",
        paper: "#f6f8f9",
      },
      fontFamily: {
        display: ["Space Grotesk", "Segoe UI", "system-ui", "sans-serif"],
        body: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
