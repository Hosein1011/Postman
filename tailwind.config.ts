// tailwind.config.ts (place in root, next to package.json)
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        deep: {
          DEFAULT: "#020617",
          950: "#020617",
          900: "#0f172a",
          800: "#1e293b",
        },
        mint: {
          DEFAULT: "#10b981",
          500: "#10b981",
        },
        teal: {
          DEFAULT: "#14b8a6",
          500: "#14b8a6",
        },
        text: {
          primary: "#f8fafc",
          muted: "#94a3b8",
        },
      },
    },
  },
  plugins: [],
};

export default config;