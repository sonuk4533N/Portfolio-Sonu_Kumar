/* ─── REAL DATA FROM RESUME ─── */

// Use resume data if available, otherwise fallback
const FALLBACK_PROJECTS = RESUME_DATA?.projects || [
  {
    id: 1,
    title: 'SarvadaaPower Corporate Website',
    description: 'Fully responsive corporate website achieving 100% compatibility across all devices. Lighthouse Score 94/100 (Desktop), 92/100 (Mobile). Integrated smooth scrolling, form validation, SEO optimization with meta tags & semantic HTML, and WebP image lazy loading reducing load time by 40%.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
    category: 'web',
    github_url: '',
    live_url: 'https://sarvadaapower.in',
    icon: '⚡'
  },
  {
    id: 2,
    title: 'E-Commerce Product Listing Platform',
    description: 'Full-stack e-commerce app with 8+ reusable React components, product filtering/sorting/search, shopping cart (Context API), JWT authentication, and 15+ REST API endpoints with MySQL. Achieved API response time < 200ms and 50% faster DB lookups via query optimization.',
    tags: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'JWT'],
    category: 'web',
    github_url: 'https://github.com/sonuk4533N',
    live_url: '',
    icon: '🛒'
  },
  {
    id: 3,
    title: 'Freelance Client Websites',
    description: 'Developed and deployed 3+ client websites across e-commerce, service-based, and portfolio industries. 100% client satisfaction with positive feedback on design quality and functionality. Average turnaround: 20–30 days with post-launch support.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    category: 'design',
    github_url: 'https://github.com/sonuk4533N',
    live_url: '',
    icon: '🎨'
  }
];

const FALLBACK_SKILLS = RESUME_DATA?.skills?.categories || [
  {
    category: 'Front-End',
    icon: '🖥️',
    skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React.js', 'Angular JS', 'Bootstrap', 'Tailwind CSS', 'Responsive Design']
  },
  {
    category: 'Back-End',
    icon: '⚙️',
    skills: ['Node.js', 'Express.js', 'PHP', 'MySQL', 'REST API Development', 'JWT Authentication', 'Database Design']
  },
  {
    category: 'Developer Tools',
    icon: '🛠️',
    skills: ['Git', 'GitHub', 'VS Code', 'Postman', 'Chrome DevTools', 'npm / yarn', 'CLI']
  },
  {
    category: 'Design Tools',
    icon: '🎨',
    skills: ['Figma', 'Adobe XD']
  },
  {
    category: 'Soft Skills',
    icon: '🤝',
    skills: ['Team Collaboration', 'Problem Solving', 'Critical Thinking', 'Time Management', 'Clear Communication', 'Quick Learner']
  },
  {
    category: 'Languages',
    icon: '🌐',
    skills: ['English (Professional)', 'Hindi (Native)']
  }
];

const FALLBACK_EXPERIENCES = RESUME_DATA?.experience || [
  {
    title: 'Freelance Web Developer',
    company: 'Self-Employed',
    period: '2024 – Present',
    description: 'Developing and deploying 3+ client websites across e-commerce, service-based, and portfolio industries. Delivering projects with 100% client satisfaction. Managing full development lifecycle from requirements gathering to deployment and maintenance. Average project turnaround: 20–30 days.'
  },
  {
    title: 'Full Stack Web Development Training',
    company: 'Arth Institute, Laxmi Nagar',
    period: 'Completed 2024 · 120 Hours',
    description: 'Comprehensive training in front-end and back-end technologies with hands-on projects. Covered HTML5, CSS3, JavaScript, React.js, Node.js, Express.js, MySQL, Git, and deployment workflows.'
  },
  {
    title: 'Git & GitHub Mastery',
    company: 'Apna College (Self-paced)',
    period: 'Completed 2024',
    description: 'Version control fundamentals, branching strategies, merge conflicts, pull requests, and collaborative workflows. Applied learnings across all personal and freelance projects.'
  },
  {
    title: 'Bachelor of Computer Application (BCA)',
    company: 'Modern College of Professional Studies, Ghaziabad',
    period: 'Currently Pursuing · 3rd Semester',
    description: 'Studying core computer science concepts, software development, database management, and web technologies. Building academic knowledge alongside real-world project experience.'
  }
];


