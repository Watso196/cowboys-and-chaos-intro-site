const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');

let stars = [];
let animFrame;
let goingOut = false;
let goingOutTimer = null;

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function randomStar() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.7,
    r: Math.random() * 1.5 + 0.3,
    alpha: Math.random() * 0.5 + 0.5,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinkleDir: Math.random() > 0.5 ? 1 : -1,
    dying: false,
    fadeSpeed: 0,
  };
}

function initStars(count = 280) {
  stars = Array.from({ length: count }, randomStar);
}

function killStars() {
  const order = stars.map((_, i) => i).sort(() => Math.random() - 0.5);
  const spread = 6000;
  order.forEach((idx, i) => {
    setTimeout(() => {
      stars[idx].dying = true;
      stars[idx].fadeSpeed = Math.random() * 0.035 + 0.02;
    }, (i / order.length) * spread + Math.random() * 120);
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.7);
  sky.addColorStop(0, '#02000a');
  sky.addColorStop(0.6, '#08051a');
  sky.addColorStop(1, '#130a04');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let anyVisible = false;
  stars.forEach(s => {
    if (s.dying) {
      s.alpha -= s.fadeSpeed;
      if (s.alpha < 0) s.alpha = 0;
    } else {
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha > 1) { s.alpha = 1; s.twinkleDir = -1; }
      if (s.alpha < 0.2) { s.alpha = 0.2; s.twinkleDir = 1; }
    }

    if (s.alpha <= 0) return;
    anyVisible = true;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 248, 220, ${s.alpha})`;
    ctx.fill();

    if (s.r > 1.2) {
      const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
      grd.addColorStop(0, `rgba(255,248,200,${s.alpha * 0.3})`);
      grd.addColorStop(1, 'rgba(255,248,200,0)');
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }
  });

  if (anyVisible || !goingOut) {
    animFrame = requestAnimationFrame(draw);
  }
}

resize();
initStars();
draw();

goingOutTimer = setTimeout(() => {
  goingOut = true;
  killStars();
}, 1000);

window.addEventListener('resize', () => {
  resize();
  if (!goingOut) initStars();
});
