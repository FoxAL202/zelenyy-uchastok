document.addEventListener('DOMContentLoaded', () => {

  /* ----- Theme toggle ----- */
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) html.setAttribute('data-theme', saved);

  themeBtn?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ----- Mobile menu ----- */
  const menuBtn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('headerNav');
  menuBtn?.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    nav?.classList.toggle('open');
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menuBtn?.classList.remove('active');
    nav?.classList.remove('open');
  }));

  /* ----- Scroll reveal ----- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* ----- Service cards expand ----- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('expanded'));
  });

  /* ----- Lightbox ----- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.dataset.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ----- Hero parallax ----- */
  const heroBg = document.getElementById('heroBg');
  window.addEventListener('scroll', () => {
    if (!heroBg) return;
    const rect = heroBg.parentElement.getBoundingClientRect();
    if (rect.bottom > 0) {
      const speed = -0.3;
      heroBg.style.transform = `translateY(${rect.top * speed}px)`;
    }
  }, { passive: true });

  /* ----- Phone mask ----- */
  document.querySelectorAll('input[type="tel"]').forEach(inp => {
    inp.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      let f = '+7 ';
      if (v.length > 1) f += '(' + v.slice(1, 4);
      if (v.length >= 4) f += ') ' + v.slice(4, 7);
      if (v.length >= 7) f += '-' + v.slice(7, 9);
      if (v.length >= 9) f += '-' + v.slice(9, 11);
      e.target.value = f;
    });
    inp.addEventListener('focus', function () {
      if (!this.value) this.value = '+7 ';
    });
    inp.addEventListener('blur', function () {
      if (this.value === '+7 ') this.value = '';
    });
  });

  /* ----- Character counter ----- */
  document.querySelectorAll('textarea[maxlength]').forEach(ta => {
    const counter = ta.parentElement.querySelector('.char-counter span');
    if (counter) {
      ta.addEventListener('input', () => { counter.textContent = ta.value.length; });
    }
  });

  /* ----- Form validation (no alerts) ----- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    // Clear errors on input
    contactForm.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
      el.addEventListener('input', () => el.closest('.form-group')?.classList.remove('error'));
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;

      // Validate each required field
      contactForm.querySelectorAll('.form-group [required]').forEach(el => {
        const group = el.closest('.form-group');
        group?.classList.remove('error');
        if (!el.value.trim()) {
          group?.classList.add('error');
          valid = false;
        }
      });

      // Validate email if filled
      const email = document.getElementById('formEmail');
      if (email?.value.trim()) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(email.value.trim())) {
          email.closest('.form-group')?.classList.add('error');
          valid = false;
        }
      }

      // Phone minimum length check
      const phone = document.getElementById('formPhone');
      if (phone?.value.trim() && phone.value.trim().length < 10) {
        phone.closest('.form-group')?.classList.add('error');
        valid = false;
      }

      if (!valid) return;

      // Submit via FormSubmit
      const btn = document.getElementById('formSubmit');
      btn.textContent = 'Отправка...';
      btn.disabled = true;

      const formData = new FormData(contactForm);
      formData.append('_captcha', 'false');
      formData.append('_template', 'table');
      formData.append('_next', '');

      try {
        const res = await fetch('https://formsubmit.co/ajax/alexfox20502@gmail.com', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          contactForm.querySelector('.form-success')?.classList.add('show');
          contactForm.style.display = 'none';
        } else {
          alert('Ошибка отправки. Попробуйте позже.');
        }
      } catch {
        alert('Ошибка сети. Попробуйте позже.');
      }
      btn.textContent = 'Отправить заявку';
      btn.disabled = false;
    });
  }
});
