/**
 * seed.js — Populates the SQLite database with Sonu Kumar's real portfolio data
 * Run: node seed.js
 */
const db = require('./database');

console.log('🌱 Seeding database with real portfolio data...\n');

// Clear existing data first
db.serialize(() => {
  db.run('DELETE FROM projects');
  db.run('DELETE FROM skills');
  db.run('DELETE FROM experiences');

  // ── PROJECTS ──────────────────────────────────────────────────────
  const projectStmt = db.prepare(
    'INSERT INTO projects (title, description, tags, github_url, live_url) VALUES (?, ?, ?, ?, ?)'
  );

  projectStmt.run(
    'SarvadaaPower Corporate Website',
    'Fully responsive corporate website achieving 100% compatibility across all devices. Lighthouse Score 94/100 (Desktop), 92/100 (Mobile). Integrated smooth scrolling, form validation, SEO optimization with meta tags & semantic HTML, and WebP image lazy loading reducing load time by 40%.',
    JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Bootstrap']),
    '',
    'https://sarvadaapower.in'
  );

  projectStmt.run(
    'E-Commerce Product Listing Platform',
    'Full-stack e-commerce app with 8+ reusable React components, product filtering/sorting/search, shopping cart (Context API), JWT authentication, and 15+ REST API endpoints with MySQL. Achieved API response time < 200ms and 50% faster DB lookups via query optimization.',
    JSON.stringify(['React.js', 'Node.js', 'Express.js', 'MySQL', 'JWT']),
    'https://github.com/sonuk4533N',
    ''
  );

  projectStmt.run(
    'Freelance Client Websites',
    'Developed and deployed 3+ client websites across e-commerce, service-based, and portfolio industries. 100% client satisfaction. Average turnaround: 20-30 days with post-launch support.',
    JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Responsive Design']),
    'https://github.com/sonuk4533N',
    ''
  );

  projectStmt.finalize();
  console.log('✅ Projects seeded (3 records)');

  // ── SKILLS ────────────────────────────────────────────────────────
  const skillStmt = db.prepare(
    'INSERT INTO skills (name, category, proficiency) VALUES (?, ?, ?)'
  );

  const skills = [
    // Front-End
    ['HTML5', 'Front-End', 95], ['CSS3', 'Front-End', 90],
    ['JavaScript (ES6+)', 'Front-End', 85], ['React.js', 'Front-End', 82],
    ['Angular JS', 'Front-End', 75], ['Bootstrap', 'Front-End', 90],
    ['Tailwind CSS', 'Front-End', 80], ['Responsive Design', 'Front-End', 92],
    // Back-End
    ['Node.js', 'Back-End', 80], ['Express.js', 'Back-End', 80],
    ['PHP', 'Back-End', 72], ['MySQL', 'Back-End', 78],
    ['REST API Development', 'Back-End', 85], ['JWT Authentication', 'Back-End', 80],
    ['Database Design', 'Back-End', 75],
    // Tools
    ['Git', 'Developer Tools', 88], ['GitHub', 'Developer Tools', 88],
    ['VS Code', 'Developer Tools', 95], ['Postman', 'Developer Tools', 85],
    ['Chrome DevTools', 'Developer Tools', 88], ['npm / yarn', 'Developer Tools', 85],
    // Design
    ['Figma', 'Design Tools', 70], ['Adobe XD', 'Design Tools', 65],
  ];

  skills.forEach(([name, category, proficiency]) => {
    skillStmt.run(name, category, proficiency);
  });

  skillStmt.finalize();
  console.log('✅ Skills seeded (23 records)');

  // ── EXPERIENCES ───────────────────────────────────────────────────
  const expStmt = db.prepare(
    'INSERT INTO experiences (title, company, description, period, type) VALUES (?, ?, ?, ?, ?)'
  );

  expStmt.run(
    'Freelance Web Developer',
    'Self-Employed',
    'Developing and deploying 3+ client websites across e-commerce, service-based, and portfolio industries. Delivering projects with 100% client satisfaction. Managing full development lifecycle from requirements gathering to deployment and maintenance. Average project turnaround: 20-30 days.',
    '2024 – Present',
    'Work'
  );

  expStmt.run(
    'Full Stack Web Development Training',
    'Arth Institute, Laxmi Nagar',
    'Comprehensive 120-hour training in front-end and back-end technologies with hands-on projects. Covered HTML5, CSS3, JavaScript, React.js, Node.js, Express.js, MySQL, Git, and deployment workflows.',
    'Completed 2024',
    'Education'
  );

  expStmt.run(
    'Git & GitHub Mastery',
    'Apna College (Self-paced)',
    'Version control fundamentals, branching strategies, merge conflicts, pull requests, and collaborative workflows. Applied learnings across all personal and freelance projects.',
    'Completed 2024',
    'Education'
  );

  expStmt.run(
    'Bachelor of Computer Application (BCA)',
    'Modern College of Professional Studies, Ghaziabad',
    'Studying core computer science concepts, software development, database management, and web technologies. Currently in 3rd Semester.',
    'Currently Pursuing',
    'Education'
  );

  expStmt.finalize();
  console.log('✅ Experiences seeded (4 records)');

  console.log('\n🎉 Database seeded successfully!');
  console.log('   Run: node server.js   →   http://localhost:5000/api/health\n');
});
