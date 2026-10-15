(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!reduceMotion.matches) {
    root.style.scrollBehavior = "smooth";
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const nav = document.getElementById("nav");
  const toggle = nav.querySelector(".nav__toggle");
  const menuLinks = nav.querySelectorAll(".nav__menu a");

  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    root.style.overflow = open ? "hidden" : "";
  };

  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  menuLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
  window.matchMedia("(min-width: 47.5rem)").addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });

  const progress = document.querySelector(".scroll-progress");
  let ticking = false;

  const update = () => {
    const max = root.scrollHeight - window.innerHeight;
    const value = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    progress.style.setProperty("--progress", value.toFixed(4));
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", update);
  update();

  const watched = [document.getElementById("top")]
    .concat([...menuLinks].map((link) => document.querySelector(link.getAttribute("href"))))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        menuLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  watched.forEach((section) => spy.observe(section));

  const seededRandom = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  document.querySelectorAll(".member__glyph").forEach((el) => {
    const rand = seededRandom(Number(el.dataset.seed || 1) * 7919);
    const size = 6;
    const half = size / 2;
    const cell = 100 / size;
    const gap = 1.5;
    const cells = [];

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < half; x++) {
        if (rand() > 0.5) cells.push({ x, y, alpha: 0.35 + rand() * 0.65 });
      }
    }
    if (!cells.length) return;

    const accent = cells[Math.floor(rand() * cells.length)];
    const rect = (x, y, fill, alpha) =>
      `<rect x="${x * cell + gap}" y="${y * cell + gap}" width="${cell - gap * 2}" height="${cell - gap * 2}" rx="1" style="fill:${fill};fill-opacity:${alpha}"/>`;

    const shapes = cells
      .map((c) => {
        const fill = c === accent ? "var(--accent)" : "var(--ink)";
        const alpha = c === accent ? 1 : c.alpha.toFixed(2);
        return rect(c.x, c.y, fill, alpha) + rect(size - 1 - c.x, c.y, fill, alpha);
      })
      .join("");

    el.innerHTML = `<svg viewBox="0 0 100 100" role="presentation" focusable="false">${shapes}</svg>`;
  });
})();