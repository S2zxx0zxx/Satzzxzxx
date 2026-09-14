const skillData = [
  ['React','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg'],
  ['TypeScript','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg'],
  ['Next.js','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg'],
  ['Python','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg'],
  ['FastAPI','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg'],
  ['Flutter','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg'],
  ['Firebase','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg'],
  ['Supabase','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg'],
  ['PostgreSQL','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg'],
  ['Docker','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg'],
  ['GitHub','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg'],
  ['Vercel','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg']
];

const physicsZone = document.getElementById('physicsZone');
const motionToggle = document.getElementById('motionToggle');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pointerIsCoarse = window.matchMedia('(pointer: coarse)').matches;
const bodies = [];
let zoneRect = null;
let gravityX = 0;
let gravityY = 0.22;
let lastFrame = performance.now();
let running = true;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function bodySize() {
  if (window.innerWidth <= 480) return 58;
  if (window.innerWidth <= 760) return 64;
  return 72;
}

function createBodies() {
  if (!physicsZone) return;
  physicsZone.innerHTML = '';
  const seeds = [
    [.09,.03], [.17,.20], [.07,.38], [.19,.52], [.28,.67], [.38,.31],
    [.62,.08], [.75,.22], [.88,.05], [.82,.42], [.69,.58], [.91,.67]
  ];
  const size = bodySize();

  skillData.forEach(([name, icon], index) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'physics-token';
    el.setAttribute('aria-label', `${name} technology — drag to move`);
    el.title = `${name} — drag me`;
    el.innerHTML = `<img src="${icon}" alt="" draggable="false">`;
    physicsZone.appendChild(el);

    const body = {
      el,
      name,
      size,
      r:size/2,
      x:0,
      y:0,
      vx:(Math.random()-.5)*1.2,
      vy:Math.random()*.5,
      rot:(Math.random()-.5)*28,
      vr:(Math.random()-.5)*.8,
      dragging:false,
      pointerId:null,
      offsetX:0,
      offsetY:0,
      lastX:0,
      lastY:0,
      lastT:0,
      seed:seeds[index]
    };

    bodies.push(body);

    el.addEventListener('pointerdown', event => {
      zoneRect = physicsZone.getBoundingClientRect();
      body.dragging = true;
      body.pointerId = event.pointerId;
      el.classList.add('dragging');
      el.setPointerCapture(event.pointerId);
      body.offsetX = event.clientX - zoneRect.left - body.x;
      body.offsetY = event.clientY - zoneRect.top - body.y;
      body.lastX = event.clientX;
      body.lastY = event.clientY;
      body.lastT = performance.now();
      body.vx = 0;
      body.vy = 0;
    });

    el.addEventListener('pointermove', event => {
      if (!body.dragging || event.pointerId !== body.pointerId) return;
      const now = performance.now();
      const dt = Math.max(8, now - body.lastT);
      const nextX = event.clientX - zoneRect.left - body.offsetX;
      const nextY = event.clientY - zoneRect.top - body.offsetY;
      body.vx = (event.clientX - body.lastX) / dt * 16;
      body.vy = (event.clientY - body.lastY) / dt * 16;
      body.x = nextX;
      body.y = nextY;
      body.lastX = event.clientX;
      body.lastY = event.clientY;
      body.lastT = now;
    });

    const release = event => {
      if (!body.dragging || (event.pointerId != null && event.pointerId !== body.pointerId)) return;
      body.dragging = false;
      body.pointerId = null;
      el.classList.remove('dragging');
      body.vx = clamp(body.vx, -9, 9);
      body.vy = clamp(body.vy, -9, 9);
    };

    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
  });

  resetBodyPositions();
}

function resetBodyPositions() {
  if (!physicsZone || !bodies.length) return;
  zoneRect = physicsZone.getBoundingClientRect();
  const w = zoneRect.width;
  const h = zoneRect.height;
  bodies.forEach(body => {
    body.size = bodySize();
    body.r = body.size/2;
    body.x = body.seed[0] * Math.max(w - body.size, 1);
    body.y = body.seed[1] * Math.max(h * .45, 1);
    body.vx = (Math.random()-.5)*.8;
    body.vy = 0;
  });
}

