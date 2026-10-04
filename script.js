const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];


const fine =
  matchMedia("(pointer:fine)").matches;

const calm =
  matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


/* ================= PAGE LOADER ================= */

window.addEventListener("load", () => {

  setTimeout(() => {

    $(".page-loader")?.classList.add("done");

  }, calm ? 0 : 650);

});


/* ================= SCROLL UI ================= */

const header =
  $("#siteHeader");

const progress =
  $("#scrollProgress");


function updateScrollUI() {

  const max =
    document.documentElement.scrollHeight -
    innerHeight;


  progress.style.width =
    `${max > 0 ? (scrollY / max) * 100 : 0}%`;


  header.classList.toggle(
    "scrolled",
    scrollY > 24
  );

}


window.addEventListener(
  "scroll",
  updateScrollUI,
  { passive: true }
);


window.addEventListener(
  "resize",
  updateScrollUI
);


updateScrollUI();



/* ================= MOBILE MENU ================= */

const menuBtn =
  $("#menuBtn");

const nav =
  $("#nav");


menuBtn?.addEventListener(
  "click",
  () => {

    const open =
      nav.classList.toggle("open");


    menuBtn.setAttribute(
      "aria-expanded",
      String(open)
    );


    menuBtn.setAttribute(
      "aria-label",
      open
        ? "Close menu"
        : "Open menu"
    );

  }
);


$$(".nav a").forEach(link => {

  link.addEventListener(
    "click",
    () => {

      nav.classList.remove("open");

      menuBtn?.setAttribute(
        "aria-expanded",
        "false"
      );

    }
  );

});



/* ================= THEME ================= */

const themeBtn =
  $("#themeBtn");


function setTheme(theme) {

  document.documentElement.dataset.theme =
    theme;


  localStorage.setItem(
    "ayaan-theme",
    theme
  );


  themeBtn.textContent =
    theme === "dark"
      ? "☾"
      : "☼";


  themeBtn.setAttribute(
    "aria-label",

    theme === "dark"
      ? "Switch to light theme"
      : "Switch to dark theme"
  );

}


setTheme(
  document.documentElement.dataset.theme ||
  "dark"
);


themeBtn?.addEventListener(
  "click",
  () => {

    setTheme(
      document.documentElement.dataset.theme === "dark"
        ? "light"
        : "dark"
    );

  }
);



/* ================= SCROLL REVEAL ================= */

const revealObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "visible"
          );

          revealObserver.unobserve(
            entry.target
          );

        }

      });

    },

    {
      threshold: .12,

      rootMargin:
        "0px 0px -40px"
    }

  );


$$(".reveal").forEach(
  (element, index) => {

    if (
      !element.style.getPropertyValue(
        "--delay"
      )
    ) {

      element.style.setProperty(
        "--delay",
        `${Math.min(index % 5, 4) * .06}s`
      );

    }


    revealObserver.observe(
      element
    );

  }
);



/* ================= ACTIVE NAV ================= */

const sections =
  $$("main section[id]");

const links =
  $$(".nav a");


const sectionObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          links.forEach(link => {

            link.classList.toggle(

              "active",

              link.getAttribute("href") ===
              `#${entry.target.id}`

            );

          });

        }

      });

    },

    {
      rootMargin:
        "-35% 0px -55% 0px"
    }

  );


sections.forEach(
  section =>
    sectionObserver.observe(section)
);



/* ================= MOUSE EFFECTS ================= */

if (fine && !calm) {

  const glow =
    $(".cursor-glow");


  window.addEventListener(
    "pointermove",
    event => {

      glow.style.left =
        `${event.clientX}px`;

      glow.style.top =
        `${event.clientY}px`;

      glow.style.opacity =
        "1";

    },
    {
      passive: true
    }
  );


  window.addEventListener(
    "pointerleave",
    () => {

      glow.style.opacity =
        "0";

    }
  );



  /* SPOTLIGHT */

  $$(".spotlight").forEach(card => {

    card.addEventListener(
      "pointermove",
      event => {

        const rect =
          card.getBoundingClientRect();


        card.style.setProperty(
          "--mx",
          `${event.clientX - rect.left}px`
        );


        card.style.setProperty(
          "--my",
          `${event.clientY - rect.top}px`
        );

      }
    );

  });



  /* 3D TILT */

  $$(".tilt-card").forEach(card => {

    card.addEventListener(
      "pointermove",
      event => {

        const rect =
          card.getBoundingClientRect();


        const x =
          (event.clientX - rect.left) /
          rect.width - .5;


        const y =
          (event.clientY - rect.top) /
          rect.height - .5;


        card.style.transform =
          `perspective(900px)
           rotateY(${x * 7}deg)
           rotateX(${-y * 7}deg)
           translateY(-4px)`;

      }
    );


    card.addEventListener(
      "pointerleave",
      () => {

        card.style.transform = "";

      }
    );

  });



  /* MAGNETIC BUTTONS */

  $$(".magnetic").forEach(button => {

    button.addEventListener(
      "pointermove",
      event => {

        const rect =
          button.getBoundingClientRect();


        const x =
          event.clientX -
          rect.left -
          rect.width / 2;


        const y =
          event.clientY -
          rect.top -
          rect.height / 2;


        button.style.transform =
          `translate(
            ${x * .12}px,
            ${y * .12}px
          )`;

      }
    );


    button.addEventListener(
      "pointerleave",
      () => {

        button.style.transform = "";

      }
    );

  });

}



