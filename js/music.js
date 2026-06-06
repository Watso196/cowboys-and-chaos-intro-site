(function () {
  const PREF_KEY = 'cac_music';

  // Resolve audio path relative to whichever page loaded first
  const pathPrefix = window.location.pathname.includes('/locations/') ? '../' : '';

  const audio = new Audio();
  audio.src = pathPrefix + 'audio/background.mp3';
  audio.loop = true;
  audio.volume = 1;

  let isPlaying = false;
  let duckTimer = null;

  // ── Playback ────────────────────────────────────────────────
  function start() {
    audio.muted = false;
    audio.play().catch(() => {});
    isPlaying = true;
    updateBtn();
  }

  function duck() {
    if (!isPlaying) return;
    clearInterval(duckTimer);
    duckTimer = setInterval(() => {
      if (audio.volume > 0.38) audio.volume = Math.max(0.38, audio.volume - 0.04);
      else clearInterval(duckTimer);
    }, 30);
  }

  function unduck() {
    if (!isPlaying) return;
    clearInterval(duckTimer);
    duckTimer = setInterval(() => {
      if (audio.volume < 1) audio.volume = Math.min(1, audio.volume + 0.04);
      else clearInterval(duckTimer);
    }, 30);
  }

  function toggleMute() {
    if (!isPlaying) {
      localStorage.setItem(PREF_KEY, 'on');
      start();
    } else {
      audio.muted = !audio.muted;
      localStorage.setItem(PREF_KEY, audio.muted ? 'off' : 'on');
    }
    updateBtn();
  }

  // ── Toggle Button ────────────────────────────────────────────
  let btn;

  function updateBtn() {
    if (!btn) return;
    const off = !isPlaying || audio.muted;
    btn.classList.toggle('muted', off);
    btn.setAttribute('aria-label', off ? 'Enable background music' : 'Mute background music');
    btn.title = off ? 'Enable music' : 'Mute music';
  }

  function createBtn() {
    btn = document.createElement('button');
    btn.id = 'music-toggle';
    btn.innerHTML = '&#9834;';
    btn.classList.add('muted');
    btn.setAttribute('aria-label', 'Enable background music');
    btn.title = 'Enable music';
    btn.addEventListener('click', toggleMute);
    document.body.appendChild(btn);
  }

  // ── Music Modal ──────────────────────────────────────────────
  function dispatchReady() {
    document.dispatchEvent(new Event('covaya:ready'));
  }

  function showModal() {
    const overlay = document.createElement('div');
    overlay.id = 'music-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'music-modal-title');
    overlay.innerHTML = [
      '<div class="music-modal-box">',
      '  <p class="music-modal-title" id="music-modal-title">The frontier awaits.</p>',
      '  <p class="music-modal-sub">Would you like music while you explore Covaya?</p>',
      '  <div class="music-modal-btns">',
      '    <button class="music-modal-yes">Play Music</button>',
      '    <button class="music-modal-no">Explore in Silence</button>',
      '  </div>',
      '</div>',
    ].join('');

    function dismiss(withMusic) {
      localStorage.setItem(PREF_KEY, withMusic ? 'on' : 'off');
      overlay.classList.add('dismissed');
      if (withMusic) start();
      setTimeout(() => {
        overlay.remove();
        dispatchReady();
      }, 400);
    }

    overlay.querySelector('.music-modal-yes').addEventListener('click', () => dismiss(true));
    overlay.querySelector('.music-modal-no').addEventListener('click', () => dismiss(false));
    document.body.appendChild(overlay);
    overlay.querySelector('.music-modal-yes').focus();
  }

  // ── Init ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    createBtn();

    const pref = localStorage.getItem(PREF_KEY);
    const path = window.location.pathname;
    const isIndex = path === '/' || path.endsWith('/') || path.endsWith('index.html');

    if (pref === 'on') {
      start();
      dispatchReady();
    } else if (pref === 'off') {
      updateBtn();
      dispatchReady();
    } else if (isIndex) {
      showModal(); // waits for user interaction before dispatching ready
    } else {
      dispatchReady(); // non-index, first visit — no modal
    }
  });

  window.musicPlayer = { start, duck, unduck, toggleMute };
})();
