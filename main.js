/* ============================================================
   COVAYA CAMPAIGN SITE — SHARED JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile Nav Toggle ──────────────────────────────────────
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Active Nav Link ────────────────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // ── Audio Players ──────────────────────────────────────────
  let currentAudio = null;
  let currentBtn = null;

  document.querySelectorAll('.audio-player').forEach(btn => {
    const src = btn.dataset.src;
    if (!src) return;

    const audio = new Audio(src);
    const label = btn.querySelector('.audio-label');
    const originalLabel = label ? label.textContent : 'Play Narration';

    audio.addEventListener('ended', () => {
      btn.classList.remove('playing');
      if (label) label.textContent = originalLabel;
      currentAudio = null;
      currentBtn = null;
    });

    btn.addEventListener('click', () => {
      // Stop any currently playing audio
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
      } else {
        audio.play().catch(() => {
          // Audio file not yet linked — show placeholder message
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

});