/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', async () => {
  document.body.classList.add('js-loaded'); // enables reveal animations
  initPreloader();
  initCursor();
  initNavbar();
  initMobileMenu();
  initTheme();
  initTypewriter();
  initScrollReveal();
  initFilterTabs();
  initContactForm();

  const [projects, skills, experiences, profile] = await Promise.all([
    getProjects(), getSkills(), getExperiences(), getProfile()
  ]);

  if (profile) {
    applyProfileData(profile);
  }

  // If null, the API failed/is unreachable -> use fallback data
  // If array (even empty), API succeeded -> use the array
  renderProjects(projects?.length ? projects : FALLBACK_PROJECTS);
  renderSkills(skills?.length ? skills : FALLBACK_SKILLS);
  renderExperiences(experiences?.length ? experiences : FALLBACK_EXPERIENCES);

  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // Small delay so DOM paints before we observe
  setTimeout(() => {
    initScrollReveal();
    initCounters();
  }, 100);
});

/* ─── APPLY PROFILE DATA ─── */
function applyProfileData(profile) {
  if (profile.bio) {
    const bioEl = document.querySelector('.about-lead');
    if (bioEl) bioEl.textContent = profile.bio;
  }
  if (profile.email) {
    document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
      el.href = `mailto:${profile.email}`;
      if (el.textContent.includes('@')) el.textContent = profile.email;
    });
  }
  if (profile.phone) {
    document.querySelectorAll('a[href^="tel:"]').forEach(el => {
      el.href = `tel:${profile.phone.replace(/[^0-9+]/g, '')}`;
      if (el.textContent.includes('+')) el.textContent = profile.phone;
    });
  }
  if (profile.github_url) {
    document.querySelectorAll('.soc-icon .fa-github, .ci-soc .fa-github').forEach(icon => {
      const anchor = icon.closest('a');
      if (anchor) anchor.href = profile.github_url;
    });
  }
  if (profile.linkedin_url) {
    document.querySelectorAll('.soc-icon .fa-linkedin-in, .ci-soc .fa-linkedin').forEach(icon => {
      const anchor = icon.closest('a');
      if (anchor) anchor.href = profile.linkedin_url;
    });
  }
}

/* ─── PRELOADER ─── */
function initPreloader() {
  const el = document.getElementById('preloader');
  if (!el) return;
  // Force hide after 1.5s — never block on missing images or slow fonts
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.visibility = 'hidden';
    el.style.pointerEvents = 'none';
  }, 1500);
}

/* ─── CUSTOM CURSOR ─── */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  // Hide until first mouse move so they don't start at 0,0
  dot.style.opacity  = '0';
  ring.style.opacity = '0';

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    // Dot snaps instantly
    dot.style.left    = mx + 'px';
    dot.style.top     = my + 'px';
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  // Ring smoothly follows using RAF
  (function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  // Grow ring on interactive elements
  document.querySelectorAll('a, button, .filter-btn, .project-card, .sc-pill').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

/* ─── NAVBAR ─── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('[data-nav]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => obs.observe(s));

  // Smooth close mobile menu on nav click
  document.querySelectorAll('[data-nav]').forEach(l => {
    l.addEventListener('click', () => closeMobileMenu());
  });
}

/* ─── MOBILE MENU ─── */
let menuOpen = false;
function initMobileMenu() {
  const btn  = document.getElementById('burger');
  const menu = document.getElementById('mobMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => menuOpen ? closeMobileMenu() : openMobileMenu());
  menu.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMobileMenu));
}
function openMobileMenu() {
  menuOpen = true;
  document.getElementById('burger').classList.add('open');
  document.getElementById('mobMenu').classList.add('open');
  document.body.classList.add('locked');
}
function closeMobileMenu() {
  menuOpen = false;
  document.getElementById('burger')?.classList.remove('open');
  document.getElementById('mobMenu')?.classList.remove('open');
  document.body.classList.remove('locked');
}

/* ─── THEME ─── */
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  const icon = document.getElementById('themeIcon');
  if (icon) { icon.className = t === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'; }
}

