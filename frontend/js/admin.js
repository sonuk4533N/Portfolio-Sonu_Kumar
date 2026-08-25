const API_BASE = '/api';

let toastTimer = null;
let projectEditingId = null;
let skillEditingId = null;
let experienceEditingId = null;
const projectCache = new Map();
const skillCache = new Map();
const experienceCache = new Map();

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  clearTimeout(toastTimer);
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  toast.textContent = `${icons[type] || ''} ${message}`;
  toast.className = `toast ${type} show`;
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

async function apiCall(method, path, body) {
  const options = {
    method,
    credentials: 'same-origin',
    headers: { Accept: 'application/json' }
  };
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, options);
    const data = response.status === 204 ? {} : await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    return { ok: false, status: 0, data: { error: error.message } };
  }
}

function setLoginError(message = '') {
  const error = document.getElementById('loginError');
  if (error) error.textContent = message;
}

function showLogin(message = '') {
  document.getElementById('loginSection').style.display = 'flex';
  document.getElementById('adminDashboard').style.display = 'none';
  setLoginError(message);
}

function showDashboard() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'flex';
  setLoginError('');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('adminPassword')?.addEventListener('keydown', event => {
    if (event.key === 'Enter') loginAdmin();
  });

  document.getElementById('profileForm')?.addEventListener('submit', saveProfile);
  document.getElementById('projectForm')?.addEventListener('submit', saveProject);
  document.getElementById('skillForm')?.addEventListener('submit', saveSkill);
  document.getElementById('experienceForm')?.addEventListener('submit', saveExperience);

  verifySessionAndLoad();
});

async function verifySessionAndLoad() {
  const result = await apiCall('GET', '/auth/session');
  if (result.ok && result.data.authenticated) {
    showDashboard();
    await loadAdminData();
    return;
  }
  showLogin(result.status === 0 ? 'Cannot reach the server. Please try again.' : '');
}

function toggleEye() {
  const input = document.getElementById('adminPassword');
  const icon = document.getElementById('eyeIcon');
  if (!input || !icon) return;
  const reveal = input.type === 'password';
  input.type = reveal ? 'text' : 'password';
  icon.className = reveal ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
}

async function loginAdmin() {
  const passwordInput = document.getElementById('adminPassword');
  const button = document.getElementById('loginBtn');
  const password = passwordInput?.value || '';

  if (!password) {
    setLoginError('Please enter a password.');
    return;
  }

  button.disabled = true;
  button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying…';
  setLoginError('');

  const result = await apiCall('POST', '/auth/login', { password });
  if (result.ok) {
    passwordInput.value = '';
    showDashboard();
    await loadAdminData();
    showToast('Welcome back, Admin!', 'success');
  } else {
    const fallback = result.status === 429
      ? 'Too many attempts. Please wait before trying again.'
      : result.status === 0
        ? 'Cannot reach the server. Is the backend running?'
        : result.data?.error || 'Login failed.';
    setLoginError(fallback);
    showToast(fallback, 'error');
  }

  button.disabled = false;
  button.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In';
}

async function logoutAdmin() {
  await apiCall('POST', '/auth/logout', {});
  cancelProjectEdit();
  cancelSkillEdit();
  cancelExperienceEdit();
  showLogin('');
  showToast('Logged out successfully', 'info');
}

function showTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active-tab'));
  document.querySelectorAll('.nav-btn').forEach(button => button.classList.remove('active'));
  document.getElementById(`${tabName}Tab`)?.classList.add('active-tab');
  document.querySelector(`.nav-btn[data-tab="${tabName}"]`)?.classList.add('active');

  const labels = {
    profile: 'Profile',
    projects: 'Projects',
    skills: 'Skills',
    experience: 'Experience',
    messages: 'Messages'
  };
  const breadcrumb = document.getElementById('breadcrumbLabel');
  if (breadcrumb) breadcrumb.textContent = labels[tabName] || tabName;
  if (window.innerWidth <= 768) closeSidebar();
}

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
}

