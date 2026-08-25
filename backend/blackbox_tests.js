const fs = require('fs');
const path = require('path');

const testDatabase = path.join(__dirname, '..', 'tmp', 'portfolio-api-test.sqlite');
fs.mkdirSync(path.dirname(testDatabase), { recursive: true });
fs.rmSync(testDatabase, { force: true });

process.env.NODE_ENV = 'test';
process.env.ADMIN_PASSWORD = 'portfolio-test-password';
process.env.EMAIL_ENABLED = 'false';
process.env.DATABASE_PATH = testDatabase;
process.env.CORS_ORIGIN = 'http://localhost:5000';

const { startServer } = require('./server');
const db = require('./database');

let passed = 0;
let failed = 0;
let baseUrl = '';
let sessionCookie = '';

function check(condition, description, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`PASS  ${description}`);
    return;
  }
  failed += 1;
  console.error(`FAIL  ${description}${detail ? ` - ${detail}` : ''}`);
}

async function request(method, pathName, { body, cookie, headers = {}, rawBody } = {}) {
  const options = { method, headers: { Accept: 'application/json', ...headers } };
  if (cookie) options.headers.Cookie = cookie;
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  } else if (rawBody !== undefined) {
    options.body = rawBody;
  }
  const response = await fetch(`${baseUrl}${pathName}`, options);
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

async function run() {
  const server = startServer(0);
  await new Promise(resolve => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}/api`;

  try {
    let result = await request('GET', '/health');
    check(result.response.status === 200 && result.data.status === 'OK', 'health endpoint is available');

    result = await request('GET', '/contact/messages');
    check(result.response.status === 401, 'protected endpoint rejects anonymous access');

    result = await request('POST', '/auth/login', { body: { password: 'wrong-password' } });
    check(result.response.status === 401, 'login rejects an incorrect password');

    result = await request('POST', '/auth/login', { body: { password: process.env.ADMIN_PASSWORD } });
    sessionCookie = (result.response.headers.get('set-cookie') || '').split(';')[0];
    check(result.response.status === 200 && Boolean(sessionCookie), 'login creates an HttpOnly-backed session');

    result = await request('GET', '/auth/session', { cookie: sessionCookie });
    check(result.data.authenticated === true, 'session endpoint recognizes the admin session');

    const profile = {
      bio: 'Test profile bio',
      email: 'admin@example.com',
      phone: '+91 99999 99999',
      github_url: 'https://github.com/example',
      linkedin_url: 'https://linkedin.com/in/example'
    };
    result = await request('PUT', '/profile', { body: profile, cookie: sessionCookie });
    check(result.response.status === 200 && result.data.success, 'profile can be updated');
    result = await request('GET', '/profile');
    check(result.data.email === profile.email, 'updated profile is returned publicly');

    result = await request('POST', '/projects', {
      cookie: sessionCookie,
      body: {
        title: 'Test Project',
        description: 'Initial project description',
        tags: ['Node.js', 'SQLite'],
        category: 'web',
        image_url: 'https://example.com/project.jpg',
        github_url: 'https://github.com/example/project',
        live_url: 'https://example.com'
      }
    });
    const projectId = result.data.id;
    check(result.response.status === 200 && Number.isInteger(projectId), 'project can be created');
    result = await request('PUT', `/projects/${projectId}`, {
      cookie: sessionCookie,
      body: {
        title: 'Updated Project',
        description: 'Updated project description',
        tags: ['Express'],
        category: 'design',
        image_url: '',
        github_url: '',
        live_url: ''
      }
    });
    check(result.response.status === 200 && result.data.success, 'project can be edited');
    result = await request('GET', '/projects');
    check(result.data.some(project => project.id === projectId && project.category === 'design'), 'project edits persist');

    result = await request('POST', '/skills', {
      cookie: sessionCookie,
      body: { name: 'Test Skill', category: 'Frontend', proficiency: 4 }
    });
    const skillId = result.data.id;
    check(result.response.status === 200 && Number.isInteger(skillId), 'skill can be created with a normalized category');
    result = await request('PUT', `/skills/${skillId}`, {
      cookie: sessionCookie,
      body: { name: 'Updated Skill', category: 'Developer Tools', proficiency: 5 }
    });
    check(result.response.status === 200 && result.data.success, 'skill can be edited');
    result = await request('GET', '/skills');
    check(result.data.some(group => group.category === 'Developer Tools' && group.skills.some(skill => skill.id === skillId)), 'skill grouping remains consistent');

    result = await request('POST', '/experiences', {
      cookie: sessionCookie,
      body: { title: 'Test Degree', company: 'Test College', period: '2024 - 2026', type: 'Education', description: 'Coursework' }
    });
    const experienceId = result.data.id;
    check(result.response.status === 200 && Number.isInteger(experienceId), 'experience can be created');
    result = await request('PUT', `/experiences/${experienceId}`, {
      cookie: sessionCookie,
      body: { title: 'Updated Degree', company: 'Test College', period: '2024 - 2026', type: 'Education', description: 'Updated coursework' }
    });
    check(result.response.status === 200 && result.data.success, 'experience can be edited');

    result = await request('POST', '/contact', { body: { name: '', email: 'bad', message: '' } });
    check(result.response.status === 400, 'contact form rejects invalid submissions');
    result = await request('POST', '/contact', {
      body: { name: 'Test Sender', email: 'sender@example.com', phone: '+91 90000 00000', message: 'This is a valid test message.' }
    });
    const messageId = result.data.message_id;
    check(result.response.status === 200 && result.data.success && result.data.warning, 'contact message is saved when email delivery is unavailable');
    result = await request('PATCH', `/contact/messages/${messageId}/read`, {
      cookie: sessionCookie,
      body: { is_read: true }
    });
    check(result.response.status === 200 && result.data.is_read === true, 'message can be marked as read');

    result = await request('POST', '/contact', {
      rawBody: '{"name":"Test"}',
      headers: { 'Content-Type': 'text/plain' }
    });
    check(result.response.status === 415, 'unsupported request content type is rejected cleanly');

    result = await request('GET', '/health', { headers: { Origin: 'https://not-allowed.example' } });
    check(result.response.status === 403, 'CORS rejects an unapproved origin');

    await request('DELETE', `/projects/${projectId}`, { cookie: sessionCookie });
    await request('DELETE', `/skills/${skillId}`, { cookie: sessionCookie });
    await request('DELETE', `/experiences/${experienceId}`, { cookie: sessionCookie });
    await request('DELETE', `/contact/messages/${messageId}`, { cookie: sessionCookie });

    result = await request('POST', '/auth/logout', { body: {}, cookie: sessionCookie });
    check(result.response.status === 200 && result.data.success, 'logout invalidates the admin session');
    result = await request('GET', '/contact/messages', { cookie: sessionCookie });
    check(result.response.status === 401, 'logged-out session cannot access protected data');
  } finally {
    await new Promise(resolve => server.close(resolve));
    await new Promise(resolve => db.close(resolve));
    fs.rmSync(testDatabase, { force: true });
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exitCode = 1;
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
