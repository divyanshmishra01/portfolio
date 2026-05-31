
  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── Mobile Nav Drawer ── */
  const hamburger     = document.getElementById('hamburger');
  const mobileDrawer  = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const drawerClose   = document.getElementById('drawerClose');
  const drawerHireBtn = document.getElementById('drawerHireBtn');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () =>
    mobileDrawer.classList.contains('open') ? closeDrawer() : openDrawer()
  );
  drawerClose.addEventListener('click', closeDrawer);
  mobileOverlay.addEventListener('click', closeDrawer);
  drawerHireBtn.addEventListener('click', closeDrawer);
  document.querySelectorAll('.drawer-link-item a').forEach(a => a.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  /* ── Char count ── */
  const msgEl   = document.getElementById('f-message');
  const countEl = document.getElementById('charCount');
  msgEl.addEventListener('input', () => { countEl.textContent = msgEl.value.length; });

  /* ── Validation ── */
  function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  function setError(id, state) {
    document.getElementById(id).classList[state ? 'add' : 'remove']('error');
  }
  function clearErrors() {
    ['fg-name','fg-email','fg-subject','fg-message'].forEach(id => setError(id, false));
    document.getElementById('errToast').classList.remove('show');
  }

  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSckCrrfyHqRcYIiCsw4woj0PqJn4JZk9L2GyDkWr_MZBKclRw/formResponse';
  const ENTRY_IDS = {
    name:    'entry.22553734',   
    email:   'entry.1513765264',  
    subject: 'entry.370047074',   
    message: 'entry.1501616813'    
  };

  /* ── Submit handler ── */
  document.getElementById('submitBtn').addEventListener('click', async () => {
    const name    = document.getElementById('f-name').value.trim();
    const email   = document.getElementById('f-email').value.trim();
    const subject = document.getElementById('f-subject').value.trim();
    const message = document.getElementById('f-message').value.trim();

    clearErrors();
    let valid = true;
    if (!name)                 { setError('fg-name', true);    valid = false; }
    if (!validateEmail(email)) { setError('fg-email', true);   valid = false; }
    if (!subject)              { setError('fg-subject', true); valid = false; }
    if (message.length < 20)   { setError('fg-message', true); valid = false; }
    if (!valid) return;

    const btn = document.getElementById('submitBtn');
    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const body = new FormData();
      body.append(ENTRY_IDS.name,    name);
      body.append(ENTRY_IDS.email,   email);
      body.append(ENTRY_IDS.subject, subject);
      body.append(ENTRY_IDS.message, message);
      await fetch(GOOGLE_FORM_URL, { method: 'POST', mode: 'no-cors', body });
      showSuccess();
    } catch (err) {
      console.error('Form error:', err);
      document.getElementById('errToastMsg').textContent =
        'Could not send message. Please email me directly at divyanshmishra283@gmail.com';
      document.getElementById('errToast').classList.add('show');
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });

  function showSuccess() {
    const btn = document.getElementById('submitBtn');
    btn.classList.remove('loading');
    btn.disabled = false;
    document.getElementById('formState').style.display = 'none';
    const ss = document.getElementById('successState');
    ss.classList.add('show');
    ss.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  document.getElementById('sendAnotherBtn').addEventListener('click', () => {
    ['f-name','f-email','f-subject','f-message'].forEach(id => { document.getElementById(id).value = ''; });
    countEl.textContent = '0';
    clearErrors();
    document.getElementById('successState').classList.remove('show');
    document.getElementById('formState').style.display = '';
  });