async function loadAdminData() {
  showTab('profile');
  await Promise.all([loadProfile(), loadProjects(), loadSkills(), loadExperiences(), loadMessages()]);
}

async function saveProfile(event) {
  event.preventDefault();
  const profile = {
    bio: document.getElementById('bio')?.value.trim(),
    email: document.getElementById('email')?.value.trim(),
    phone: document.getElementById('phone')?.value.trim(),
    github_url: document.getElementById('github')?.value.trim(),
    linkedin_url: document.getElementById('linkedin')?.value.trim()
  };
  const result = await apiCall('PUT', '/profile', profile);
  handleSaveResult(result, 'Profile saved successfully!');
}

async function saveProject(event) {
  event.preventDefault();
  const title = document.getElementById('projectTitle')?.value.trim();
  if (!title) return showToast('Project title is required', 'error');

  const project = {
    title,
    description: document.getElementById('projectDesc')?.value.trim(),
    tags: (document.getElementById('projectTags')?.value || '').split(',').map(tag => tag.trim()).filter(Boolean),
    category: document.getElementById('projectCategory')?.value || 'web',
    image_url: document.getElementById('projectImage')?.value.trim(),
    github_url: document.getElementById('projectGithub')?.value.trim(),
    live_url: document.getElementById('projectLive')?.value.trim()
  };
  const method = projectEditingId ? 'PUT' : 'POST';
  const path = projectEditingId ? `/projects/${projectEditingId}` : '/projects';
  const result = await apiCall(method, path, project);
  if (!handleSaveResult(result, projectEditingId ? 'Project updated!' : `Project "${title}" added!`)) return;
  cancelProjectEdit();
  await loadProjects();
}

async function saveSkill(event) {
  event.preventDefault();
  const name = document.getElementById('skillName')?.value.trim();
  if (!name) return showToast('Skill name is required', 'error');
  const skill = { name, category: document.getElementById('skillCategory')?.value || 'Other' };
  const method = skillEditingId ? 'PUT' : 'POST';
  const path = skillEditingId ? `/skills/${skillEditingId}` : '/skills';
  const result = await apiCall(method, path, skill);
  if (!handleSaveResult(result, skillEditingId ? 'Skill updated!' : `Skill "${name}" added!`)) return;
  cancelSkillEdit();
  await loadSkills();
}

async function saveExperience(event) {
  event.preventDefault();
  const title = document.getElementById('expTitle')?.value.trim();
  if (!title) return showToast('Role or degree is required', 'error');
  const experience = {
    title,
    company: document.getElementById('expCompany')?.value.trim(),
    period: document.getElementById('expDate')?.value.trim(),
    type: document.getElementById('expType')?.value || 'Work',
    description: document.getElementById('expDesc')?.value.trim()
  };
  const method = experienceEditingId ? 'PUT' : 'POST';
  const path = experienceEditingId ? `/experiences/${experienceEditingId}` : '/experiences';
  const result = await apiCall(method, path, experience);
  if (!handleSaveResult(result, experienceEditingId ? 'Entry updated!' : 'Experience entry added!')) return;
  cancelExperienceEdit();
  await loadExperiences();
}

function handleSaveResult(result, successMessage) {
  if (result.ok) {
    showToast(successMessage, 'success');
    return true;
  }
  if (result.status === 401) showLogin('Your session expired. Please sign in again.');
  showToast(result.data?.error || 'Unable to save changes', 'error');
  return false;
}

async function loadProfile() {
  const result = await apiCall('GET', '/profile');
  if (!result.ok) return;
  const profile = result.data || {};
  document.getElementById('bio').value = profile.bio || '';
  document.getElementById('email').value = profile.email || '';
  document.getElementById('phone').value = profile.phone || '';
  document.getElementById('github').value = profile.github_url || '';
  document.getElementById('linkedin').value = profile.linkedin_url || '';
}

