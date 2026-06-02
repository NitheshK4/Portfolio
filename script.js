// ── BOOT INTRO SEQUENCE ──
(function boot() {
  const overlay = document.getElementById('intro-overlay');
  const linesEl = document.getElementById('boot-lines');
  const bar     = document.getElementById('intro-bar');
  const pct     = document.getElementById('intro-pct');
  const ready   = document.getElementById('intro-ready');

  const cmds = [
    { cmd: 'init --env production',           ok: false, t: 180  },
    { cmd: 'load ai_ml_runtime --v3',         ok: true,  t: 480  },
    { cmd: 'mount portfolio@nithesh',         ok: true,  t: 780  },
    { cmd: 'auth nithesh@vitap.edu',          ok: true,  t: 1050 },
    { cmd: 'compile assets --mode=prod',      ok: true,  t: 1320 },
    { cmd: 'start server 0.0.0.0:3000',       ok: true,  t: 1580 },
  ];

  cmds.forEach(({ cmd, ok, t }) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'boot-line';
      el.innerHTML =
        `<span class="b-prompt">$</span>` +
        `<span class="b-cmd">${cmd}</span>` +
        (ok ? `<span class="b-ok">✓ ok</span>` : '');
      linesEl.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
    }, t);
  });

  // Progress bar fill after last command
  setTimeout(() => {
    let w = 0;
    bar.style.transition = 'none';
    const iv = setInterval(() => {
      w += 1.4;
      bar.style.width = Math.min(w, 100) + '%';
      pct.textContent = Math.floor(Math.min(w, 100)) + '%';
      if (w >= 100) {
        clearInterval(iv);
        pct.textContent = '100%';
        // Flash READY
        setTimeout(() => {
          ready.classList.add('show');
          // Exit overlay
          setTimeout(() => {
            overlay.classList.add('exit');
            document.body.classList.add('hero-ready');
            setTimeout(() => {
              overlay.remove();
              // Trigger text scramble once intro is gone
              startNameScramble();
            }, 1000);
          }, 420);
        }, 120);
      }
    }, 11);
  }, 1820);
})();

// ── CUSTOM CURSOR (ZERO-LATENCY HUD RETICLE) ──
const c1 = document.getElementById('c1');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  c1.style.left = `${mx}px`;
  c1.style.top = `${my}px`;
});

// Hover classes for mouse states on interactive elements
document.querySelectorAll('a, button, .contact-link, .btn-a, .btn-b, .email-btn, .project-item, .service-item, .hero-terminal, .commit-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

// ── PROJECT HOVER PREVIEW ──
const hc = document.getElementById('hover-card');
document.querySelectorAll('.project-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    hc.textContent = item.dataset.emoji || '🚀';
    hc.style.opacity = '1';
    hc.style.transform = 'scale(1) rotate(-2deg)';
  });
  item.addEventListener('mouseleave', () => {
    hc.style.opacity = '0';
    hc.style.transform = 'scale(.85) rotate(2deg)';
  });
  item.addEventListener('mousemove', e => {
    hc.style.left = `${e.clientX + 24}px`;
    hc.style.top = `${e.clientY - 75}px`;
  });
});

// ── STATS COUNTER ANIMATION ──
const counted = {};
const aboutSection = document.querySelector('.about');
if (aboutSection) {
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        const val = el.dataset.count;
        if (counted[val]) return;
        counted[val] = true;
        const target = +val;
        let current = 0;
        const interval = setInterval(() => {
          current += target / 60;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          const suffix = (target === 12) ? '+' : '';
          el.textContent = Math.round(current) + suffix;
        }, 18);
      });
    });
  }, { threshold: 0.3 }).observe(aboutSection);
}

// ── HERO NAME SCRAMBLE (DECRYPTION SEQUENCER) ──
const chars = '█▓▒░◆◇○●$¥▰▱▲▼';
const nameEl = document.getElementById('hero-scramble-name');

function startNameScramble() {
  if (!nameEl) return;
  const target = 'NITHESH';
  let currentIteration = 0;
  const maxIterations = 45; // ~3.5 seconds total
  const intervalTime = 75; 
  
  const scrambleInterval = setInterval(() => {
    const progress = currentIteration / maxIterations;
    const resolvedCount = Math.floor(progress * target.length);
    
    let result = '';
    for (let i = 0; i < target.length; i++) {
      if (i < resolvedCount) {
        result += target[i];
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    nameEl.childNodes[0].textContent = result + '\n';
    currentIteration++;
    
    if (currentIteration > maxIterations) {
      clearInterval(scrambleInterval);
      nameEl.childNodes[0].textContent = target + '\n';
    }
  }, intervalTime);
}

// ── SMOOTH PARALLAX ON HERO BG TEXT ──
const bgTxt = document.querySelector('.hero-bg-text');
if (bgTxt) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    bgTxt.style.transform = `translate(-50%, calc(-50% + ${y * 0.3}px))`;
    bgTxt.style.opacity = Math.max(0, 1 - y / 500) + '';
  });
}

// ── HAMBURGER MENU RESPONSIVENESS ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.n-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  
  // Close menu when links are clicked
  document.querySelectorAll('.n-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// ── FADE IN INTERSECTION OBSERVER ──
document.querySelectorAll('.fi').forEach(el => {
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('v');
      }
    });
  }, { threshold: 0.08 }).observe(el);
});

// ── CONTACT EMAIL HANDLER ──
const emailBtn = document.getElementById('email-contact-btn');
if (emailBtn) {
  emailBtn.addEventListener('click', () => {
    const subject = encodeURIComponent("Hi Nithesh, Inquiry from Portfolio");
    const body = encodeURIComponent("Hi Nithesh,\n\nI visited your portfolio and wanted to connect.\n\nBest regards,\n[Your Name]");
    const mailtoUrl = `mailto:nitheshk236@gmail.com?subject=${subject}&body=${body}`;
    
    // Create a temporary link to trigger click
    const tempLink = document.createElement('a');
    tempLink.href = mailtoUrl;
    tempLink.click();
  });
}

// ── INTERACTIVE NEURAL CONSTELLATION CANVAS ──
(function initNeuralCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0, height = 0;
  let particles = [];
  const maxParticles = window.innerWidth < 768 ? 25 : 55;
  const connectDist = 110;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 92, 57, 0.45)';
      ctx.fill();
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectDist) {
          const alpha = (1 - dist / connectDist) * 0.16;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(30, 78, 89, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      const rect = canvas.getBoundingClientRect();
      const mouseCanvasX = mx - rect.left;
      const mouseCanvasY = my - rect.top;

      if (mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom) {
        const dx = particles[i].x - mouseCanvasX;
        const dy = particles[i].y - mouseCanvasY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseConnectDist = 140;

        if (dist < mouseConnectDist) {
          const alpha = (1 - dist / mouseConnectDist) * 0.28;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouseCanvasX, mouseCanvasY);
          ctx.strokeStyle = `rgba(255, 92, 57, ${alpha})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(loop);
  }

  loop();
})();
