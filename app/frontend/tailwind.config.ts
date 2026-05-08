import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 44px rgba(34, 211, 238, 0.18)",
        lift: "0 24px 80px rgba(15, 23, 42, 0.14)"
      },
      backgroundImage: {
        "platform-grid":
          "linear-gradient(to right, rgba(148,163,184,.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,.16) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
} satisfies Config;