/* ─── TYPEWRITER ─── */
function initTypewriter() {
  const el     = document.getElementById('typedText');
  if (!el) return;
  const words  = ['Web Apps', 'Websites', 'APIs', 'Interfaces', 'Solutions'];
  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!deleting && ci > word.length)    { deleting = true; setTimeout(tick, 1400); return; }
    if (deleting  && ci < 0)             { deleting = false; wi = (wi + 1) % words.length; ci = 0; }
    setTimeout(tick, deleting ? 60 : 110);
  }
  tick();
}

/* ─── SCROLL REVEAL ─── */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.project-card,.skill-cat,.tl-item');
  if (!targets.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.05 });
  targets.forEach(t => {
    // If already in viewport (e.g. page was scrolled or section is near top), show immediately
    const rect = t.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      t.classList.add('in');
    } else {
      obs.observe(t);
    }
  });
}

/* ─── COUNTER ─── */
function initCounters() {
  const nums = document.querySelectorAll('.stat-n[data-count]');
  if (!nums.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = +el.dataset.count;
      let cur   = 0;
      const step = end / 60;
      const iv = setInterval(() => {
        cur = Math.min(cur + step, end);
        el.textContent = Math.floor(cur);
        if (cur >= end) clearInterval(iv);
      }, 16);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => obs.observe(n));
}

/* ─── FILTER TABS ─── */
function initFilterTabs() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        const show = f === 'all' || card.dataset.category === f;
        card.style.display = show ? '' : 'none';
        if (show) { card.classList.remove('in'); requestAnimationFrame(() => card.classList.add('in')); }
      });
    });
  });
}

/* ─── RENDER PROJECTS ─── */
function renderProjects(projects) {
  const c = document.getElementById('projectsContainer');
  if (!c) return;
  c.innerHTML = '';
  projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', p.category || 'web');

    const coverWrap = document.createElement('div');
    coverWrap.className = 'pc-cover-wrap';
    const coverFb = document.createElement('div');
    coverFb.className = 'pc-cover-fb';
    coverFb.textContent = p.icon || (p.category === 'web' ? '⚡' : p.category === 'design' ? '🎨' : '🗂️');
    const imageUrl = p.image_url || p.image;
    if (imageUrl) {
      const cover = document.createElement('img');
      cover.className = 'pc-cover';
      cover.src = imageUrl;
      cover.alt = `${p.title} project preview`;
      cover.loading = 'lazy';
      cover.addEventListener('error', () => cover.replaceWith(coverFb), { once: true });
      coverWrap.appendChild(cover);
    } else {
      coverWrap.appendChild(coverFb);
    }
    card.appendChild(coverWrap);

    const body = document.createElement('div');
    body.className = 'pc-body';

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'pc-tags';
    (p.tags || []).forEach(t => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'pc-tag';
      tagSpan.textContent = t;
      tagsDiv.appendChild(tagSpan);
    });
    body.appendChild(tagsDiv);

    const titleEl = document.createElement('h3');
    titleEl.className = 'pc-title';
    titleEl.textContent = p.title;
    body.appendChild(titleEl);

    const descEl = document.createElement('p');
    descEl.className = 'pc-desc';
    descEl.textContent = p.description;
    body.appendChild(descEl);

    const linksDiv = document.createElement('div');
    linksDiv.className = 'pc-links';
    if (p.github_url) {
      const githubLink = document.createElement('a');
      githubLink.href = p.github_url;
      githubLink.className = 'pc-link primary';
      githubLink.target = '_blank';
      githubLink.rel = 'noopener noreferrer';
      const icon = document.createElement('i');
      icon.className = 'fa-brands fa-github';
      githubLink.appendChild(icon);
      githubLink.appendChild(document.createTextNode(' GitHub'));
      linksDiv.appendChild(githubLink);
    }
    if (p.live_url) {
      const liveLink = document.createElement('a');
      liveLink.href = p.live_url;
      liveLink.className = 'pc-link ghost';
      liveLink.target = '_blank';
      liveLink.rel = 'noopener noreferrer';
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-arrow-up-right-from-square';
      liveLink.appendChild(icon);
      liveLink.appendChild(document.createTextNode(' Live'));
      linksDiv.appendChild(liveLink);
    }
    body.appendChild(linksDiv);
    card.appendChild(body);
    c.appendChild(card);
  });

  const availableCategories = new Set(projects.map(project => project.category || 'web'));
  document.querySelectorAll('.filter-btn[data-filter]').forEach(button => {
    const filter = button.dataset.filter;
    button.hidden = filter !== 'all' && !availableCategories.has(filter);
  });
  initScrollReveal();
}

