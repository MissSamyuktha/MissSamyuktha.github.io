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
  '.project-grid, .skills-grid, .edu-grid'
);
staggerParents.forEach((parent) => {
  [...parent.children].forEach((child, i) => {
    if (child.classList.contains('reveal')) {
      child.style.transitionDelay = `${Math.min(i * 80, 400)}ms`;
    }
  });
});

// Scroll-reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
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
