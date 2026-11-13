/* Homepage team section — see layouts/partials/teamcredits.html.
   The spotlight visits each person in turn; hover or keyboard focus moves it there and holds it.
   It only runs while the section is on screen, and not at all with reduced motion. */
(function () {
  'use strict';
  var root = document.getElementById('bb-team');
  if (!root) return;
  var people = Array.prototype.slice.call(root.querySelectorAll('.bbt-p'));
  if (!people.length) return;
  var row = root.querySelector('.bbt-row');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 0, timer = null, held = false, visible = false;

  function light(i, scroll) {
    people[cur].classList.remove('is-on');
    cur = i;
    people[cur].classList.add('is-on');
    /* on a scrolling row, keep the lit person in view (without moving the page) */
    if (scroll && row.scrollWidth > row.clientWidth + 2) {
      var p = people[cur], r = row.getBoundingClientRect(), b = p.getBoundingClientRect();
      if (b.left < r.left || b.right > r.right) row.scrollBy({ left: (b.left + b.width / 2) - (r.left + r.width / 2), behavior: 'smooth' });
    }
  }
  function tick() { if (!held && visible) light((cur + 1) % people.length, true); }
  function start() { if (!reduce && !timer) timer = setInterval(tick, 2600); }
  function stop() { clearInterval(timer); timer = null; }

  people.forEach(function (p, i) {
    var link = p.querySelector('.bbt-link');
    p.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { held = true; light(i); } });
    p.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') held = false; });
    link.addEventListener('focus', function () { held = true; light(i); });
    link.addEventListener('blur', function () { held = false; });
  });
  /* a finger scrolling the row takes over until it lets go */
  row.addEventListener('touchstart', function () { held = true; }, { passive: true });
  row.addEventListener('touchend', function () { setTimeout(function () { held = false; }, 4000); }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0.3 }).observe(root);
  } else { visible = true; start(); }
})();
