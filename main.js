/* ============================================================
   COVAYA CAMPAIGN SITE — SHARED JAVASCRIPT
   ============================================================ */

// ── Narration State ────────────────────────────────────────
let currentAudio = null;
let currentBtn = null;

// ── Audio Players ──────────────────────────────────────────
// Called on initial load and after every SPA page swap.
function initAudioPlayers() {
  document.querySelectorAll('.audio-player').forEach(btn => {
    if (btn.dataset.spaInit) return;
    btn.dataset.spaInit = '1';

    const src = btn.dataset.src;
    if (!src) return;

    const audio = new Audio(src);
    const label = btn.querySelector('.audio-label');
    const originalLabel = label ? label.textContent : 'Play Narration';

    audio.addEventListener('ended', () => {
      btn.classList.remove('playing');
      if (label) label.textContent = originalLabel;
      if (currentAudio === audio) { currentAudio = null; currentBtn = null; }
      window.musicPlayer?.unduck();
    });

    btn.addEventListener('click', () => {
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        if (currentBtn) {
          currentBtn.classList.remove('playing');
          const prevLabel = currentBtn.querySelector('.audio-label');
          if (prevLabel) prevLabel.textContent = currentBtn.dataset.originalLabel || 'Play Narration';
        }
      }

      if (btn.classList.contains('playing')) {
        audio.pause();
        btn.classList.remove('playing');
        if (label) label.textContent = originalLabel;
        currentAudio = null;
        currentBtn = null;
        window.musicPlayer?.unduck();
      } else {
        window.musicPlayer?.duck();
        audio.play().catch(() => {
          window.musicPlayer?.unduck();
          if (label) {
            label.textContent = 'Audio not yet loaded';
            setTimeout(() => { label.textContent = originalLabel; }, 2000);
          }
        });
        btn.classList.add('playing');
        if (label) label.textContent = 'Pause';
        currentAudio = audio;
        currentBtn = btn;
        btn.dataset.originalLabel = originalLabel;
      }
    });
  });
}

// ── SPA Navigation ─────────────────────────────────────────
function resolveRelativePaths(container, baseUrl) {
  ['src', 'data-src'].forEach(attr => {
    container.querySelectorAll('[' + attr + ']').forEach(el => {
      const val = el.getAttribute(attr);
      if (!val || /^(https?:|\/\/|data:|#)/.test(val)) return;
      try { el.setAttribute(attr, new URL(val, baseUrl).href); } catch (e) {}
    });
  });
}

function updateActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();
    const isActive = linkPath === currentPath;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function navigate(url, pushState) {
  if (pushState === undefined) pushState = true;
  const target = new URL(url, window.location.href);
  if (target.origin !== window.location.origin) return;

  // Close mobile nav if open
  const navEl = document.querySelector('.nav-links');
  const toggleEl = document.querySelector('.nav-toggle');
  if (navEl) navEl.classList.remove('open');
  if (toggleEl) toggleEl.setAttribute('aria-expanded', 'false');

  // Stop any playing narration before swapping content
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    if (currentBtn) currentBtn.classList.remove('playing');
    currentAudio = null;
    currentBtn = null;
    window.musicPlayer?.unduck();
  }

  window.cancelStarAnimation?.();

  fetch(target.href)
    .then(function (r) { if (!r.ok) throw new Error(); return r.text(); })
    .then(function (html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const newMain = doc.querySelector('main');
      if (!newMain) return;

      resolveRelativePaths(newMain, target.href);
      document.querySelector('main').innerHTML = newMain.innerHTML;
      document.title = doc.title;

      if (pushState) history.pushState(null, '', target.href);

      window.scrollTo(0, 0);
      updateActiveNavLink();
      initAudioPlayers();

      if (document.getElementById('star-canvas')) {
        window.initStarAnimation?.();
      }
    })
    .catch(function () { window.location.href = url; });
}

// ── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

  // ── Mobile Nav Toggle ────────────────────────────────────
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Active Nav Link ──────────────────────────────────────
  updateActiveNavLink();

  // ── Audio Players ────────────────────────────────────────
  initAudioPlayers();

  // ── SPA Link Interception ────────────────────────────────
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || /^(https?:|\/\/|#|mailto:|tel:)/.test(href)) return;
    if (a.hasAttribute('download') || a.target === '_blank') return;
    let target;
    try { target = new URL(a.href, window.location.href); } catch (e) { return; }
    if (target.origin !== window.location.origin) return;
    e.preventDefault();
    navigate(a.href);
  });

  window.addEventListener('popstate', function () {
    navigate(window.location.href, false);
  });

});