async function loadProjects() {
  const container = document.getElementById('projectsList');
  const result = await apiCall('GET', '/projects');
  if (!container) return;
  if (!result.ok) return renderLoadError(container, result);

  container.replaceChildren();
  projectCache.clear();
  if (!result.data.length) return renderEmpty(container, 'fa-solid fa-code-branch', 'No projects yet. Add one above.');

  result.data.forEach(project => {
    projectCache.set(project.id, project);
    addItemCard(container, {
      title: project.title,
      meta: categoryLabel(project.category),
      tags: project.tags,
      description: project.description,
      links: [
        project.image_url ? { href: project.image_url, iconClass: 'fa-regular fa-image', text: 'Image' } : null,
        project.github_url ? { href: project.github_url, iconClass: 'fa-brands fa-github', text: 'GitHub' } : null,
        project.live_url ? { href: project.live_url, iconClass: 'fa-solid fa-arrow-up-right-from-square', text: 'Live' } : null
      ].filter(Boolean),
      onEdit: () => editProject(project.id),
      onRemove: () => removeItem('/projects', project.id, 'project', loadProjects)
    });
  });
}

async function loadSkills() {
  const container = document.getElementById('skillsList');
  const result = await apiCall('GET', '/skills');
  if (!container) return;
  if (!result.ok) return renderLoadError(container, result);

  container.replaceChildren();
  skillCache.clear();
  if (!result.data.length) return renderEmpty(container, 'fa-solid fa-layer-group', 'No skills yet. Add one above.');

  result.data.forEach(group => group.skills.forEach(skill => {
    const data = { ...skill, category: group.category };
    skillCache.set(skill.id, data);
    addItemCard(container, {
      title: skill.name,
      meta: group.category,
      onEdit: () => editSkill(skill.id),
      onRemove: () => removeItem('/skills', skill.id, 'skill', loadSkills)
    });
  }));
}

async function loadExperiences() {
  const container = document.getElementById('experienceList');
  const result = await apiCall('GET', '/experiences');
  if (!container) return;
  if (!result.ok) return renderLoadError(container, result);

  container.replaceChildren();
  experienceCache.clear();
  if (!result.data.length) return renderEmpty(container, 'fa-solid fa-briefcase', 'No experience entries yet.');

  result.data.forEach(experience => {
    experienceCache.set(experience.id, experience);
    addItemCard(container, {
      title: experience.title,
      meta: [experience.company, experience.period, experience.type].filter(Boolean).join(' · '),
      description: experience.description,
      onEdit: () => editExperience(experience.id),
      onRemove: () => removeItem('/experiences', experience.id, 'entry', loadExperiences)
    });
  });
}

async function loadMessages() {
  const container = document.getElementById('messagesList');
  if (!container) return;
  const result = await apiCall('GET', '/contact/messages');
  if (!result.ok) return renderLoadError(container, result);

  const messages = Array.isArray(result.data) ? result.data : [];
  const unreadCount = messages.filter(message => !message.is_read).length;
  const badge = document.getElementById('msgBadge');
  badge.textContent = unreadCount;
  badge.style.display = unreadCount ? 'flex' : 'none';
  container.replaceChildren();
  if (!messages.length) return renderEmpty(container, 'fa-regular fa-envelope', 'No messages yet.');

  messages.forEach(message => container.appendChild(createMessageCard(message)));
}

function editProject(id) {
  const project = projectCache.get(id);
  if (!project) return;
  projectEditingId = id;
  document.getElementById('projectTitle').value = project.title || '';
  document.getElementById('projectTags').value = (project.tags || []).join(', ');
  document.getElementById('projectDesc').value = project.description || '';
  document.getElementById('projectGithub').value = project.github_url || '';
  document.getElementById('projectLive').value = project.live_url || '';
  document.getElementById('projectCategory').value = project.category || 'web';
  document.getElementById('projectImage').value = project.image_url || '';
  setEditMode('project', true, 'Edit Project', 'Update Project');
}

