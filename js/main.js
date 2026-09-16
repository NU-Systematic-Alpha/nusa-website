document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('mobile-toggle');
  const links = document.getElementById('nav-links');
  const mobile = window.matchMedia('(max-width: 768px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setMenu(open) {
    toggle.classList.toggle('active', open);
    links.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    links.inert = mobile.matches && !open;
  }

  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!navbar.contains(event.target)) setMenu(false);
  });
  mobile.addEventListener('change', () => setMenu(false));
  setMenu(false);

  const updateNavbar = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Reveal existing optional animation classes once; content remains visible without this feature.
  const animated = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .stagger-item');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    animated.forEach(element => element.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    animated.forEach(element => observer.observe(element));
  }
});
