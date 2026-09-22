(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches || !("onwheel" in document)) return;

  var EASE = 0.2; // lower = slower, more continuous catch-up. A traditional mouse sends a few big discrete
  // clicks (not many small continuous deltas like a trackpad), so a low value here reads as
  // "laggy/heavy" instead of "smooth" on mouse users — keep this snappy enough to feel responsive.
  var MAX_STEP = 600; // clamp a single wheel tick so only a freak input value gets capped

  var current = window.scrollY;
  var target = current;
  var ticking = false;
  var syncTimer = null;

  // Recomputed on every wheel tick instead of cached, because this page grows
  // after load (lazy images, the "ver mas" store list expansion, etc.) — a
  // stale max would clamp the target below the real bottom and feel "stuck".
  function getMaxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function normalizeDelta(event) {
    var delta = event.deltaY;
    if (event.deltaMode === 1) delta *= 18; // line -> px
    else if (event.deltaMode === 2) delta *= window.innerHeight; // page -> px
    return delta;
  }

  function usesNativeScroll(node) {
    return !!(node && node.closest && node.closest(".mobile-nav, [data-native-scroll]"));
  }

  function render() {
    // Re-clamp every frame too, not just on the wheel tick that started the glide:
    // content can finish growing (a lazy image settling in) mid-animation.
    target = Math.max(0, Math.min(getMaxScroll(), target));
    current += (target - current) * EASE;
    if (Math.abs(target - current) < 0.5) current = target;
    window.scrollTo(0, current);
    if (current !== target) {
      requestAnimationFrame(render);
    } else {
      ticking = false;
    }
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  }

  function onWheel(event) {
    if (document.body.classList.contains("menu-open") || usesNativeScroll(event.target)) return;
    event.preventDefault();
    var delta = normalizeDelta(event);
    delta = Math.max(-MAX_STEP, Math.min(MAX_STEP, delta));
    target = Math.max(0, Math.min(getMaxScroll(), target + delta));
    requestTick();
  }

  // Stay in sync with scrolling we didn't cause ourselves (anchor links, keyboard, scrollIntoView).
  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      clearTimeout(syncTimer);
      syncTimer = setTimeout(function () {
        current = window.scrollY;
        target = current;
      }, 80);
    },
    { passive: true }
  );

  window.addEventListener("wheel", onWheel, { passive: false });
})();
