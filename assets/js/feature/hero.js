/* Homepage hero slider — see layouts/partials/heroslider.html.
   No dependencies. Slide timing is driven by the CSS progress bar: when the
   current bar's fill animation ends, we move on (so hover / off-screen pauses
   are just animation-play-state). */
(function () {
  'use strict';
  var root = document.getElementById('bb-hero');
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll('.bbh-slide'));
  var bars = Array.prototype.slice.call(root.querySelectorAll('.bbh-bar'));
  var count = root.querySelector('.bbh-count b');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  var cur = 0;
  var leaveTimer = null;

  /* ---------- lazy images (everything except slide 1) ---------- */
  function hydrate(el) {
    var imgs = el.querySelectorAll('img[data-src]');
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i];
      if (im.dataset.srcset) { im.srcset = im.dataset.srcset; im.removeAttribute('data-srcset'); }
      im.src = im.dataset.src; im.removeAttribute('data-src');
    }
  }
  function hydrateAll() { slides.forEach(hydrate); }
  if (document.readyState === 'complete') idle(hydrateAll);
  else window.addEventListener('load', function () { idle(hydrateAll); });
  function idle(fn) { (window.requestIdleCallback || function (f) { setTimeout(f, 200); })(fn); }

  /* ---------- headline decode (slide 1) ---------- */
  var pool = 'ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی۰۱۲۳۴۵۶۷۸۹';
  function scramble(slide) {
    var lines = slide.querySelectorAll('[data-scramble]');
    if (!lines.length || reduce) return;
    var tick = 0;
    var t = setInterval(function () {
      tick++;
      for (var i = 0; i < lines.length; i++) {
        var word = lines[i].dataset.scramble, at = +lines[i].dataset.at;
        var out;
        if (tick >= at) out = word;
        else if (tick < at - 14) out = ' ';
        else out = Array.from(word).map(function (c) { return (c === ' ' || c === '‌') ? c : pool[Math.floor(Math.random() * pool.length)]; }).join('');
        lines[i].textContent = out;
      }
      if (tick > 40 || !slide.classList.contains('is-active')) {
        clearInterval(t);
        for (var j = 0; j < lines.length; j++) lines[j].textContent = lines[j].dataset.scramble;
      }
    }, 45);
  }

  /* ---------- slide switching ---------- */
  function go(n) {
    n = (n + slides.length) % slides.length;
    if (n === cur) return;
    var prev = slides[cur], next = slides[n];
    hydrate(next);
    clearTimeout(leaveTimer);
    slides.forEach(function (s) { s.classList.remove('is-leaving'); });
    prev.classList.remove('is-active');
    prev.classList.add('is-leaving');
    prev.setAttribute('aria-hidden', 'true');
    leaveTimer = setTimeout(function () { prev.classList.remove('is-leaving'); }, 950);
    next.classList.add('is-active');
    next.removeAttribute('aria-hidden');
    bars.forEach(function (b, i) {
      b.classList.remove('is-current');
      b.classList.toggle('is-done', i < n);
    });
    void bars[n].offsetWidth; /* restart the fill animation */
    bars[n].classList.add('is-current');
    if (count) count.textContent = ('0' + (n + 1)).slice(-2);
    cur = n;
    onEnter(next);
  }
  bars.forEach(function (b, i) {
    b.addEventListener('click', function () { go(i); });
    b.querySelector('i').addEventListener('animationend', function () { if (b.classList.contains('is-current')) go(cur + 1); });
  });

  /* pause on mouse hover, and whenever the hero is off screen */
  root.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') root.classList.add('is-paused'); });
  root.addEventListener('pointerleave', function () { root.classList.remove('is-paused'); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      root.classList.toggle('is-paused-view', !es[0].isIntersecting);
    }).observe(root);
  }

  /* swipe & keyboard (RTL: swiping to the right goes forward) */
  var sx = null, sy = null;
  root.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx > 0 ? 1 : -1));
    sx = null;
  }, { passive: true });
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') go(cur + 1);
    else if (e.key === 'ArrowRight') go(cur - 1);
  });

  /* ---------- per-slide behaviour ---------- */
  var shelfTimer = null;
  function onEnter(slide) {
    if (slide.classList.contains('bbh-move')) scramble(slide);
    clearInterval(shelfTimer);
    if (slide.classList.contains('bbh-shelf')) startShelf(slide);
  }

  /* slide 2: the mouse takes over the light, with a little parallax */
  slides.forEach(function (slide) {
    if (!slide.classList.contains('bbh-cover') || !finePointer) return;
    var raf = 0, ev = null;
    slide.addEventListener('pointermove', function (e) {
      ev = e;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var r = slide.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
        slide.style.setProperty('--mx', (x * 100).toFixed(2) + '%');
        slide.style.setProperty('--my', (y * 100).toFixed(2) + '%');
        slide.style.setProperty('--px', (x - 0.5).toFixed(3));
        slide.style.setProperty('--py', (y - 0.5).toFixed(3));
        slide.classList.add('is-torch');
      });
    });
    slide.addEventListener('pointerleave', function () {
      slide.classList.remove('is-torch');
      slide.style.setProperty('--px', 0);
      slide.style.setProperty('--py', 0);
    });
  });

  /* slide 3: two magazines that swap, open on click, tilt with the mouse */
  function startShelf(slide) {
    shelfTimer = setInterval(function () {
      var w = slide.querySelector('.sh-wrap');
      if (root.classList.contains('is-paused') || w.classList.contains('is-open')) return;
      shelfShow(slide, (+w.dataset.cur || 0) + 1);
    }, 4500);
  }
  function shelfShow(slide, k) {
    var w = slide.querySelector('.sh-wrap');
    var cards = slide.querySelectorAll('.sh-card');
    var n = cards.length;
    k = ((k % n) + n) % n;
    w.dataset.cur = k;
    w.classList.remove('is-open');
    for (var i = 0; i < n; i++) cards[i].dataset.pos = (i - k + n) % n;
    var c = cards[k];
    w.style.setProperty('--acc', c.dataset.color);
    w.style.setProperty('--ink', c.dataset.ink);
    ['.sh-bg', '.sh-cta', '.sh-thumb'].forEach(function (sel) {
      var els = slide.querySelectorAll(sel);
      for (var j = 0; j < els.length; j++) els[j].classList.toggle('is-on', +els[j].dataset.k === k);
    });
  }
  slides.forEach(function (slide) {
    if (!slide.classList.contains('bbh-shelf')) return;
    var w = slide.querySelector('.sh-wrap');
    slide.querySelectorAll('.sh-card').forEach(function (card) {
      card.addEventListener('click', function () {
        if (card.dataset.pos === '0') w.classList.toggle('is-open');
        else shelfShow(slide, +card.dataset.k);
      });
    });
    slide.querySelectorAll('.sh-thumb').forEach(function (t) {
      t.addEventListener('click', function () { shelfShow(slide, +t.dataset.k); });
    });
    var stage = slide.querySelector('.sh-stage'), rig = slide.querySelector('.sh-rig');
    if (finePointer && stage && rig) {
      stage.addEventListener('pointermove', function (e) {
        var r = stage.getBoundingClientRect();
        rig.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 16).toFixed(2) + 'deg');
        rig.style.setProperty('--rx', (-((e.clientY - r.top) / r.height - 0.5) * 10).toFixed(2) + 'deg');
      });
      stage.addEventListener('pointerleave', function () {
        rig.style.setProperty('--ry', '0deg');
        rig.style.setProperty('--rx', '0deg');
      });
    }
  });

  onEnter(slides[0]);
})();
