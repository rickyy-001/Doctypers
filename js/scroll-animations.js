(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    root.classList.add("no-motion");
    return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const reveal = (items) => {
      items.forEach((el, i) => {
        el.style.setProperty("--reveal-delay", `${i * 90}ms`);
        el.classList.add("is-visible");
      });
    };

    ScrollTrigger.batch("[data-reveal]", {
      start: "top 88%",
      once: true,
      batchMax: 6,
      interval: 0.1,
      onEnter: reveal,
      onLeave: reveal,
    });

    gsap.to(".hero__content", {
      yPercent: -14,
      opacity: 0.15,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    window.addEventListener("load", () => ScrollTrigger.refresh());
  } catch (error) {
    root.classList.add("no-motion");
  }
})();