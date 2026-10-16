/**
 * components.js
 * Eaglenest Academy – shared UI components.
 *
 * Injects:
 *   • Sticky navbar  → #site-header
 *   • Site footer    → #site-footer
 *   • WhatsApp FAB   → appended to <body>
 *
 * Call order in HTML (end of <body>):
 *   1. components.js   ← this file
 *   2. main.js         ← wires up interactivity
 *
 * The navbar reads the current page filename from window.location.pathname
 * and adds the .active-link class to the matching nav item automatically.
 */

/* =========================================================================
   1. CONFIGURATION
   ========================================================================= */

const SITE = {
  name:      "Eaglenest Academy",
  tagline:   "Nurturing Eagles, Shaping Futures",
  phone:     "+254XXXXXXXXX",              // ← replace with real number
  email:     "info@eaglenestacademy.ac.ke",
  address:   "123 Eagle Ridge Road, Nairobi, Kenya",
  logoSrc:   "assets/images/logo/logo.png", // fallback to text if missing
  whatsapp:  "+254XXXXXXXXX",              // ← replace with real WA number
  socials: {
    facebook:  "https://facebook.com/eaglenestacademy",
    twitter:   "https://twitter.com/eaglenestacad",
    instagram: "https://instagram.com/eaglenestacademy",
    youtube:   "https://youtube.com/@eaglenestacademy",
  },
};

/** Navigation links – href is relative so every page can use the same list. */
const NAV_LINKS = [
  { label: "Home",        href: "index.html"      },
  { label: "About",       href: "about.html"      },
  { label: "Academics",   href: "academics.html"  },
  { label: "Admissions",  href: "admissions.html" },
  { label: "Student Life",href: "student-life.html"},
  { label: "Contact",     href: "contact.html"    },
];

/* =========================================================================
   2. HELPERS
   ========================================================================= */

/**
 * Returns the filename portion of the current URL (e.g. "about.html").
 * Falls back to "index.html" for the root path.
 */
function currentPage() {
  const path = window.location.pathname;
  const file = path.split("/").pop();
  return file === "" ? "index.html" : file;
}

/** Escape HTML to prevent accidental XSS from config values. */
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* =========================================================================
   3. NAVBAR
   ========================================================================= */

/**
 * buildNavbar()
 * Constructs the full sticky navbar HTML string and injects it into
 * the #site-header element.
 *
 * Features:
 *   – Logo (image with text fallback)
 *   – Desktop nav links with active-link highlight
 *   – "Apply Now" CTA button (green)
 *   – Hamburger button (mobile)
 *   – Mobile slide-in drawer (#mobile-menu) with same links + CTA
 */
