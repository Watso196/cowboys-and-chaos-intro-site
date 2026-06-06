(function () {
  const PREF_KEY = 'cac_music';

  // Resolve audio path relative to whichever page loaded first
  const pathPrefix = window.location.pathname.includes('/locations/') ? '../' : '';

  const audio = new Audio();
  audio.src = pathPrefix + 'assets/ambience-music.mp3';
  audio.loop = true;
  audio.volume = 0.3;

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
      if (audio.volume > 0.12) audio.volume = Math.max(0.9, audio.volume - 0.04);
      else clearInterval(duckTimer);
    }, 30);
  }

  function unduck() {
    if (!isPlaying) return;
    clearInterval(duckTimer);
    duckTimer = setInterval(() => {
      if (audio.volume < 0.3) audio.volume = Math.min(0.3, audio.volume + 0.04);
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
  const SVG_ON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.4 1.8C11.5532 0.262376 14 1.07799 14 3.00001V21.1214C14 23.0539 11.5313 23.8627 10.3878 22.3049L6.49356 17H4C2.34315 17 1 15.6569 1 14V10C1 8.34315 2.34315 7 4 7H6.5L10.4 1.8ZM12 3L8.1 8.2C7.72229 8.70361 7.12951 9 6.5 9H4C3.44772 9 3 9.44772 3 10V14C3 14.5523 3.44772 15 4 15H6.49356C7.13031 15 7.72901 15.3032 8.10581 15.8165L12 21.1214V3Z" fill="currentColor"/><path d="M16.2137 4.17445C16.1094 3.56451 16.5773 3 17.1961 3C17.6635 3 18.0648 3.328 18.1464 3.78824C18.4242 5.35347 19 8.96465 19 12C19 15.0353 18.4242 18.6465 18.1464 20.2118C18.0648 20.672 17.6635 21 17.1961 21C16.5773 21 16.1094 20.4355 16.2137 19.8256C16.5074 18.1073 17 14.8074 17 12C17 9.19264 16.5074 5.8927 16.2137 4.17445Z" fill="currentColor"/><path d="M21.41 5C20.7346 5 20.2402 5.69397 20.3966 6.35098C20.6758 7.52413 21 9.4379 21 12C21 14.5621 20.6758 16.4759 20.3966 17.649C20.2402 18.306 20.7346 19 21.41 19C21.7716 19 22.0974 18.7944 22.2101 18.4509C22.5034 17.5569 23 15.5233 23 12C23 8.47672 22.5034 6.44306 22.2101 5.54913C22.0974 5.20556 21.7716 5 21.41 5Z" fill="currentColor"/></svg>';
  const SVG_OFF = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 3.00001C14 1.07799 11.5532 0.262376 10.4 1.8L6.5 7H4C2.34315 7 1 8.34315 1 10V14C1 15.6569 2.34315 17 4 17H6.49356L10.3878 22.3049C11.5313 23.8627 14 23.0539 14 21.1214V3.00001ZM8.1 8.2L12 3V21.1214L8.10581 15.8165C7.72901 15.3032 7.13031 15 6.49356 15H4C3.44772 15 3 14.5523 3 14V10C3 9.44772 3.44772 9 4 9H6.5C7.12951 9 7.72229 8.70361 8.1 8.2Z" fill="currentColor"/><path d="M21.2929 8.57094C21.6834 8.18041 22.3166 8.18042 22.7071 8.57094C23.0976 8.96146 23.0976 9.59463 22.7071 9.98515L20.7603 11.9319L22.7071 13.8787C23.0976 14.2692 23.0976 14.9024 22.7071 15.2929C22.3166 15.6834 21.6834 15.6834 21.2929 15.2929L19.3461 13.3461L17.3994 15.2929C17.0088 15.6834 16.3757 15.6834 15.9852 15.2929C15.5946 14.9023 15.5946 14.2692 15.9852 13.8787L17.9319 11.9319L15.9852 9.98517C15.5946 9.59464 15.5946 8.96148 15.9852 8.57096C16.3757 8.18043 17.0088 8.18043 17.3994 8.57096L19.3461 10.5177L21.2929 8.57094Z" fill="currentColor"/></svg>';

  let btn;

  function updateBtn() {
    if (!btn) return;
    const off = !isPlaying || audio.muted;
    btn.innerHTML = off ? SVG_OFF : SVG_ON;
    btn.classList.toggle('muted', off);
    btn.setAttribute('aria-label', off ? 'Enable background music' : 'Mute background music');
    btn.title = off ? 'Enable music' : 'Mute music';
  }

  function createBtn() {
    btn = document.createElement('button');
    btn.id = 'music-toggle';
    btn.setAttribute('aria-label', 'Enable background music');
    btn.title = 'Enable music';
    btn.addEventListener('click', toggleMute);
    const nav = document.querySelector('.site-nav');
    if (nav) nav.appendChild(btn);
    else document.body.appendChild(btn);
    updateBtn();
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
      audio.muted = false;
      audio.play().then(() => {
        isPlaying = true;
        updateBtn();
      }).catch(() => {
        // Autoplay blocked — resume on first user gesture
        const onInteract = () => {
          audio.play().then(() => {
            isPlaying = true;
            updateBtn();
          }).catch(() => {});
          document.removeEventListener('pointerdown', onInteract);
          document.removeEventListener('keydown', onInteract);
        };
        document.addEventListener('pointerdown', onInteract);
        document.addEventListener('keydown', onInteract);
      });
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
