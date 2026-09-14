const skills = [
  ['React','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',10,12],
  ['TypeScript','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',38,4],
  ['Next.js','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',4,44],
  ['Python','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',42,52],
  ['FastAPI','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',12,76],
  ['Flutter','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg',36,84],
  ['Firebase','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg',56,12],
  ['Supabase','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',82,6],
  ['PostgreSQL','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',92,42],
  ['Docker','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',58,55],
  ['GitHub','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',84,75],
  ['Vercel','https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg',58,88],
];

const orbit = document.getElementById('skillOrbit');
let dragging = null;

skills.forEach(([name, icon, x, y]) => {
  const button = document.createElement('button');
  button.className = 'skill-chip';
  button.style.left = `${x}%`;
  button.style.top = `${y}%`;
  button.setAttribute('aria-label', `Move ${name} skill`);
  button.title = `${name} — drag me`;
  button.innerHTML = `<img src="${icon}" alt="" draggable="false"><span>${name}</span><b class="move-mark">✥</b>`;
  button.addEventListener('pointerdown', e => {
    dragging = button;
    button.classList.add('dragging');
    button.setPointerCapture(e.pointerId);
  });
  button.addEventListener('pointermove', e => {
    if (dragging !== button) return;
    const rect = orbit.getBoundingClientRect();
    const px = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const py = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    button.style.left = `${px}%`;
    button.style.top = `${py}%`;
  });
  const stop = () => {
    if (dragging === button) {
      dragging = null;
      button.classList.remove('dragging');
    }
  };
  button.addEventListener('pointerup', stop);
  button.addEventListener('pointercancel', stop);
  orbit.appendChild(button);
});

document.getElementById('year').textContent = new Date().getFullYear();