function cancelProjectEdit() {
  projectEditingId = null;
  document.getElementById('projectForm')?.reset();
  setEditMode('project', false, 'Add New Project', 'Add Project');
}

function editSkill(id) {
  const skill = skillCache.get(id);
  if (!skill) return;
  skillEditingId = id;
  document.getElementById('skillName').value = skill.name || '';
  document.getElementById('skillCategory').value = skill.category || 'Other';
  setEditMode('skill', true, 'Edit Skill', 'Update Skill');
}

function cancelSkillEdit() {
  skillEditingId = null;
  document.getElementById('skillForm')?.reset();
  setEditMode('skill', false, 'Add New Skill', 'Add Skill');
}

function editExperience(id) {
  const experience = experienceCache.get(id);
  if (!experience) return;
  experienceEditingId = id;
  document.getElementById('expTitle').value = experience.title || '';
  document.getElementById('expCompany').value = experience.company || '';
  document.getElementById('expDate').value = experience.period || '';
  document.getElementById('expType').value = experience.type || 'Work';
  document.getElementById('expDesc').value = experience.description || '';
  setEditMode('experience', true, 'Edit Entry', 'Update Entry');
}

function cancelExperienceEdit() {
  experienceEditingId = null;
  document.getElementById('experienceForm')?.reset();
  setEditMode('experience', false, 'Add Entry', 'Add Entry');
}

function setEditMode(prefix, editing, title, buttonText) {
  const titleElement = document.getElementById(`${prefix}FormTitle`);
  const submitButton = document.getElementById(`${prefix}SubmitBtn`);
  const cancelButton = document.getElementById(`${prefix}CancelBtn`);
  if (titleElement) titleElement.textContent = title;
  if (submitButton) {
    submitButton.replaceChildren();
    const icon = document.createElement('i');
    icon.className = editing ? 'fa-solid fa-floppy-disk' : 'fa-solid fa-plus';
    submitButton.append(icon, document.createTextNode(` ${buttonText}`));
  }
  if (cancelButton) cancelButton.hidden = !editing;
  if (editing) titleElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function categoryLabel(category) {
  return { web: 'Web App', mobile: 'Mobile', design: 'Design' }[category] || 'Web App';
}

function addItemCard(container, { title, meta = '', tags = [], description = '', links = [], onEdit, onRemove }) {
  const card = document.createElement('article');
  card.className = 'item-card';

  const header = document.createElement('div');
  header.className = 'item-card-header';
  const heading = document.createElement('div');
  const titleElement = document.createElement('div');
  titleElement.className = 'item-card-title';
  titleElement.textContent = title;
  heading.appendChild(titleElement);
  if (meta) {
    const metaElement = document.createElement('div');
    metaElement.className = 'item-card-meta';
    metaElement.textContent = meta;
    heading.appendChild(metaElement);
  }
  header.appendChild(heading);
  card.appendChild(header);

  if (tags.length) {
    const tagsElement = document.createElement('div');
    tagsElement.className = 'item-card-tags';
    tags.forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'item-tag';
      chip.textContent = tag;
      tagsElement.appendChild(chip);
    });
    card.appendChild(tagsElement);
  }

  if (description) {
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'item-card-desc';
    descriptionElement.textContent = description;
    card.appendChild(descriptionElement);
  }

  const actions = document.createElement('div');
  actions.className = 'item-card-actions';
  actions.appendChild(actionButton('fa-regular fa-pen-to-square', 'Edit', 'btn-ghost', onEdit));
  links.forEach(link => actions.appendChild(actionLink(link)));
  actions.appendChild(actionButton('fa-solid fa-trash-can', 'Remove', 'btn-danger', onRemove));
  card.appendChild(actions);
  container.appendChild(card);
}

