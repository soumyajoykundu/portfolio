/**
 * Core portfolio functionality: theme toggle, scroll animations, skill bars
 * Vanilla JS, no dependencies, performant with IntersectionObserver
 */

// Theme Toggle with LocalStorage Persistence
(function() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const html = document.documentElement;
  let currentTheme = localStorage.getItem('theme') || 'dark';
  
  html.setAttribute('data-theme', currentTheme);
  toggleBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  toggleBtn.title = currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  toggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    toggleBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    toggleBtn.title = currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  });
})();

// Scroll-triggered Animations (Cards & Elements)
(function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        // Skill bar animations
        const skillBars = entry.target.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
          if (bar.style.width) {
            bar.style.width = bar.style.width; // Trigger CSS transition
          }
        });
        observer.unobserve(entry.target); // Performance: observe once
      }
    });
  }, observerOptions);

  // Observe all cards and animate-on-scroll elements
  document.querySelectorAll('.card, .animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
})();

// Smooth scrolling for anchor links (if added later)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Mobile nav toggle (if hamburger added in future)
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    document.body.classList.remove('mobile-nav-open');
  }
});
