document.addEventListener('DOMContentLoaded', () => {
  // Early access sign-ups go to the existing Google Sheet (same web app as the old waitlist).
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxfvg8m9xfDNq7Ca6oN6b_1jKu40Nf-TPfsn0_MMoBKfzhIXiuCkhpsvNCYyBGtXhSE/exec';

  // Contact form messages are sent to hi@hi-kit.co.uk by Web3Forms.
  // Paste the access key Web3Forms emailed to hi@ between the quotes.
  const WEB3FORMS_KEY = '7d27092a-b9db-4390-a6e3-77c673ce09e8';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = 'form-message' + (type ? ' ' + type : '');
  }

  // Early access forms
  document.querySelectorAll('.js-signup').forEach((form) => {
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const message = form.querySelector('.form-message');
    const label = button.textContent;

    input.addEventListener('input', () => {
      input.classList.remove('input-error');
      setMessage(message, '', '');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input.value.trim();

      if (!email || !emailRegex.test(email)) {
        input.classList.add('input-error');
        setMessage(message, email ? 'Please enter a valid email address.' : 'Please enter your email address.', 'error');
        input.focus();
        return;
      }

      button.disabled = true;
      button.textContent = 'Signing you up…';

      fetch(SCRIPT_URL + '?email=' + encodeURIComponent(email), { method: 'GET', mode: 'no-cors' })
        .then(() => {
          setMessage(message, "Thanks, you're on the list. We'll email you when you're in.", 'success');
          input.value = '';
        })
        .catch(() => {
          setMessage(message, 'Something went wrong. Please try again.', 'error');
        })
        .finally(() => {
          button.disabled = false;
          button.textContent = label;
        });
    });
  });

  // Contact form
  const contact = document.getElementById('contactForm');
  if (contact) {
    const button = contact.querySelector('button[type="submit"]');
    const message = contact.querySelector('.form-message');
    const label = button.textContent;
    const required = ['name', 'email', 'message'].map((n) => contact.elements[n]);

    required.forEach((field) => field.addEventListener('input', () => field.classList.remove('input-error')));

    contact.addEventListener('submit', (e) => {
      e.preventDefault();
      setMessage(message, '', '');

      const missing = required.filter((f) => !f.value.trim());
      missing.forEach((f) => f.classList.add('input-error'));
      if (missing.length) {
        setMessage(message, 'Please fill in your name, email and message.', 'error');
        missing[0].focus();
        return;
      }
      if (!emailRegex.test(contact.elements.email.value.trim())) {
        contact.elements.email.classList.add('input-error');
        setMessage(message, 'Please enter a valid email address.', 'error');
        contact.elements.email.focus();
        return;
      }
      if (contact.elements.botcheck.checked) return; // bots tick the hidden box

      const data = Object.fromEntries(new FormData(contact));
      delete data.botcheck;
      data.access_key = WEB3FORMS_KEY;
      data.replyto = data.email;

      button.disabled = true;
      button.textContent = 'Sending…';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setMessage(message, "Thanks, message sent. We'll reply to the email you gave us.", 'success');
            contact.reset();
          } else {
            setMessage(message, 'Your message didn\'t send. Please try again in a moment.', 'error');
          }
        })
        .catch(() => {
          setMessage(message, 'Your message didn\'t send. Please check your connection and try again.', 'error');
        })
        .finally(() => {
          button.disabled = false;
          button.textContent = label;
        });
    });
  }

  // Old links to /#waitlist now land on the early access section
  if (window.location.hash === '#waitlist') {
    const join = document.getElementById('pricing');
    if (join) join.scrollIntoView();
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
});
