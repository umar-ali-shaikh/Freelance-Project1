// ===============================
// SMART AUTO-HIDE NAVBAR
// Reusable, framework-agnostic scroll controller (vanilla-JS equivalent
// of a `useSmartNavbar()` hook). All visual states live in CSS
// (.nav-enter / .nav-hidden in style.css) — this file only decides when
// to toggle them.
// ===============================
function initSmartNavbar(nav, options = {}) {
  if (!nav) return () => {};

  const {
    hideThreshold = 8, // ignore scroll deltas smaller than this (px) to stop flicker
    revealOffset = 80, // always show the navbar within this many px of the top
    isSuspended = () => false, // e.g. pause while the mobile sidebar is open
  } = options;

  let lastY = Math.max(window.scrollY, 0);
  let hidden = false;
  let ticking = false;

  function setHidden(next) {
    if (next === hidden) return;
    hidden = next;
    nav.classList.toggle("nav-hidden", hidden);
  }

  function update() {
    ticking = false;

    const currentY = Math.max(window.scrollY, 0);
    const delta = currentY - lastY;

    if (isSuspended() || currentY <= revealOffset) {
      setHidden(false);
      lastY = currentY;
      return;
    }

    if (Math.abs(delta) < hideThreshold) {
      return; // ignore micro-scrolls (mouse wheel / touchpad jitter)
    }

    setHidden(delta > 0); // scrolling down hides, scrolling up reveals
    lastY = currentY;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  // Trigger the entrance transition (fade + slide down) defined in CSS.
  requestAnimationFrame(() => {
    nav.classList.remove("nav-enter");
  });

  window.addEventListener("scroll", onScroll, { passive: true });

  return function cleanup() {
    window.removeEventListener("scroll", onScroll);
  };
}