function createMessageCard(message) {
  const card = document.createElement('article');
  card.className = `msg-card${message.is_read ? '' : ' unread'}`;

  const header = document.createElement('div');
  header.className = 'msg-header';
  const senderWrap = document.createElement('div');
  const sender = document.createElement('div');
  sender.className = 'msg-sender';
  sender.textContent = message.name;
  const email = document.createElement('div');
  email.className = 'msg-email';
  email.textContent = message.email;
  senderWrap.append(sender, email);
  const date = document.createElement('div');
  date.className = 'msg-date';
  date.textContent = formatSqliteDate(message.created_at);
  header.append(senderWrap, date);
  card.appendChild(header);

  if (message.phone) {
    const phone = document.createElement('div');
    phone.className = 'msg-subject';
    phone.textContent = `Phone: ${message.phone}`;
    card.appendChild(phone);
  }

  const body = document.createElement('div');
  body.className = 'msg-body';
  body.textContent = message.message;
  card.appendChild(body);

  const footer = document.createElement('div');
  footer.className = 'msg-footer';
  footer.appendChild(actionLink({
    href: `mailto:${message.email}?subject=${encodeURIComponent('Re: Your portfolio message')}`,
    iconClass: 'fa-solid fa-reply',
    text: 'Reply'
  }));
  footer.appendChild(actionButton(
    message.is_read ? 'fa-regular fa-envelope' : 'fa-regular fa-envelope-open',
    message.is_read ? 'Mark unread' : 'Mark read',
    'btn-ghost',
    () => setMessageRead(message.id, !message.is_read)
  ));
  footer.appendChild(actionButton('fa-solid fa-trash-can', 'Delete', 'btn-danger', () => deleteMessage(message.id)));
  card.appendChild(footer);
  return card;
}

function actionButton(iconClass, text, className, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  const icon = document.createElement('i');
  icon.className = iconClass;
  button.append(icon, document.createTextNode(` ${text}`));
  button.addEventListener('click', onClick);
  return button;
}

function actionLink({ href, iconClass, text }) {
  const link = document.createElement('a');
  link.href = href;
  link.target = href.startsWith('mailto:') ? '_self' : '_blank';
  link.rel = href.startsWith('mailto:') ? '' : 'noopener noreferrer';
  link.className = 'btn-ghost';
  const icon = document.createElement('i');
  icon.className = iconClass;
  link.append(icon, document.createTextNode(` ${text}`));
  return link;
}

async function removeItem(path, id, label, reload) {
  if (!window.confirm(`Are you sure you want to permanently remove this ${label}?`)) return;
  const result = await apiCall('DELETE', `${path}/${id}`);
  if (!handleSaveResult(result, `${label[0].toUpperCase()}${label.slice(1)} removed successfully`)) return;
  await reload();
}

async function setMessageRead(id, isRead) {
  const result = await apiCall('PATCH', `/contact/messages/${id}/read`, { is_read: isRead });
  if (!handleSaveResult(result, isRead ? 'Message marked as read' : 'Message marked as unread')) return;
  await loadMessages();
}

async function deleteMessage(id) {
  if (!window.confirm('Are you sure you want to delete this message?')) return;
  const result = await apiCall('DELETE', `/contact/messages/${id}`);
  if (!handleSaveResult(result, 'Message deleted successfully')) return;
  await loadMessages();
}

function renderEmpty(container, iconClass, message) {
  container.replaceChildren();
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  const icon = document.createElement('i');
  icon.className = iconClass;
  const text = document.createElement('p');
  text.textContent = message;
  empty.append(icon, text);
  container.appendChild(empty);
}

function renderLoadError(container, result) {
  if (result.status === 401) showLogin('Your session expired. Please sign in again.');
  renderEmpty(container, 'fa-solid fa-triangle-exclamation', result.data?.error || 'Unable to load data.');
}

function formatSqliteDate(value) {
  if (!value) return '';
  const normalized = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
