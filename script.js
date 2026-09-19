/* =========================================================
   Ayaan Khan portfolio - JavaScript
   ========================================================= */
(function () {

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ---------- 1. Light / dark theme toggle ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById('themeBtn');

  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';

  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function paintThemeIcon() {
    themeBtn.innerHTML = currentTheme() === 'dark' ? SUN : MOON;
  }

  themeBtn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ayaan-theme', next); } catch (e) {}
    paintThemeIcon();
  });
  paintThemeIcon();


  /* ---------- 2. Mobile menu ---------- */
  var header = document.getElementById('siteHeader');
  var menuBtn = document.getElementById('menuBtn');

  function setMenu(open) {
    if (open) header.setAttribute('data-open', '');
    else header.removeAttribute('data-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  }

  menuBtn.addEventListener('click', function () {
    setMenu(!header.hasAttribute('data-open'));
  });

  document.querySelectorAll('#navLinks a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });


  /* ---------- 3. Name "decrypt" animation ---------- */
  var nameEl = document.getElementById('name');
  var finalText = nameEl.getAttribute('data-final');
  nameEl.setAttribute('aria-label', finalText);

  if (!reduceMotion) {
    var pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%@*+=?';
    var frame = 0;
    var lastReveal = 4 + finalText.length * 3;

    setTimeout(function () {
      var timer = setInterval(function () {
        var out = '';
        for (var i = 0; i < finalText.length; i++) {
          var ch = finalText.charAt(i);
          if (ch === ' ' || frame >= 4 + i * 3) {
            out += ch;
          } else {
            out += '<span class="cipher">' + pool.charAt(Math.floor(Math.random() * pool.length)) + '</span>';
          }
        }
        nameEl.innerHTML = out;
        frame++;
        if (frame > lastReveal) {
          clearInterval(timer);
          nameEl.textContent = finalText;
        }
      }, 45);
    }, 350);
  }


  /* ---------- 4. Typing line: "I build ..." ---------- */
  var typedEl = document.getElementById('typed');
  var words = ['responsive websites', 'AI chatbots', 'AI agents', 'security-minded web apps'];

  if (typedEl && !reduceMotion) {
    var w = 0, c = 0, deleting = false;

    function tick() {
      var word = words[w];
      if (!deleting) {
        c++;
        typedEl.textContent = word.slice(0, c);
        if (c === word.length) {
          deleting = true;
          return setTimeout(tick, 1800);      // pause on the finished word
        }
        return setTimeout(tick, 70);
      }
      c--;
      typedEl.textContent = word.slice(0, c);
      if (c === 0) {
        deleting = false;
        w = (w + 1) % words.length;
        return setTimeout(tick, 350);
      }
      setTimeout(tick, 35);
    }

    typedEl.textContent = '';
    setTimeout(tick, 1400);                   // start after the hero has settled
  }


  /* ---------- 5. 3D tilt on the portrait (mouse devices only) ---------- */
  var portrait = document.getElementById('portrait');
  var tilt = document.getElementById('tilt');
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (portrait && tilt && canHover && !reduceMotion) {
    portrait.addEventListener('pointermove', function (e) {
      var r = tilt.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.setProperty('--ry', (x * 12).toFixed(2) + 'deg');
      tilt.style.setProperty('--rx', (-y * 12).toFixed(2) + 'deg');
    });
    portrait.addEventListener('pointerleave', function () {
      tilt.style.setProperty('--rx', '0deg');
      tilt.style.setProperty('--ry', '0deg');
    });
  }


  /* ---------- 6. Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  // Give each skill chip its own delay so they pop in one by one
  document.querySelectorAll('.chips').forEach(function (list) {
    list.querySelectorAll('li').forEach(function (li, i) { li.style.setProperty('--k', i); });
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }


  /* ---------- 7. Active menu link while scrolling ---------- */
  var navLinks = document.querySelectorAll('#navLinks a');
  var sections = ['about', 'education', 'skills', 'services', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }


  /* ---------- 8. Scroll progress bar + timeline line ---------- */
  var timeline = document.getElementById('timeline');
  var ticking = false;

  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var sp = max > 0 ? window.scrollY / max : 0;
    header.style.setProperty('--sp', Math.min(1, Math.max(0, sp)).toFixed(4));

    if (timeline) {
      var r = timeline.getBoundingClientRect();
      var p = (window.innerHeight * 0.7 - r.top) / r.height;
      timeline.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(3));
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  if (reduceMotion && timeline) timeline.style.setProperty('--p', 1);
  else onScroll();


  /* ---------- 9. Contact box: builds the email from the fields ---------- */
  var fName = document.getElementById('fName');
  var fEmail = document.getElementById('fEmail');
  var fMsg = document.getElementById('fMsg');
  var sendBtn = document.getElementById('sendBtn');

  function updateMailto() {
    var name = fName.value.trim();
    var subject = 'Project enquiry' + (name ? ' from ' + name : '');
    var body = fMsg.value.trim();
    var tail = [];
    if (name) tail.push('Name: ' + name);
    if (fEmail.value.trim()) tail.push('Reply to: ' + fEmail.value.trim());
    if (tail.length) body += (body ? '\n\n' : '') + tail.join('\n');

    sendBtn.href = 'mailto:ayaankhan6765i@gmail.com'
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
  }

  [fName, fEmail, fMsg].forEach(function (el) {
    el.addEventListener('input', updateMailto);
  });

})();