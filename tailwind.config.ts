import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tryvor palette
        tryvor: {
          dark: "#0A0C16",
          panel: "#12141F",
          border: "#1E2035",
          teal: "#00C8A0",
          "teal-dark": "#009E78",
          "teal-muted": "#003D30",
          "teal-light": "#E0FAF4",
          gray: "#B4B8C6",
          "gray-mid": "#646878",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
