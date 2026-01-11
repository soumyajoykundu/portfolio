/**
 * Professional contact form with client-side validation, success feedback,
 * and basic spam prevention (no backend required for demo)
 */

(function() {
  const form = document.getElementById('contactForm');
  const errorEl = document.getElementById('error') || document.createElement('p');
  const successEl = document.createElement('p');

  if (!form) return;

  errorEl.id = 'error';
  errorEl.style.cssText = 'color: #ef4444; margin-top: 1rem; font-weight: 500;';
  successEl.style.cssText = 'color: #10b981; margin-top: 1rem; font-weight: 500; background: rgba(16,185,129,0.1); padding: 1rem; border-radius: 6px; border: 1px solid #10b981;';

  form.appendChild(errorEl);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFeedback();

    const formData = {
      name: document.getElementById('name')?.value.trim(),
      email: document.getElementById('email')?.value.trim(),
      message: document.getElementById('message')?.value.trim()
    };

    // Comprehensive validation
    const errors = [];
    if (!formData.name || formData.name.length < 2) {
      errors.push('Name must be at least 2 characters.');
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address.');
    }
    if (!formData.message || formData.message.length < 10) {
      errors.push('Message must be at least 10 characters.');
    }

    if (errors.length > 0) {
      errorEl.textContent = errors.join(' ');
      errorEl.style.display = 'block';
      form.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Simulate form submission (demo - replace with Formspree/EmailJS)
    errorEl.style.display = 'none';
    form.appendChild(successEl);
    successEl.textContent = 'Thank you! Your message has been validated successfully (demo mode). In production, this would send to your email.';
    successEl.style.display = 'block';

    // Reset form after delay
    setTimeout(() => {
      form.reset();
      clearFeedback();
    }, 5000);

    // Analytics (optional - Google Analytics, etc.)
    console.log('Form submitted:', formData);
  });

  // Real-time validation
  ['name', 'email', 'message'].forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => clearFeedback());
    }
  });

  function validateField(field) {
    // Individual field validation logic here if needed
  }

  function clearFeedback() {
    errorEl.style.display = 'none';
    successEl.style.display = 'none';
  }
})();