/* ─── RENDER SKILLS ─── */
function renderSkills(skills) {
  const c = document.getElementById('skillsContainer');
  if (!c) return;
  c.innerHTML = '';
  skills.forEach(cat => {
    const catDiv = document.createElement('div');
    catDiv.className = 'skill-cat';

    const headDiv = document.createElement('div');
    headDiv.className = 'sc-head';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'sc-icon';
    iconDiv.textContent = cat.icon || '🔧';

    const nameDiv = document.createElement('div');
    nameDiv.className = 'sc-name';
    nameDiv.textContent = cat.category || cat.name;

    headDiv.appendChild(iconDiv);
    headDiv.appendChild(nameDiv);
    catDiv.appendChild(headDiv);

    const pillsDiv = document.createElement('div');
    pillsDiv.className = 'sc-pills';
    const skillsList = cat.skills || [cat.name];
    skillsList.forEach(s => {
      const pillSpan = document.createElement('span');
      pillSpan.className = 'sc-pill';
      pillSpan.textContent = s.name || s;
      pillsDiv.appendChild(pillSpan);
    });
    catDiv.appendChild(pillsDiv);

    c.appendChild(catDiv);
  });
  initScrollReveal();
}

/* ─── RENDER EXPERIENCE ─── */
function renderExperiences(exp) {
  const c = document.getElementById('experienceContainer');
  if (!c) return;
  c.innerHTML = '';
  exp.forEach(e => {
    const item = document.createElement('div');
    item.className = 'tl-item';

    const dot = document.createElement('div');
    dot.className = 'tl-dot';
    item.appendChild(dot);

    const date = document.createElement('div');
    date.className = 'tl-date';
    date.textContent = e.period || '';
    item.appendChild(date);

    const title = document.createElement('div');
    title.className = 'tl-title';
    title.textContent = e.title;
    item.appendChild(title);

    const co = document.createElement('div');
    co.className = 'tl-co';
    co.textContent = e.company;
    item.appendChild(co);

    const desc = document.createElement('p');
    desc.className = 'tl-desc';
    desc.textContent = e.description;
    item.appendChild(desc);

    c.appendChild(item);
  });
  initScrollReveal();
}

/* ─── CONTACT FORM ─── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const msg  = document.getElementById('formMessage');
  const btn  = document.getElementById('submitBtn');
  if (!form) return;

  // Client-side validation helper
  function validateForm() {
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      showMsg('error', '\u26a0 Please enter your full name.');
      form.name.focus();
      return false;
    }
    if (!email) {
      showMsg('error', '\u26a0 Please enter your email address.');
      form.email.focus();
      return false;
    }
    if (!emailRx.test(email)) {
      showMsg('error', '\u26a0 Please enter a valid email address (e.g. name@example.com).');
      form.email.focus();
      return false;
    }
    if (!message || message.length < 10) {
      showMsg('error', '\u26a0 Please enter a message (at least 10 characters).');
      form.message.focus();
      return false;
    }
    return true;
  }

  function showMsg(type, text) {
    msg.textContent = text;
    msg.className   = 'form-feedback ' + type;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    showMsg('', '');

    if (!validateForm()) return; // Stop if validation fails

    btn.classList.add('btn-loading');

    const data = {
      name:    form.name.value.trim(),
      email:   form.email.value.trim(),
      phone:   form.phone?.value.trim(),
      message: form.message.value.trim()
    };

    const result = await submitContact(data);
    btn.classList.remove('btn-loading');

    if (result && result.success) {
      showMsg('success', "\u2713 Message received! I'll get back to you within 24 hours.");
      form.reset();
    } else {
      showMsg('error', '\u2717 Could not send message — please email sonukumar4533n@gmail.com directly.');
    }
  });

  // Clear feedback when user starts typing again
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => { msg.className = 'form-feedback'; });
  });
}
