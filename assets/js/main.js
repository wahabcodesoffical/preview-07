/* PENALBA ROOFING — demo concept interactions
   - Mobile nav toggle + active link states
   - Sticky header state
   - GSAP scroll reveals + parallax (graceful if CDN fails)
   - Demo quote form (non-functional by design)
*/
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.classList.remove("is-open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Demo quote form (does NOT send data anywhere) ---------- */
  var form = document.getElementById("quote-form");
  var notice = document.getElementById("form-notice");
  if (form && notice) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // demo only — no backend, no data collection
      notice.hidden = false;
      notice.setAttribute("tabindex", "-1");
      notice.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });
      notice.focus({ preventScroll: true });
    });
  }

  /* ---------- GSAP animations ---------- */
  var hasGsap = typeof window.gsap !== "undefined";
  var root = document.documentElement;

  if (!hasGsap || prefersReduced) {
    // Content stays fully visible without animation.
    root.classList.add("no-anim");
    return;
  }

  root.classList.add("js-anim");

  var hasTrigger = typeof window.ScrollTrigger !== "undefined";
  if (hasTrigger) gsap.registerPlugin(ScrollTrigger);

  /* Hero intro — staggered rise */
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to("[data-hero]", { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, startAt: { y: 40 } });

  /* Hero background parallax scrub */
  if (hasTrigger) {
    gsap.to(".hero__photo", {
      yPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    /* Storm band slow zoom */
    gsap.fromTo(".storm__bg img",
      { scale: 1.08 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: ".storm", start: "top bottom", end: "bottom top", scrub: true }
      }
    );
  }

  /* Scroll reveals */
  if (hasTrigger) {
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true }
        }
      );
    });

    /* Service images settle-zoom on scroll into view */
    gsap.utils.toArray(".card__media img").forEach(function (img) {
      gsap.fromTo(img,
        { scale: 1.12 },
        {
          scale: 1,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: img, start: "top 92%", once: true }
        }
      );
    });

    /* Process connector line draw */
    gsap.utils.toArray(".steps li").forEach(function (li) {
      ScrollTrigger.create({
        trigger: li,
        start: "top 82%",
        once: true,
        onEnter: function () { li.classList.add("is-drawn"); }
      });
    });
  } else {
    // GSAP core loaded but not ScrollTrigger — reveal everything.
    gsap.to("[data-hero], [data-reveal]", { opacity: 1, y: 0, duration: 0.6 });
  }

  /* Nav active link states */
  if (hasTrigger) {
    ["services", "why", "area", "quote"].forEach(function (id) {
      var section = document.getElementById(id);
      var link = document.querySelector('.nav__links a[href="#' + id + '"]');
      if (!section || !link) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: function (self) { link.classList.toggle("active", self.isActive); }
      });
    });
  }
})();