function resolveCollisions() {
  for (let i = 0; i < bodies.length; i += 1) {
    for (let j = i + 1; j < bodies.length; j += 1) {
      const a = bodies[i];
      const b = bodies[j];
      if (a.dragging && b.dragging) continue;

      const ax = a.x + a.r;
      const ay = a.y + a.r;
      const bx = b.x + b.r;
      const by = b.y + b.r;
      const dx = bx - ax;
      const dy = by - ay;
      const distance = Math.hypot(dx,dy) || .001;
      const minDistance = a.r + b.r + 2;
      if (distance >= minDistance) continue;

      const nx = dx / distance;
      const ny = dy / distance;
      const overlap = minDistance - distance;
      const aMove = a.dragging ? 0 : overlap * .5;
      const bMove = b.dragging ? 0 : overlap * .5;
      a.x -= nx * aMove;
      a.y -= ny * aMove;
      b.x += nx * bMove;
      b.y += ny * bMove;

      const relativeVx = b.vx - a.vx;
      const relativeVy = b.vy - a.vy;
      const separatingVelocity = relativeVx * nx + relativeVy * ny;
      if (separatingVelocity < 0) {
        const impulse = -(1.55) * separatingVelocity / 2;
        if (!a.dragging) {
          a.vx -= impulse * nx;
          a.vy -= impulse * ny;
          a.vr -= impulse * .08;
        }
        if (!b.dragging) {
          b.vx += impulse * nx;
          b.vy += impulse * ny;
          b.vr += impulse * .08;
        }
      }
    }
  }
}

function physicsFrame(now) {
  if (!running || !physicsZone) return;
  zoneRect = physicsZone.getBoundingClientRect();
  const width = zoneRect.width;
  const height = zoneRect.height;
  const dt = clamp((now-lastFrame)/16.667,.45,1.8);
  lastFrame = now;

  if (!prefersReducedMotion) {
    bodies.forEach(body => {
      if (!body.dragging) {
        body.vx += gravityX * dt;
        body.vy += gravityY * dt;
        body.vx *= Math.pow(.992,dt);
        body.vy *= Math.pow(.992,dt);
        body.vr *= Math.pow(.993,dt);
        body.x += body.vx * dt;
        body.y += body.vy * dt;
        body.rot += body.vr * dt;
      }

      const maxX = Math.max(0,width-body.size);
      const maxY = Math.max(0,height-body.size);
      if (body.x < 0) {body.x=0;body.vx=Math.abs(body.vx)*.72;body.vr += .18;}
      if (body.x > maxX) {body.x=maxX;body.vx=-Math.abs(body.vx)*.72;body.vr -= .18;}
      if (body.y < 0) {body.y=0;body.vy=Math.abs(body.vy)*.65;}
      if (body.y > maxY) {body.y=maxY;body.vy=-Math.abs(body.vy)*.68;body.vx*=.96;body.vr*=.94;}
    });
    resolveCollisions();
  }

  bodies.forEach(body => {
    body.el.style.transform = `translate3d(${body.x}px,${body.y}px,0) rotate(${body.rot}deg)`;
  });
  requestAnimationFrame(physicsFrame);
}

async function enableMotion() {
  if (typeof DeviceOrientationEvent === 'undefined') return;
  try {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== 'granted') return;
    }
    window.addEventListener('deviceorientation', event => {
      const gamma = Number.isFinite(event.gamma) ? event.gamma : 0;
      const beta = Number.isFinite(event.beta) ? event.beta : 0;
      gravityX = clamp(gamma / 45,-1,1) * .22;
      gravityY = .14 + clamp(beta / 80,-.6,1) * .12;
    },{passive:true});
    motionToggle.textContent = '✓ Phone motion enabled';
    motionToggle.disabled = true;
  } catch (error) {
    motionToggle.textContent = 'Motion unavailable';
  }
}

if (physicsZone) {
  createBodies();
  requestAnimationFrame(physicsFrame);
  let resizeTimer;
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(resetBodyPositions,140);
  },{passive:true});
}

if (motionToggle && pointerIsCoarse && typeof DeviceOrientationEvent !== 'undefined') {
  motionToggle.classList.add('visible');
  motionToggle.addEventListener('click',enableMotion);
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -30px'});

document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const start = performance.now();
    const duration = 700;
    const tick = now => {
      const p = clamp((now-start)/duration,0,1);
      const eased = 1-Math.pow(1-p,3);
      el.textContent = Math.round(target*eased);
      if (p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
},{threshold:.5});

document.querySelectorAll('[data-count]').forEach(el=>countObserver.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',event=>{
    const target=document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({behavior:prefersReducedMotion?'auto':'smooth',block:'start'});
  });
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
