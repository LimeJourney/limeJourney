import type { Config } from "tailwindcss"
const { fontFamily } = require("tailwindcss/defaultTheme")

const config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      colors: {
        forest: {
          100: "hsl(188, 44%, 30%)",
          200: "hsl(188, 52%, 26%)",
          300: "hsl(188, 56%, 22%)",
          400: "hsl(188, 60%, 18%)",
          500: "hsl(188, 69%, 14%)",
          600: "hsl(188, 62%, 12%)",
          700: "hsl(188, 58%, 10%)",
          800: "hsl(188, 56%, 7%)",
          900: "hsl(188, 54%, 5%)",
          muted: "hsl(188, 69%, 14%)",
        },
        meadow: {
          100: "hsl(93, 100%, 98%)",
          200: "hsl(93, 100%, 96%)",
          300: "hsl(93, 100%, 94%)",
          400: "hsl(93, 100%, 92%)",
          500: "hsl(93, 100%, 90%)",
          600: "hsl(93, 94%, 87%)",
          700: "hsl(93, 90%, 84%)",
          800: "hsl(93, 79%, 81%)",
          900: "hsl(93, 70%, 78%)",
          muted: "hsl(93, 50%, 90%)",
        },
        peach: {
          50: "#fff5f0",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        screaminGreen: "#5aff91",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        euclid: ["var(--font-euclid)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
