/**
 * Main JS
 * Slideshow, nav scroll effect, mobile menu.
 */

// Nav scroll effect
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Slideshow (initialized by content-loader after slides render)
window.initSlideshow = function () {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slide-dot');
  const prevBtn = document.querySelector('.slide-arrow.prev');
  const nextBtn = document.querySelector('.slide-arrow.next');
  if (!slides.length) return;

  let current = 0;
  let timer;
  const SLIDE_DURATION = 6000; // matches CSS progress animation

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
    restartTimer();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function restartTimer() {
    clearInterval(timer);
    timer = setInterval(next, SLIDE_DURATION);
  }

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Touch/swipe support
  let touchStartX = 0;
  const slideshow = document.getElementById('slideshow');
  if (slideshow) {
    slideshow.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    slideshow.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) prev(); else next();
      }
    }, { passive: true });
  }

  // Pause on hover (desktop)
  slideshow?.addEventListener('mouseenter', () => clearInterval(timer));
  slideshow?.addEventListener('mouseleave', restartTimer);

  // Keyboard arrows
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  restartTimer();
};
