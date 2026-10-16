/**
 * main.js
 * Eaglenest Academy – interactive behaviours.
 *
 * Responsibilities:
 *   1. Mobile menu toggle (hamburger ↔ close, drawer, backdrop)
 *   2. Scroll-reveal via IntersectionObserver (.reveal → .is-visible)
 *   3. Animated stat counters ([data-count])
 *   4. Accordion handler (.accordion-item)
 *   5. Back-to-top button (#back-to-top)
 *   6. Navbar scroll shadow (#site-header.scrolled)
 *
 * This file runs AFTER components.js has injected the navbar and footer,
 * so all queried elements are guaranteed to exist by the time the
 * DOMContentLoaded listener fires.
 */

/* =========================================================================
   ENTRY POINT
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initScrollReveal();
  initStatCounters();
  initAccordions();
  initBackToTop();
  initNavbarScroll();
});

/* =========================================================================
   1. MOBILE MENU TOGGLE
   ========================================================================= */

/**
 * initMobileMenu()
 *
 * Wires up the hamburger button, the mobile drawer (#mobile-menu),
 * the close button inside the drawer, and the backdrop overlay.
 *
 * CSS transitions for the drawer are defined in custom.css:
 *   #mobile-menu            { transform: translateX(100%); opacity: 0; }
 *   #mobile-menu.open       { transform: translateX(0);    opacity: 1; }
 */
function initMobileMenu() {
  const hamburgerBtn  = document.getElementById("hamburger-btn");
  const mobileMenu    = document.getElementById("mobile-menu");
  const closeBtn      = document.getElementById("mobile-menu-close");
  const backdrop      = document.getElementById("menu-backdrop");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeIcon     = document.getElementById("close-icon");

  // Bail silently if the navbar hasn't been rendered yet
  if (!hamburgerBtn || !mobileMenu) return;

  /** Opens the mobile drawer */
  function openMenu() {
    mobileMenu.classList.add("open");
    backdrop?.classList.remove("hidden");
    hamburgerIcon?.classList.add("hidden");
    closeIcon?.classList.remove("hidden");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    // Trap focus: move focus into the drawer
    closeBtn?.focus();
    // Prevent body scroll while drawer is open
    document.body.style.overflow = "hidden";
  }

  /** Closes the mobile drawer */
  function closeMenu() {
    mobileMenu.classList.remove("open");
    backdrop?.classList.add("hidden");
    hamburgerIcon?.classList.remove("hidden");
    closeIcon?.classList.add("hidden");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    // Return focus to the trigger for accessibility
    hamburgerBtn.focus();
  }

  hamburgerBtn.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", closeMenu);
  backdrop?.addEventListener("click", closeMenu);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      closeMenu();
    }
  });

  // Close drawer automatically when a link inside it is clicked
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close drawer if viewport is resized past the md breakpoint (768px)
  const mediaQuery = window.matchMedia("(min-width: 768px)");
  mediaQuery.addEventListener("change", (e) => {
    if (e.matches) closeMenu();
  });
}

/* =========================================================================
   2. SCROLL-REVEAL (IntersectionObserver)
   ========================================================================= */

/**
 * initScrollReveal()
 *
 * Observes every element with the .reveal class.
 * When an element enters the viewport (threshold 15 %), adds .is-visible
 * which triggers the CSS opacity + transform transition in custom.css.
 *
 * Usage in HTML:
 *   <div class="reveal">...</div>
 *   <div class="reveal reveal-left reveal-delay-2">...</div>
 */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  // Respect reduced-motion preference
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    // Show all immediately without animation
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Unobserve once revealed – animation only plays once
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold:  0.15, // element must be 15% visible to trigger
      rootMargin: "0px 0px -40px 0px", // don't trigger too close to viewport edge
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* =========================================================================
   3. ANIMATED STAT COUNTERS
   ========================================================================= */

/**
 * initStatCounters()
 *
 * Finds all elements with [data-count] and animates their text content
 * from 0 to the target number when they scroll into view.
 *
 * Optional attributes:
 *   data-count="1200"        → target number
 *   data-suffix="+"          → appended after number  (e.g. "1200+")
 *   data-prefix="KES "       → prepended before number
 *   data-duration="2000"     → animation duration in ms (default: 1800)
 *
 * Usage:
 *   <span class="stat-number" data-count="1200" data-suffix="+">0</span>
 */
function initStatCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  // Respect reduced-motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    counters.forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      el.textContent = prefix + target.toLocaleString() + suffix;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}

/**
 * animateCounter(el)
 * Runs the counting animation for a single element.
 * @param {HTMLElement} el
 */
function animateCounter(el) {
  const target   = parseInt(el.dataset.count,    10) || 0;
  const duration = parseInt(el.dataset.duration, 10) || 1800;
  const prefix   = el.dataset.prefix || "";
  const suffix   = el.dataset.suffix || "";
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);

    el.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/* =========================================================================
   4. ACCORDION
   ========================================================================= */

/**
 * initAccordions()
 *
 * Handles click events on .accordion-trigger buttons inside .accordion-item
 * containers. Toggles the corresponding .accordion-body open/closed via the
 * max-height technique defined in custom.css.
 *
 * Markup contract:
 *   <div class="accordion-item">
 *     <button class="accordion-trigger" aria-expanded="false">Question</button>
 *     <div class="accordion-body">Answer content...</div>
 *   </div>
 *
 * Set data-accordion-group="groupId" on a parent wrapper to enforce
 * single-open behaviour within that group.
 */
function initAccordions() {
  const triggers = document.querySelectorAll(".accordion-trigger");
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item  = trigger.closest(".accordion-item");
      const body  = item?.querySelector(".accordion-body");
      if (!item || !body) return;

      const isOpen = body.classList.contains("open");

      // Find sibling accordions in the same group and close them
      const group = item.closest("[data-accordion-group]");
      if (group) {
        group.querySelectorAll(".accordion-body.open").forEach((openBody) => {
          openBody.classList.remove("open");
          const openTrigger = openBody
            .closest(".accordion-item")
            ?.querySelector(".accordion-trigger");
          openTrigger?.setAttribute("aria-expanded", "false");
          setAccordionIcon(openTrigger, false);
        });
      }

      // Toggle the clicked accordion
      if (!isOpen) {
        body.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
        setAccordionIcon(trigger, true);
      } else {
        body.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        setAccordionIcon(trigger, false);
      }
    });
  });
}

/**
 * setAccordionIcon(trigger, isOpen)
 * Rotates the chevron/plus icon inside the accordion trigger button.
 * Looks for an element with .accordion-icon inside the trigger.
 * @param {HTMLElement|null} trigger
 * @param {boolean}          isOpen
 */
function setAccordionIcon(trigger, isOpen) {
  if (!trigger) return;
  const icon = trigger.querySelector(".accordion-icon");
  if (!icon) return;
  icon.style.transform = isOpen ? "rotate(180deg)" : "rotate(0deg)";
  icon.style.transition = "transform 0.3s ease";
}

/* =========================================================================
   5. BACK-TO-TOP BUTTON
   ========================================================================= */

/**
 * initBackToTop()
 *
 * Shows/hides the #back-to-top button based on scroll position.
 * The button must already exist in the HTML (or be injected by this function).
 * Smooth scroll to top on click.
 *
 * CSS visibility toggle:
 *   #back-to-top            { opacity: 0; pointer-events: none; }
 *   #back-to-top.visible    { opacity: 1; pointer-events: auto; }
 * Both defined in custom.css.
 */
function initBackToTop() {
  let btn = document.getElementById("back-to-top");

  // Auto-create the button if the page doesn't include it
  if (!btn) {
    btn = document.createElement("button");
    btn.id        = "back-to-top";
    btn.type      = "button";
    btn.setAttribute("aria-label", "Back to top");
    btn.className = [
      "fixed", "bottom-24", "right-6", "z-40",
      "w-11", "h-11", "rounded-full",
      "bg-sky-600", "hover:bg-sky-500",
      "text-white", "shadow-soft-md",
      "flex", "items-center", "justify-center",
      "transition-colors", "duration-150",
    ].join(" ");
    btn.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5"
           viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
      </svg>`;
    document.body.appendChild(btn);
  }

  // Show/hide on scroll
  function onScroll() {
    if (window.scrollY > 300) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Smooth scroll to top
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================================================================
   6. NAVBAR SCROLL SHADOW
   ========================================================================= */

/**
 * initNavbarScroll()
 *
 * Adds the .scrolled class to #site-header once the user scrolls past
 * 10px, enabling the box-shadow defined in custom.css.
 */
function initNavbarScroll() {
  const header = document.getElementById("site-header");
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  // Run once on load in case page is already scrolled (e.g. back button)
  onScroll();
}
