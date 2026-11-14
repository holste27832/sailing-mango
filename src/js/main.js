(() => {
  // Header bliver hvid, når man scroller
  const header = document.querySelector(".header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("load", onScroll);

  // Mobilmenu
  const toggle = document.querySelector(".header__toggle");
  const nav = document.querySelector(".header__nav");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("no-scroll", open);
  };
  toggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav?.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });
  // Luk menuen ved klik udenfor eller Esc
  document.addEventListener("click", (e) => { if (nav?.classList.contains("is-open") && !nav.contains(e.target)) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav?.classList.contains("is-open")) setMenu(false); });
  // Hvis skærmen bliver bred (fx telefon vendes), luk mobilmenuen
  matchMedia("(min-width: 861px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });

  // Elementer glider ind, når de kommer til syne
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Karrusel med pile
  const car = document.querySelector("[data-carousel]");
  if (car) {
    const step = () => (car.firstElementChild?.getBoundingClientRect().width || 300) + 22;
    document.querySelector("[data-carousel-next]")?.addEventListener("click", () => car.scrollBy({ left: step() }));
    document.querySelector("[data-carousel-prev]")?.addEventListener("click", () => car.scrollBy({ left: -step() }));
  }

  // Filter på togter-siden
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("is-active", b === btn));
      const f = btn.dataset.filter;
      document.querySelectorAll("[data-status]").forEach((el) => {
        const show = f === "alle" || el.dataset.status === "ledig" || el.dataset.status === "faa";
        el.toggleAttribute("data-hidden", !show);
      });
    });
  });

  // Indholdsfortegnelse: marker det afsnit, man læser
  const tocLinks = document.querySelectorAll("[data-toc]");
  if (tocLinks.length) {
    const map = new Map([...tocLinks].map((a) => [a.dataset.toc, a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove("is-active"));
          const a = map.get(en.target.id);
          if (a) {
            a.classList.add("is-active");
            // Rul kun selve menuen (vandret på mobil) – aldrig hele siden
            const list = a.closest("ul");
            if (list && list.scrollWidth > list.clientWidth) {
              const left = a.offsetLeft - (list.clientWidth - a.offsetWidth) / 2;
              list.scrollTo({ left, behavior: "smooth" });
            }
          }
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  // Galleri: klik for stort billede (eller video)
  document.querySelectorAll("[data-lightbox]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.dataset.lightbox;
      const box = document.createElement("div");
      box.className = "lightbox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-label", "Billede i stor størrelse – klik eller tryk Esc for at lukke");
      const media = /\.(mp4|webm|mov)$/i.test(src) ? document.createElement("video") : document.createElement("img");
      media.src = src;
      if (media.tagName === "VIDEO") { media.autoplay = media.loop = media.muted = media.playsInline = true; media.controls = true; }
      box.appendChild(media);
      const close = () => { box.remove(); document.body.classList.remove("no-scroll"); document.removeEventListener("keydown", onKey); };
      const onKey = (e) => { if (e.key === "Escape") close(); };
      box.addEventListener("click", (e) => { if (e.target !== media || media.tagName === "IMG") close(); });
      document.addEventListener("keydown", onKey);
      document.body.classList.add("no-scroll");
      document.body.appendChild(box);
    });
  });

  // Videoer længere nede på siden: hent og afspil først, når de kommer i syne
  const lazyVideos = document.querySelectorAll("video[data-lazy]");
  if (lazyVideos.length) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) {
          if (!v.src && v.dataset.src) v.src = v.dataset.src;
          v.play().catch(() => {});
        } else if (!v.paused) v.pause();
      });
    }, { rootMargin: "200px 0px" });
    lazyVideos.forEach((v) => vio.observe(v));
  }

  // Let parallax på billedstriber
  const bands = document.querySelectorAll(".band__media > *");
  if (bands.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const par = () => bands.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.transform = `translateY(${(-10 + p * -12).toFixed(2)}%)`;
    });
    par();
    window.addEventListener("scroll", par, { passive: true });
  }
})();
