/* Зерно конфликта — zernogame.ru. Ванильный JS, без зависимостей. */
(function () {
  'use strict';

  // Яндекс.Метрика: впишите номер счётчика, когда он появится (см. README). Пока null — события никуда не уходят.
  var YM_ID = null;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function track(goal) {
    try { if (YM_ID && window.ym) { window.ym(YM_ID, 'reachGoal', goal); } } catch (e) {}
    try { document.dispatchEvent(new CustomEvent('zerno:goal', { detail: goal })); } catch (e) {}
  }

  // 1. Цели по клику на ссылки
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-goal]') : null;
    if (a) { track(a.getAttribute('data-goal')); }
  });

  // 2. Появление блоков по скроллу
  var revealEls = [].slice.call(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  // 3. Разворот карт на 180° (как «перевёрнутое значение» в игре)
  var flipped = {};
  function flip(card) {
    var on = !card.classList.contains('is-flipped');
    card.classList.toggle('is-flipped', on);
    card.setAttribute('aria-pressed', on ? 'true' : 'false');
    var id = card.getAttribute('data-id');
    if (id && !flipped[id]) { flipped[id] = true; track('card_flip'); }
  }
  document.addEventListener('click', function (e) {
    var card = e.target.closest ? e.target.closest('.card') : null;
    if (card) { flip(card); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') { return; }
    var card = e.target.classList && e.target.classList.contains('card') ? e.target : null;
    if (card) { e.preventDefault(); flip(card); }
  });

  // 4. Фильтры галереи
  var chips = [].slice.call(document.querySelectorAll('.chip'));
  var items = [].slice.call(document.querySelectorAll('.g-item'));
  var count = document.getElementById('gallery-count');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      var shown = 0;
      items.forEach(function (it) {
        var ok = f === 'all' || it.getAttribute('data-cat') === f;
        it.hidden = !ok;
        if (ok) { shown++; }
      });
      if (count) { count.textContent = 'Показано карт: ' + shown; }
      var g = document.getElementById('gallery');
      if (g) { g.scrollLeft = 0; }
    });
  });

  // 5. Лёгкий параллакс веера в Hero (только если нет reduced-motion и есть указатель)
  var hero = document.getElementById('top');
  if (hero && !reduce && window.matchMedia && window.matchMedia('(hover:hover)').matches) {
    var raf = 0, tx = 0, ty = 0;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) {
        raf = requestAnimationFrame(function () {
          hero.style.setProperty('--px', tx.toFixed(3));
          hero.style.setProperty('--py', ty.toFixed(3));
          raf = 0;
        });
      }
    });
  }

  // 6. Плашка для тех, кто пришёл по QR с колоды (?src=deck)
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get('src') === 'deck') {
      var plate = document.getElementById('qr-plate');
      if (plate) { plate.hidden = false; }
      track('qr_scan');
    }
  } catch (e) {}

  // 7. Липкая панель на мобильном: после первого экрана и пока не виден финальный CTA
  var dock = document.getElementById('dock');
  var cta = document.getElementById('cta');
  if (dock && hero && 'IntersectionObserver' in window) {
    var heroOut = false, ctaIn = false;
    function upd() { dock.classList.toggle('is-on', heroOut && !ctaIn); }
    new IntersectionObserver(function (en) { heroOut = !en[0].isIntersecting; upd(); }, { threshold: 0.05 }).observe(hero);
    if (cta) { new IntersectionObserver(function (en) { ctaIn = en[0].isIntersecting; upd(); }, { threshold: 0.2 }).observe(cta); }
  }

  // 8. Событие «дошёл до галереи»
  var gal = document.getElementById('cards');
  if (gal && 'IntersectionObserver' in window) {
    var gio = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { track('gallery_view'); gio.disconnect(); }
    }, { threshold: 0.25 });
    gio.observe(gal);
  }
})();
