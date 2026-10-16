/**
 * academics-tabs.js
 * Eaglenest Academy – accessible tab implementation for Academics page.
 *
 * Manages the level tabs (Pre-Primary, Primary, Junior School) using
 * ARIA best practices for accessibility.
 *
 * Features:
 *   • Click to switch tabs
 *   • Keyboard navigation (Arrow keys, Home, End)
 *   • ARIA attributes (aria-selected, aria-controls, role="tab/tabpanel")
 *   • Visual state sync (active/inactive styling)
 *
 * HTML contract:
 *   <button role="tab" id="tab-X" aria-controls="panel-X" class="tab-button">Label</button>
 *   <div role="tabpanel" id="panel-X" aria-labelledby="tab-X" class="tab-panel">Content</div>
 *
 * Call order:
 *   1. components.js (navbar/footer)
 *   2. main.js (scroll-reveal, etc.)
 *   3. academics-tabs.js ← this file
 */

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
});

/**
 * initTabs()
 * Wires up all tab buttons and panels, adding click and keyboard handlers.
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('[role="tab"]');
  const tabPanels  = document.querySelectorAll('[role="tabpanel"]');

  if (!tabButtons.length || !tabPanels.length) {
    // No tabs found on this page – bail silently
    return;
  }

  // Convert NodeLists to arrays for easier manipulation
  const tabs   = Array.from(tabButtons);
  const panels = Array.from(tabPanels);

  /**
   * activateTab(index)
   * Switches to the tab at the specified index.
   * Updates ARIA attributes, CSS classes, and shows the correct panel.
   * @param {number} index - zero-based index of the tab to activate
   */
  function activateTab(index) {
    // Deactivate all tabs
    tabs.forEach((tab) => {
      tab.setAttribute("aria-selected", "false");
      tab.classList.remove("bg-sky-600", "text-white", "shadow-soft-md");
      tab.classList.add("bg-sky-50", "text-ink", "hover:bg-sky-100");
      tab.tabIndex = -1; // remove from tab order
    });

    // Hide all panels
    panels.forEach((panel) => {
      panel.classList.remove("active");
    });

    // Activate the selected tab
    const activeTab   = tabs[index];
    const panelId     = activeTab.getAttribute("aria-controls");
    const activePanel = document.getElementById(panelId);

    activeTab.setAttribute("aria-selected", "true");
    activeTab.classList.remove("bg-sky-50", "text-ink", "hover:bg-sky-100");
    activeTab.classList.add("bg-sky-600", "text-white", "shadow-soft-md");
    activeTab.tabIndex = 0; // add back to tab order

    if (activePanel) {
      activePanel.classList.add("active");
    }

    // Move focus to the newly activated tab (for keyboard nav)
    activeTab.focus();
  }

  // ─────────────────────────────────────────────────────────────────────
  // Click handlers
  // ─────────────────────────────────────────────────────────────────────
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateTab(index);
    });
  });

  // ─────────────────────────────────────────────────────────────────────
  // Keyboard navigation
  // ─────────────────────────────────────────────────────────────────────
  tabs.forEach((tab, index) => {
    tab.addEventListener("keydown", (e) => {
      let newIndex = index;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          // Move to previous tab (wrap around at start)
          newIndex = index === 0 ? tabs.length - 1 : index - 1;
          e.preventDefault();
          break;

        case "ArrowRight":
        case "ArrowDown":
          // Move to next tab (wrap around at end)
          newIndex = index === tabs.length - 1 ? 0 : index + 1;
          e.preventDefault();
          break;

        case "Home":
          // Jump to first tab
          newIndex = 0;
          e.preventDefault();
          break;

        case "End":
          // Jump to last tab
          newIndex = tabs.length - 1;
          e.preventDefault();
          break;

        default:
          // Do nothing for other keys
          return;
      }

      activateTab(newIndex);
    });
  });

  // ─────────────────────────────────────────────────────────────────────
  // Initialize: activate the first tab (or whichever has aria-selected="true")
  // ─────────────────────────────────────────────────────────────────────
  const initialIndex = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
  activateTab(initialIndex >= 0 ? initialIndex : 0);
}
