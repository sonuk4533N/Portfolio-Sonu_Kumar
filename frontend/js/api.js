const API_URL = '/api';

async function getProjects() {
  try {
    const res = await fetch(`${API_URL}/projects`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Error fetching projects:', err);
    return null;
  }
}

async function getProfile() {
  try {
    const res = await fetch(`${API_URL}/profile`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching profile:', err);
    return null;
  }
}

async function getSkills() {
  try {
    const res = await fetch(`${API_URL}/skills`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Error fetching skills:', err);
    return null;
  }
}

async function getExperiences() {
  try {
    const res = await fetch(`${API_URL}/experiences`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Error fetching experiences:', err);
    return null;
  }
}

async function submitContact(data) {
  try {
    const res = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.error('Error submitting contact:', err);
    return { error: err.message };
  }
}