function buildNavbar() {
  const header = document.getElementById("site-header");
  if (!header) {
    console.warn("[components.js] #site-header not found – navbar not rendered.");
    return;
  }

  const active = currentPage();

  /* ── Desktop nav link items ── */
  const desktopLinks = NAV_LINKS.map(({ label, href }) => {
    const isActive = href === active;
    return `
      <a href="${esc(href)}"
         class="nav-link text-sm font-medium text-ink hover:text-leaf-600 transition-colors duration-150
                ${isActive ? "active-link" : ""}">
        ${esc(label)}
      </a>`;
  }).join("\n");

  /* ── Mobile nav link items ── */
  const mobileLinks = NAV_LINKS.map(({ label, href }) => {
    const isActive = href === active;
    return `
      <a href="${esc(href)}"
         class="mobile-nav-link block px-4 py-3 rounded-lg text-base font-medium
                text-ink hover:bg-sky-50 hover:text-leaf-600 transition-colors duration-150
                ${isActive ? "bg-leaf-50 text-leaf-600 font-semibold" : ""}">
        ${esc(label)}
      </a>`;
  }).join("\n");

  /* ── Logo markup ── */
  const logoMarkup = `
    <a href="index.html" class="flex items-center gap-3 shrink-0" aria-label="Eaglenest Academy home">
      <img src="${esc(SITE.logoSrc)}"
           alt="${esc(SITE.name)} logo"
           class="h-10 w-auto"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <span style="display:none"
            class="items-center justify-center w-10 h-10 rounded-full bg-brand-gradient text-white font-heading font-bold text-lg select-none">
        EA
      </span>
      <span class="font-heading font-bold text-ink text-xl leading-tight hidden sm:block">
        ${esc(SITE.name)}
      </span>
    </a>`;

  /* ── Full navbar HTML ── */
  header.innerHTML = `
    <!-- ╔══════════════════════════════════════════════════════╗ -->
    <!-- ║             EAGLENEST ACADEMY – NAVBAR              ║ -->
    <!-- ╚══════════════════════════════════════════════════════╝ -->
    <nav class="w-full bg-white border-b border-sky-100" role="navigation" aria-label="Main navigation">

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          ${logoMarkup}

          <!-- Desktop links (hidden on mobile) -->
          <div class="hidden md:flex items-center gap-6 lg:gap-8" role="menubar">
            ${desktopLinks}
          </div>

          <!-- Desktop CTA + Mobile hamburger -->
          <div class="flex items-center gap-3">

            <!-- "Apply Now" CTA – desktop only -->
            <a href="admissions.html"
               class="hidden md:inline-flex items-center px-4 py-2 rounded-full
                      bg-leaf-600 hover:bg-leaf-500 text-white text-sm font-semibold
                      transition-colors duration-150 shadow-soft">
              Apply Now
            </a>

            <!-- Hamburger button – mobile only -->
            <button id="hamburger-btn"
                    type="button"
                    aria-label="Open navigation menu"
                    aria-expanded="false"
                    aria-controls="mobile-menu"
                    class="md:hidden inline-flex items-center justify-center p-2 rounded-lg
                           text-ink hover:bg-sky-50 transition-colors duration-150">
              <!-- Hamburger icon -->
              <svg id="hamburger-icon" class="w-6 h-6" fill="none" stroke="currentColor"
                   stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <!-- Close (X) icon – shown when menu is open -->
              <svg id="close-icon" class="w-6 h-6 hidden" fill="none" stroke="currentColor"
                   stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

          </div><!-- /flex items-center gap-3 -->
        </div><!-- /flex items-center justify-between h-16 -->
      </div><!-- /max-w-7xl -->

      <!-- ─── Mobile Drawer ───────────────────────────────────── -->
      <!--
        Positioned fixed so it overlays the page content.
        Opened/closed by main.js mobileMenuToggle().
        CSS transition defined in custom.css (#mobile-menu).
      -->
      <div id="mobile-menu"
           role="dialog"
           aria-modal="true"
           aria-label="Navigation menu"
           class="fixed inset-y-0 right-0 z-50 w-72 max-w-full bg-white shadow-soft-lg
                  flex flex-col md:hidden">

        <!-- Drawer header -->
        <div class="flex items-center justify-between px-4 py-4 border-b border-sky-100">
          <span class="font-heading font-bold text-ink text-lg">${esc(SITE.name)}</span>
          <button id="mobile-menu-close"
                  type="button"
                  aria-label="Close navigation menu"
                  class="p-2 rounded-lg text-ink hover:bg-sky-50 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
                 viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Drawer nav links -->
        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Mobile navigation">
          ${mobileLinks}
        </nav>

        <!-- Drawer footer: CTA -->
        <div class="px-4 py-4 border-t border-sky-100">
          <a href="admissions.html"
             class="block text-center px-4 py-3 rounded-full bg-leaf-600 hover:bg-leaf-500
                    text-white font-semibold transition-colors duration-150 shadow-soft">
            Apply Now
          </a>
        </div>

      </div><!-- /#mobile-menu -->

      <!-- Overlay backdrop (click to close drawer) -->
      <div id="menu-backdrop"
           class="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm hidden md:hidden"
           aria-hidden="true">
      </div>

    </nav>
  `;

  /* Mark header as sticky via Tailwind classes */
  header.classList.add(
    "sticky", "top-0", "z-30",
    "transition-shadow", "duration-300"
  );
}

/* =========================================================================
   4. FOOTER
   ========================================================================= */

/**
 * buildFooter()
 * Injects a 4-column responsive footer into #site-footer.
 *
 * Columns:
 *   1. About blurb + logo
 *   2. Quick links
 *   3. Contact details (address, phone, email)
 *   4. Office hours + social icons
 */
function buildFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) {
    console.warn("[components.js] #site-footer not found – footer not rendered.");
    return;
  }

  /* ── Quick links (reuse NAV_LINKS) ── */
  const quickLinks = NAV_LINKS.map(({ label, href }) => `
    <li>
      <a href="${esc(href)}"
         class="text-sky-100 hover:text-white hover:underline transition-colors duration-150 text-sm">
        ${esc(label)}
      </a>
    </li>`).join("\n");

  /* ── Social icon SVGs ── */
  const socials = [
    {
      name: "Facebook",
      href: SITE.socials.facebook,
      /* Facebook "f" path */
      svg: `<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>`,
    },
    {
      name: "Twitter / X",
      href: SITE.socials.twitter,
      svg: `<path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.43.36a9 9 0 01-2.88 1.1
              A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03
              C7.69 5.4 4.07 3.58 1.64.9a4.52 4.52 0 00-.61 2.27c0 1.57.8 2.95 2.01 3.76
              a4.49 4.49 0 01-2.05-.57v.06c0 2.19 1.56 4.02 3.63 4.43a4.54 4.54 0 01-2.04.08
              c.57 1.79 2.24 3.09 4.21 3.13A9.05 9.05 0 010 19.54a12.77 12.77 0 006.92 2.03
              c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.18 9.18 0 0023 3z"/>`,
    },
    {
      name: "Instagram",
      href: SITE.socials.instagram,
      svg: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>`,
    },
    {
      name: "YouTube",
      href: SITE.socials.youtube,
      svg: `<path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46
              A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96
              C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12
              a29 29 0 00-.46-5.58z"/>
            <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>`,
    },
  ];

  const socialIcons = socials.map(({ name, href, svg }) => `
    <a href="${esc(href)}"
       target="_blank"
       rel="noopener noreferrer"
       aria-label="${esc(SITE.name)} on ${esc(name)}"
       class="inline-flex items-center justify-center w-9 h-9 rounded-full
              bg-white/10 hover:bg-leaf-500 text-white transition-colors duration-150">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        ${svg}
      </svg>
    </a>`).join("\n");

  footer.innerHTML = `
    <!-- ╔══════════════════════════════════════════════════════╗ -->
    <!-- ║             EAGLENEST ACADEMY – FOOTER              ║ -->
    <!-- ╚══════════════════════════════════════════════════════╝ -->
    <footer class="bg-ink text-white" role="contentinfo">

      <!-- ── Main footer grid ── -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <!-- Column 1: About blurb -->
          <div class="lg:col-span-1">
            <div class="flex items-center gap-2 mb-4">
              <img src="${esc(SITE.logoSrc)}"
                   alt="${esc(SITE.name)} logo"
                   class="h-10 w-auto brightness-0 invert"
                   onerror="this.style.display='none';">
              <span class="font-heading font-bold text-white text-lg">
                ${esc(SITE.name)}
              </span>
            </div>
            <p class="text-sky-100 text-sm leading-relaxed">
              ${esc(SITE.tagline)}. We are committed to academic excellence,
              character development, and preparing students for a rapidly
              changing world.
            </p>
          </div>

          <!-- Column 2: Quick links -->
          <div>
            <h3 class="font-heading font-semibold text-white text-base mb-4 uppercase tracking-wide">
              Quick Links
            </h3>
            <ul class="space-y-2">
              ${quickLinks}
            </ul>
          </div>

          <!-- Column 3: Contact details -->
          <div>
            <h3 class="font-heading font-semibold text-white text-base mb-4 uppercase tracking-wide">
              Contact Us
            </h3>
            <ul class="space-y-3 text-sm text-sky-100">

              <!-- Address -->
              <li class="flex gap-3">
                <svg class="w-5 h-5 text-leaf-500 shrink-0 mt-0.5" fill="none"
                     stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827
                           0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>${esc(SITE.address)}</span>
              </li>

              <!-- Phone -->
              <li class="flex gap-3">
                <svg class="w-5 h-5 text-leaf-500 shrink-0" fill="none"
                     stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0
                           01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516
                           5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0
                           01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <a href="tel:${esc(SITE.phone)}"
                   class="hover:text-white transition-colors">${esc(SITE.phone)}</a>
              </li>

              <!-- Email -->
              <li class="flex gap-3">
                <svg class="w-5 h-5 text-leaf-500 shrink-0" fill="none"
                     stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0
                           002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <a href="mailto:${esc(SITE.email)}"
                   class="hover:text-white transition-colors">${esc(SITE.email)}</a>
              </li>

            </ul>
          </div>

          <!-- Column 4: Office hours + socials -->
          <div>
            <h3 class="font-heading font-semibold text-white text-base mb-4 uppercase tracking-wide">
              Office Hours
            </h3>
            <ul class="space-y-1 text-sm text-sky-100 mb-6">
              <li class="flex justify-between">
                <span>Monday – Friday</span><span>7:30 am – 5:00 pm</span>
              </li>
              <li class="flex justify-between">
                <span>Saturday</span><span>8:00 am – 1:00 pm</span>
              </li>
              <li class="flex justify-between">
                <span>Sunday</span><span class="text-sky-300">Closed</span>
              </li>
            </ul>

            <h3 class="font-heading font-semibold text-white text-base mb-3 uppercase tracking-wide">
              Follow Us
            </h3>
            <div class="flex flex-wrap gap-2">
              ${socialIcons}
            </div>
          </div>

        </div><!-- /grid -->
      </div><!-- /max-w-7xl -->

      <!-- ── Bottom bar ── -->
      <div class="border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4
                    flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sky-100">
          <p>&copy; <span id="footer-year">${new Date().getFullYear()}</span>
             ${esc(SITE.name)}. All rights reserved.</p>
          <div class="flex gap-4">
            <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-white transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>

    </footer>
  `;
}

/* =========================================================================
   5. WHATSAPP FLOATING ACTION BUTTON
   ========================================================================= */

/**
 * buildWhatsAppFAB()
 * Appends a fixed-position WhatsApp button to the bottom-right of the page.
 * The pulse animation is defined in custom.css.
 */
function buildWhatsAppFAB() {
  // Avoid duplicates on hot-reload / multiple calls
  if (document.getElementById("whatsapp-fab")) return;

  const encodedMsg = encodeURIComponent(
    `Hello ${SITE.name}, I would like to get more information.`
  );
  const waURL = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodedMsg}`;

  const fab = document.createElement("a");
  fab.id        = "whatsapp-fab";
  fab.href      = waURL;
  fab.target    = "_blank";
  fab.rel       = "noopener noreferrer";
  fab.setAttribute("aria-label", "Chat with us on WhatsApp");
  fab.className = [
    "fixed", "bottom-6", "right-6", "z-50",
    "flex", "items-center", "justify-center",
    "w-14", "h-14", "rounded-full",
    "bg-leaf-500", "hover:bg-leaf-600",
    "text-white", "shadow-soft-lg",
    "transition-colors", "duration-150",
  ].join(" ");

  fab.innerHTML = `
    <!-- WhatsApp SVG icon -->
    <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
               -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463
               -2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606
               .134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371
               -.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51
               -.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04
               1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2
               5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118
               .571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413
               -.074-.124-.272-.198-.57-.347z"/>
      <path d="M12.004 2C6.477 2 2 6.478 2 12.004c0 1.77.463 3.478 1.338 4.988L2 22
               l5.205-1.318A9.956 9.956 0 0012.004 22C17.523 22 22 17.522 22 12.004
               22 6.478 17.523 2 12.004 2zm0 18.214a8.187 8.187 0 01-4.208-1.158
               l-.302-.18-3.088.782.81-2.979-.197-.308A8.19 8.19 0 013.8 12.004
               c0-4.524 3.681-8.205 8.205-8.205 4.523 0 8.204 3.681 8.204 8.205
               0 4.523-3.681 8.21-8.205 8.21z"/>
    </svg>`;

  document.body.appendChild(fab);
}

/* =========================================================================
   6. INIT – build all components when the DOM is ready
   ========================================================================= */

/**
 * initComponents()
 * Called once the DOM is fully parsed.
 * Safe to call manually if you load this script with `defer`.
 */
function initComponents() {
  buildNavbar();
  buildFooter();
  buildWhatsAppFAB();
}

// Support both: script at end of <body> AND script with defer attribute
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initComponents);
} else {
  initComponents();
}
