(() => {
  const hero = document.querySelector(".hero");
  const bg = hero && hero.querySelector(".hero__bg");
  if (!bg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const pointer = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let visible = true;
  let frame = 0;

  const step = () => {
    frame = 0;
    current.x += (pointer.x - current.x) * 0.06;
    current.y += (pointer.y - current.y) * 0.06;

    const scroll = Math.min(window.scrollY * 0.12, 40);
    bg.style.setProperty("--bg-x", `${(-current.x * 18).toFixed(1)}px`);
    bg.style.setProperty("--bg-y", `${(-current.y * 12 + scroll).toFixed(1)}px`);

    const settled = Math.abs(pointer.x - current.x) < 0.001 && Math.abs(pointer.y - current.y) < 0.001;
    if (!settled) request();
  };

  const request = () => {
    if (!frame && visible) frame = requestAnimationFrame(step);
  };

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) request();
  }).observe(hero);

  hero.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const rect = hero.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    request();
  });

  hero.addEventListener("pointerleave", () => {
    pointer.x = 0;
    pointer.y = 0;
    request();
  });

  window.addEventListener("scroll", request, { passive: true });
})();