/* =========================================================
   Art Wealth - main.js
   ========================================================= */

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('nav-mobile-open');
      toggle.classList.toggle('open');
      const expanded = toggle.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
  }

  // Reveal-on-scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Mark active nav link based on current path
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Reviews carousel auto-rotate (homepage only)
  const track = document.querySelector('[data-review-carousel]');
  if (track) {
    const cards = Array.from(track.children);
    let visibleStart = 0;
    const visibleCount = window.innerWidth > 980 ? 3 : (window.innerWidth > 600 ? 2 : 1);

    function rotate() {
      cards.forEach((card, idx) => {
        const start = visibleStart;
        const end = (visibleStart + visibleCount) % cards.length;
        const inView = (start < end)
          ? (idx >= start && idx < end)
          : (idx >= start || idx < end);
        card.style.display = inView ? '' : 'none';
      });
      visibleStart = (visibleStart + 1) % cards.length;
    }
    rotate();
    setInterval(rotate, 5000);
  }

  // Contact form — submits to Netlify Forms in the background, shows inline thank-you
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = (form.querySelector('[name="name"]').value || '').trim();
      const note = form.querySelector('[data-form-note]');
      const button = form.querySelector('button[type="submit"]');
      if (button) { button.disabled = true; button.textContent = 'Sending…'; }

      try {
        const formData = new FormData(form);
        const body = new URLSearchParams(formData).toString();
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body
        });
        if (!res.ok) throw new Error('Network response was not OK');
        if (note) {
          note.textContent = `Thanks ${name.split(' ')[0] || 'there'}! Your message has been sent — Arthur will be in touch within one business day.`;
          note.style.color = 'var(--success)';
        }
        form.reset();
        if (button) { button.textContent = 'Sent ✓'; }
      } catch (err) {
        if (note) {
          note.textContent = `Sorry — something went wrong sending your message. Please email arthur@artwealth.com.au directly.`;
          note.style.color = '#b94343';
        }
        if (button) { button.disabled = false; button.textContent = 'Send message'; }
      }
    });
  }
});
