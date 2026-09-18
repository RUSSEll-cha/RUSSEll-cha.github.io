const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const toast = document.querySelector('.toast');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target, target = Number(el.dataset.count || 0);
    if (reduced) { el.textContent = target; countObserver.unobserve(el); return; }
    const start = performance.now(), duration = 1100;
    const tick = now => { const p = Math.min((now - start) / duration, 1); el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick); countObserver.unobserve(el);
  });
}, { threshold: .8 });
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

document.querySelectorAll('[data-copy]').forEach(el => el.addEventListener('click', async e => {
  e.preventDefault(); const value = el.dataset.copy;
  try { await navigator.clipboard.writeText(value); showToast('邮箱已复制：' + value); } catch { showToast(value); }
}));
function showToast(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2800); }

const cursor = document.querySelector('.cursor');
if (cursor && !('ontouchstart' in window)) {
  window.addEventListener('mousemove', e => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; });
  document.querySelectorAll('[data-cursor]').forEach(el => { el.addEventListener('mouseenter', () => { cursor.classList.add('active'); cursor.querySelector('span').textContent = el.dataset.cursor; }); el.addEventListener('mouseleave', () => cursor.classList.remove('active')); });
}
document.querySelectorAll('.magnetic').forEach(button => {
  button.addEventListener('mousemove', e => { const r = button.getBoundingClientRect(); button.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.12}px, ${(e.clientY-r.top-r.height/2)*.12}px)`; });
  button.addEventListener('mouseleave', () => button.style.transform = '');
});
