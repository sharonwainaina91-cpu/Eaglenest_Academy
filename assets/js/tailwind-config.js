/**
 * tailwind-config.js
 * Eaglenest Academy – Tailwind CSS configuration (CDN mode).
 * Loaded BEFORE the Tailwind CDN <script> so the CDN picks it up
 * via the global window.tailwind.config object.
 *
 * Usage in every HTML page:
 *   <script src="assets/js/tailwind-config.js"></script>
 *   <script src="https://cdn.tailwindcss.com"></script>
 */

window.tailwind = window.tailwind || {};

window.tailwind.config = {
  /* ─── Dark-mode strategy ─────────────────────────────────────────────── */
  darkMode: "class",

  theme: {
    extend: {
      /* ─── Brand colour palettes ─────────────────────────────────────── */
      colors: {
        /**
         * sky  – primary blue (trust, academia)
         *   50  #F0F9FF  – faintest tint  (backgrounds, zebra rows)
         *   100 #E0F2FE  – light tint     (hover backgrounds, badges)
         *   500 #0EA5E9  – mid tone       (links, icons, accents)
         *   600 #0284C7  – strong tone    (primary buttons, borders)
         */
        sky: {
          50:  "#F0F9FF",
          100: "#E0F2FE",
          500: "#0EA5E9",
          600: "#0284C7",
        },

        /**
         * leaf – secondary green (growth, nature)
         *   50  #F0FDF4  – faintest tint  (success banners, backgrounds)
         *   100 #DCFCE7  – light tint     (hover state, chip backgrounds)
         *   500 #22C55E  – mid tone       (success icons, highlights)
         *   600 #16A34A  – strong tone    (CTA button, active link)
         */
        leaf: {
          50:  "#F0FDF4",
          100: "#DCFCE7",
          500: "#22C55E",
          600: "#16A34A",
        },

        /**
         * ink  – deep navy for body text and dark surfaces
         */
        ink: "#0F2A43",
      },

      /* ─── Typography ─────────────────────────────────────────────────── */
      fontFamily: {
        /**
         * heading – used on h1-h4, hero titles, section headings.
         * Century Gothic is a system font on most Windows/Mac machines;
         * Questrial (Google Font) serves as a clean web fallback.
         */
        heading: ['"Century Gothic"', '"Questrial"', "sans-serif"],

        /**
         * body – Montserrat for all body copy and UI elements.
         */
        body: ['"Montserrat"', "sans-serif"],
      },

      /* ─── Box shadows ─────────────────────────────────────────────────── */
      boxShadow: {
        soft:   "0 2px 8px 0 rgba(15,42,67,0.08)",   // subtle card lift
        "soft-md": "0 4px 16px 0 rgba(15,42,67,0.12)", // hover / modal
        "soft-lg": "0 8px 32px 0 rgba(15,42,67,0.16)", // hero cards, drawers
      },

      /* ─── Border-radius extras ───────────────────────────────────────── */
      borderRadius: {
        "4xl": "2rem",   // pill cards, hero images
        "5xl": "2.5rem", // large hero banners
      },
    },
  },

  /* ─── Plugins (none needed for CDN mode) ─────────────────────────────── */
  plugins: [],
};
