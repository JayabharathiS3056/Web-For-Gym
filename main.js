/* ============================================================
   IRONFORGE GYM — main.js
   All interactive behaviour for the website
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. CUSTOM CURSOR ────────────────────────────────────── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx - 6 + 'px';
    cursor.style.top  = my - 6 + 'px';
  });

  (function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx - 18 + 'px';
    follower.style.top  = fy - 18 + 'px';
    requestAnimationFrame(animFollower);
  })();

  // Scale cursor on interactive elements
  document.querySelectorAll('a, button, .class-card, .amenity-card, .review-card, .play-btn')
    .forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform   = 'scale(2)';
        follower.style.transform = 'scale(1.5)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform   = 'scale(1)';
        follower.style.transform = 'scale(1)';
      });
    });


  /* ── 2. NAVBAR SCROLL EFFECT ─────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  });


  /* ── 3. SCROLL REVEAL ────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ── 4. VIDEO SECTION PLAY/PAUSE ─────────────────────────── */
  window.toggleVideo = function () {
    const vid = document.querySelector('.video-wrapper video');
    if (vid && vid.style.display !== 'none') {
      vid.paused ? vid.play() : vid.pause();
    }
  };


  /* ── 5. FORMSPREE CONTACT FORM (EDIT 2) ──────────────────── */
  const contactForm  = document.getElementById('contactForm');
  const submitBtn    = document.getElementById('submitBtn');
  const formSuccess  = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Button loading state
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled    = true;

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://formspree.io/f/xdabzpnn', {
          method : 'POST',
          body   : formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          // Show success message
          contactForm.style.display  = 'none';
          formSuccess.style.display  = 'block';
        } else {
          const data = await response.json();
          const errorMsg = data.errors
            ? data.errors.map(err => err.message).join(', ')
            : 'Something went wrong. Please try again.';
          alert('Error: ' + errorMsg);
          submitBtn.textContent = 'Send Message →';
          submitBtn.disabled    = false;
        }
      } catch (err) {
        alert('Network error. Please check your connection and try again.');
        submitBtn.textContent = 'Send Message →';
        submitBtn.disabled    = false;
      }
    });
  }


  /* ── 6. ACTIVE NAV HIGHLIGHT ON SCROLL ───────────────────── */
  const sections = document.querySelectorAll('section[id], div[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-contact-btn)');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navLinks.forEach(a => {
      a.style.color = (a.getAttribute('href') === '#' + current)
        ? 'var(--sand)'
        : '';
    });
  });

});