/* ================= PARTICLE NETWORK ================= */

const canvas =
  $("#particles");

const ctx =
  canvas?.getContext("2d");


if (
  canvas &&
  ctx &&
  !calm
) {

  let particles = [];


  function setupParticles() {

    const dpr =
      Math.min(
        devicePixelRatio || 1,
        2
      );


    canvas.width =
      innerWidth * dpr;


    canvas.height =
      innerHeight * dpr;


    canvas.style.width =
      innerWidth + "px";


    canvas.style.height =
      innerHeight + "px";


    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );


    const count =
      Math.min(
        65,
        Math.floor(innerWidth / 20)
      );


    particles =
      Array.from(
        {
          length: count
        },

        () => ({

          x:
            Math.random() *
            innerWidth,

          y:
            Math.random() *
            innerHeight,

          vx:
            (Math.random() - .5) *
            .22,

          vy:
            (Math.random() - .5) *
            .22,

          r:
            Math.random() *
            1.5 +
            .35

        })

      );

  }



  function drawParticles() {

    ctx.clearRect(
      0,
      0,
      innerWidth,
      innerHeight
    );


    const accent =
      getComputedStyle(
        document.documentElement
      ).getPropertyValue(
        "--accent-2"
      );


    particles.forEach(
      (particle, index) => {

        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;


        if (
          particle.x < 0 ||
          particle.x > innerWidth
        ) {

          particle.vx *= -1;

        }


        if (
          particle.y < 0 ||
          particle.y > innerHeight
        ) {

          particle.vy *= -1;

        }


        ctx.beginPath();


        ctx.arc(
          particle.x,
          particle.y,
          particle.r,
          0,
          Math.PI * 2
        );


        ctx.fillStyle =
          accent.trim() ||
          "#35d8ff";


        ctx.globalAlpha =
          .18;


        ctx.fill();



        for (
          let j = index + 1;
          j < particles.length;
          j++
        ) {

          const other =
            particles[j];


          const dx =
            particle.x -
            other.x;


          const dy =
            particle.y -
            other.y;


          const distance =
            Math.hypot(
              dx,
              dy
            );


          if (distance < 120) {

            ctx.beginPath();

            ctx.moveTo(
              particle.x,
              particle.y
            );

            ctx.lineTo(
              other.x,
              other.y
            );


            ctx.strokeStyle =
              accent.trim() ||
              "#35d8ff";


            ctx.globalAlpha =
              (1 - distance / 120) *
              .045;


            ctx.stroke();

          }

        }

      }
    );


    requestAnimationFrame(
      drawParticles
    );

  }


  setupParticles();


  window.addEventListener(
    "resize",
    setupParticles
  );


  drawParticles();

}



/* ================= CONTACT FORM ================= */

$("#contactForm")?.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const name =
      $("#fName").value.trim();


    const email =
      $("#fEmail").value.trim();


    const message =
      $("#fMsg").value.trim();


    const subject =
      encodeURIComponent(
        `Portfolio project inquiry from ${name}`
      );


    const body =
      encodeURIComponent(
`Hello Ayaan,

Name: ${name}
Email: ${email}

Project details:
${message}

Sent from your portfolio website.`
      );


    location.href =
      `mailto:ayaankhan6765i@gmail.com?subject=${subject}&body=${body}`;

  }
);



/* ================= YEAR ================= */

$("#year").textContent =
  new Date().getFullYear();



/* ================= ESCAPE ================= */

window.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      nav.classList.remove("open");

      menuBtn?.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  }
);