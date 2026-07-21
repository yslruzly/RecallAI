import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        primary: "#1A1A1A", // ink
        "primary-soft": "#3D3A36",
        "primary-deep": "#000000",
        accent: "#1A1A1A", // grounding shares the ink — monochrome
        background: "#FDFBF7", // paper cream
        card: "#FFFFFF",
        foreground: "#1A1A1A",
        muted: "#6F6B65", // warm gray
        "muted-bg": "#F3F0EA",
        border: "#E6E2DA",
        destructive: "#B91C1C",
      },
      boxShadow: {
        card: "0 1px 2px rgba(26, 26, 26, 0.04), 0 4px 14px rgba(26, 26, 26, 0.05)",
        glow: "0 0 0 1px rgba(26, 26, 26, 0.10), 0 6px 20px rgba(26, 26, 26, 0.08)",
      },
      animation: {
        "fade-up": "fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-soft": "pulseSoft 1.4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
