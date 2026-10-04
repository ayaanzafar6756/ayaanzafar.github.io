const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const fine = matchMedia("(pointer:fine)").matches;
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ================= FOOTER YEAR ================= */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ================= SCROLL REVEAL ================= */
let revealStarted = false;
function startReveal() {
  if (revealStarted) return;
  revealStarted = true;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");
      setTimeout(() => el.classList.add("done"), 1200);
      io.unobserve(el);
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach((el) => io.observe(el));
}

/* ================= PAGE LOADER ================= */
const loader = $(".page-loader");
function hideLoader() {
  loader?.classList.add("done");
  startReveal();
}
addEventListener("load", () => setTimeout(hideLoader, 700));
setTimeout(hideLoader, 2500); // failsafe

/* ================= HEADER + SCROLL PROGRESS ================= */
const header   = $("#siteHeader");
const progress = $("#scrollProgress");
let ticking = false;

function updateScrollUI() {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  header?.classList.toggle("scrolled", scrollY > 20);
  ticking = false;
}
addEventListener("scroll", () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateScrollUI);
  }
}, { passive: true });
addEventListener("resize", updateScrollUI);
updateScrollUI();

/* ================= MOBILE MENU ================= */
const menuBtn = $("#menuBtn");
const nav     = $("#nav");

function closeMenu() {
  nav?.classList.remove("open");
  menuBtn?.setAttribute("aria-expanded", "false");
}
menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
$$(".nav a").forEach((a) => a.addEventListener("click", closeMenu));
addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

/* ================= THEME ================= */
const themeBtn = $("#themeBtn");

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeBtn) themeBtn.textContent = theme === "light" ? "☾" : "☼";
  try { localStorage.setItem("ayaan-theme", theme); } catch {}
}
setTheme(document.documentElement.dataset.theme || "dark");

themeBtn?.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

/* ================= CURSOR GLOW ================= */
const glow = $(".cursor-glow");
if (fine && glow) {
  addEventListener("pointermove", (e) => {
    glow.classList.add("on");
    glow.style.left = `${e.clientX}px`;
    glow.style.top  = `${e.clientY}px`;
  }, { passive: true });
}

/* ================= 3D TILT (portrait card) ================= */
if (fine && !calm) {
  $$(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateY(${x * 6}deg) rotateX(${y * -6}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => (card.style.transform = ""));
  });
}

/* ================= SPOTLIGHT ================= */
if (fine) {
  $$(".spotlight").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

/* ================= MAGNETIC BUTTONS ================= */
if (fine && !calm) {
  $$(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.28;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });
}

/* ================= PARTICLES (desktop only) ================= */
const canvas = $("#particles");
if (canvas && !calm ) {
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, raf = 0;

  const resize = () => {
    const d = Math.min(devicePixelRatio || 1, 1.5);
    w = innerWidth; h = innerHeight;
    canvas.width = w * d; canvas.height = h * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  resize();
  addEventListener("resize", resize);

  const particleCount = innerWidth < 600 ? 20 : 42;

const dots = Array.from({ length: particleCount }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25
  }));

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < dots.length; i++) {
      const a = dots[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;

      ctx.fillStyle = "rgba(124,108,255,.8)";
      ctx.beginPath(); ctx.arc(a.x, a.y, 1.4, 0, 6.283); ctx.fill();

      for (let j = i + 1; j < dots.length; j++) {
        const b = dots[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = dx * dx + dy * dy;
        if (d < 14400) {
          ctx.strokeStyle = `rgba(53,216,255,${0.14 * (1 - d / 14400)})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  };
  draw();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else draw();
  });
}

/* ================= CONTACT FORM (opens email app) ================= */
$("#contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name    = $("#fName").value.trim();
  const email   = $("#fEmail").value.trim();
  const message = $("#fMsg").value.trim();

  const subject = encodeURIComponent(`Project enquiry from ${name}`);
  const body = encodeURIComponent(
`Hello Ayaan,

My name is ${name}.
My email is ${email}.

Project details:
${message}

Thank you.`
  );

  window.location.href =
    `mailto:ayaankhan6765i@gmail.com?subject=${subject}&body=${body}`;
});

/* ================= ACTIVE NAV LINK ================= */
const navLinks = $$(".nav a");

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) =>
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
    );
  });
}, { rootMargin: "-35% 0px -55% 0px" });

$$("main section[id]").forEach((s) => activeObserver.observe(s));

/* tells the failsafe in index.html that everything loaded fine */
window.__ready = true;