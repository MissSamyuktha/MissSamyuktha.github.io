const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Nav: solid border once scrolled + scroll progress bar + back-to-top
const nav = document.getElementById('nav');
const progress = document.getElementById('scrollProgress');
const backTop = document.getElementById('backTop');
const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 10);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = max > 0 ? `${(y / max) * 100}%` : '0%';
  backTop.classList.toggle('show', y > 600);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  nav.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', open);
});
links.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    links.classList.remove('open');
    nav.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// Staggered reveal: delay siblings inside grids so cards cascade in
const staggerParents = document.querySelectorAll(
  '.project-grid, .skills-grid, .about-facts, .edu-grid'
);
staggerParents.forEach((parent) => {
  [...parent.children].forEach((child, i) => {
    if (child.classList.contains('reveal')) {
      child.style.transitionDelay = `${Math.min(i * 80, 400)}ms`;
    }
  });
});

// Animated counters for stat cards
const formatNum = (n) => n.toLocaleString('en-US');
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  if (reducedMotion) {
    el.textContent = formatNum(target) + suffix;
    return;
  }
  const duration = 1200;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = formatNum(Math.round(target * eased)) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Scroll-reveal (also fires counters the first time their card appears)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('[data-count]').forEach(animateCount);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Active nav link while scrolling
const sections = [...document.querySelectorAll('section[id], header[id]')];
const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) =>
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`)
        );
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach((s) => sectionObserver.observe(s));
