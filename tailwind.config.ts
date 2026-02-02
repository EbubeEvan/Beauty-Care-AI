import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "hero-img": "url('/images/hero-img.jpg')",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      /** 👇 Typography overrides */
      typography: {
        DEFAULT: {
          css: {
            strong: {
              fontWeight: "700",
              color: "inherit",
            },
            em: {
              fontStyle: "italic",
            },
            ul: {
              listStyleType: "disc",
              paddingLeft: "1.5rem",
              margin: "0.75rem 0",
            },
            ol: {
              listStyleType: "decimal",
              paddingLeft: "1.5rem",
              margin: "0.75rem 0",
            },
            li: {
              margin: "0.25rem 0",
              paddingLeft: "0.25rem",
            },
            p: {
              margin: "0.5rem 0",
              lineHeight: "1.6",
            },
            h1: {
              fontWeight: "700",
              marginTop: "1rem",
              marginBottom: "0.5rem",
              fontSize: "1.875rem",
              color: "inherit",
            },
            h2: {
              fontWeight: "700",
              marginTop: "1rem",
              marginBottom: "0.5rem",
              fontSize: "1.5rem",
              color: "inherit",
            },
            h3: {
              fontWeight: "700",
              marginTop: "1rem",
              marginBottom: "0.5rem",
              fontSize: "1.25rem",
              color: "inherit",
            },
            h4: {
              fontWeight: "700",
              marginTop: "1rem",
              marginBottom: "0.5rem",
              color: "inherit",
            },
            a: {
              color: "rgb(37 99 235)",
              textDecoration: "underline",
              "&:hover": {
                opacity: "0.8",
              },
            },
            code: {
              "&::before": {
                content: '""',
              },
              "&::after": {
                content: '""',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};

export default config;
