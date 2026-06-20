// ── BOOT INTRO SEQUENCE ──
(function boot() {
  const overlay = document.getElementById('intro-overlay');
  const linesEl = document.getElementById('boot-lines');
  const bar = document.getElementById('intro-bar');
  const pct = document.getElementById('intro-pct');
  const ready = document.getElementById('intro-ready');

  const cmds = [
    { cmd: 'init --env production', ok: false, t: 180 },
    { cmd: 'load ai_ml_runtime --v3', ok: true, t: 480 },
    { cmd: 'mount portfolio@nithesh', ok: true, t: 780 },
    { cmd: 'auth nithesh@vitap.edu', ok: true, t: 1050 },
    { cmd: 'compile assets --mode=prod', ok: true, t: 1320 },
    { cmd: 'start server 0.0.0.0:3000', ok: true, t: 1580 },
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
const aboutSection = document.querySelector('.about');
if (aboutSection) {
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        if (el.classList.contains('counted')) return;
        el.classList.add('counted');
        const val = el.dataset.count;
        const target = +val;
        let current = 0;
        const interval = setInterval(() => {
          current += target / 60;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          const suffix = (target === 12 || target === 15) ? '+' : '';
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
  const maxIterations = 67; // ~5 seconds total
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

})();

// ── FLOATING SHAPES & GLASS SPHERES ORGANIC DRIFT & PARALLAX ──
(function initOrganicFloating() {
  const shapes = document.querySelectorAll('.floating-shapes .shape');
  const spheres = document.querySelectorAll('.hero-glass-sphere');
  
  if (shapes.length === 0 && spheres.length === 0) return;

  // Initialize shapes (double-wrapped for separate drift and parallax)
  const shapeData = Array.from(shapes).map(shape => {
    const inner = shape.querySelector('.shape-inner');
    const depth = parseFloat(shape.getAttribute('data-depth')) || 0.1;
    const scrollSpeed = depth * 1.3;
    
    return {
      type: 'shape',
      outer: shape,
      inner: inner,
      depth: depth,
      scrollSpeed: scrollSpeed,
      cx: 0, cy: 0, tx: 0, ty: 0,
      
      // Multi-frequency organic drift parameters (infinite non-repeating paths)
      px1: Math.random() * 100, py1: Math.random() * 100,
      px2: Math.random() * 100, py2: Math.random() * 100,
      sx1: 0.0002 + Math.random() * 0.0003, sy1: 0.0002 + Math.random() * 0.0003,
      sx2: 0.0005 + Math.random() * 0.0006, sy2: 0.0005 + Math.random() * 0.0006,
      ampX: 80 + Math.random() * 90, ampY: 80 + Math.random() * 90,
      rotPhase: Math.random() * 100, rotSpeed: 0.00015 + Math.random() * 0.0002
    };
  });

  // Initialize spheres (single-wrapped, combined transform)
  const sphereData = Array.from(spheres).map((sphere, index) => {
    const depth = index === 0 ? 0.15 : 0.08;
    const scrollSpeed = depth * 1.2;
    
    return {
      type: 'sphere',
      element: sphere,
      depth: depth,
      scrollSpeed: scrollSpeed,
      cx: 0, cy: 0, tx: 0, ty: 0,
      
      // Organic drift parameters (slower, large motion for big spheres)
      px1: Math.random() * 100, py1: Math.random() * 100,
      px2: Math.random() * 100, py2: Math.random() * 100,
      sx1: 0.0001 + Math.random() * 0.0002, sy1: 0.0001 + Math.random() * 0.0002,
      sx2: 0.0003 + Math.random() * 0.0004, sy2: 0.0003 + Math.random() * 0.0004,
      ampX: 120 + Math.random() * 80, ampY: 120 + Math.random() * 80,
      rotPhase: Math.random() * 100, rotSpeed: 0.0001 + Math.random() * 0.00015
    };
  });

  const allItems = [...shapeData, ...sphereData];
  let currentScrollY = 0;
  let targetScrollY = 0;

  function update() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const time = Date.now();

    targetScrollY = window.scrollY;
    currentScrollY += (targetScrollY - currentScrollY) * 0.1;

    allItems.forEach(item => {
      // Parallax Tracking
      item.tx = (mx - centerX) * item.depth;
      item.ty = (my - centerY) * item.depth;
      item.cx += (item.tx - item.cx) * 0.08;
      item.cy += (item.ty - item.cy) * 0.08;

      const scrollYOffset = currentScrollY * item.scrollSpeed;
      const scrollRotation = currentScrollY * 0.04 * item.depth;

      // Organic Drift Calculation (Lissajous-like chaotic smooth path)
      const driftX = Math.sin(time * item.sx1 + item.px1) * item.ampX * 0.65 + 
                     Math.cos(time * item.sx2 + item.px2) * item.ampX * 0.35;
      const driftY = Math.cos(time * item.sy1 + item.py1) * item.ampY * 0.65 + 
                     Math.sin(time * item.sy2 + item.py2) * item.ampY * 0.35;
      const driftRotation = Math.sin(time * item.rotSpeed + item.rotPhase) * 35;

      if (item.type === 'shape') {
        // Outer shape element drifts organically
        if (item.outer) {
          item.outer.style.transform = `translate3d(${driftX}px, ${driftY}px, 0) rotate(${driftRotation}deg)`;
        }
        // Inner shape element applies mouse parallax + scroll parallax
        if (item.inner) {
          item.inner.style.transform = `translate3d(${item.cx}px, ${item.cy + scrollYOffset}px, 0) rotate(${scrollRotation}deg)`;
        }
      } else if (item.type === 'sphere') {
        // Combined transform for single-wrapped spheres
        if (item.element) {
          const totalX = driftX + item.cx;
          const totalY = driftY + item.cy + scrollYOffset;
          const totalRot = driftRotation + scrollRotation;
          item.element.style.transform = `translate3d(${totalX}px, ${totalY}px, 0) rotate(${totalRot}deg)`;
        }
      }
    });

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
})();



