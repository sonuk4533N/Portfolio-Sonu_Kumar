const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      tags TEXT,
      category TEXT DEFAULT 'web',
      image_url TEXT,
      github_url TEXT,
      live_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY,
      bio TEXT,
      email TEXT,
      phone TEXT,
      github_url TEXT,
      linkedin_url TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      proficiency INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT,
      description TEXT,
      period TEXT,
      type TEXT DEFAULT 'Work',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Safe, repeatable migrations for databases created by older versions.
  db.run("ALTER TABLE projects ADD COLUMN category TEXT DEFAULT 'web'", () => {});
  db.run("ALTER TABLE experiences ADD COLUMN type TEXT DEFAULT 'Work'", () => {});
  db.run("UPDATE projects SET category = 'web' WHERE category IS NULL OR TRIM(category) = ''");
  db.run(
    `UPDATE projects
     SET title = 'Personal Portfolio Website',
         description = 'Professional portfolio website showcasing projects, technical skills, and work history with smooth navigation and responsive design.',
         tags = '["HTML5","CSS3","JavaScript","Node.js","Express","SQLite"]',
         category = 'design',
         github_url = 'https://github.com/sonuk4533N'
     WHERE LOWER(title) = 'portfolio website'
       AND (description IS NULL OR LOWER(description) = 'personal website')`
  );
  db.run(
    `INSERT INTO projects (title, description, tags, category, image_url, github_url, live_url)
     SELECT ?, ?, ?, ?, NULL, ?, ?
     WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = ?)`,
    [
      'SarvadaaPower Corporate Website',
      'Professional responsive website for an energy solutions company, serving as its primary online presence and lead-generation channel.',
      '["HTML5","CSS3","JavaScript","Bootstrap","Responsive Design","SEO"]',
      'web',
      null,
      'https://sarvadaapower.in',
      'SarvadaaPower Corporate Website'
    ]
  );
  db.run(
    `INSERT INTO projects (title, description, tags, category, image_url, github_url, live_url)
     SELECT ?, ?, ?, ?, NULL, ?, NULL
     WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = ?)`,
    [
      'E-Commerce Product Listing Platform',
      'Full-stack e-commerce platform with product filtering, search, cart state, REST APIs, MySQL persistence, and secure authentication.',
      '["React.js","Node.js","Express.js","MySQL","JWT","REST API"]',
      'web',
      'https://github.com/sonuk4533N',
      'E-Commerce Product Listing Platform'
    ]
  );
  db.run(
    `INSERT INTO projects (title, description, tags, category, image_url, github_url, live_url)
     SELECT ?, ?, ?, ?, NULL, ?, NULL
     WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = ?)`,
    [
      'Freelance Client Websites',
      'Developed and deployed client websites across e-commerce, service-based, and portfolio use cases with responsive, maintainable implementations.',
      '["Responsive Design","JavaScript","Deployment","Client Delivery"]',
      'design',
      'https://github.com/sonuk4533N',
      'Freelance Client Websites'
    ]
  );
  db.run("UPDATE skills SET category = 'Front-End' WHERE category = 'Frontend'");
  db.run("UPDATE skills SET category = 'Back-End' WHERE category = 'Backend'");
  db.run("UPDATE skills SET category = 'Developer Tools' WHERE category = 'Tools'");
  db.run(`
    UPDATE experiences
    SET type = 'Education'
    WHERE type = 'Work'
      AND (
        LOWER(title) LIKE '%training%'
        OR LOWER(title) LIKE '%mastery%'
        OR LOWER(title) LIKE '%bachelor%'
        OR LOWER(title) LIKE '%degree%'
        OR LOWER(title) LIKE '%course%'
        OR LOWER(title) LIKE '%certif%'
      )
  `);

  db.run(
    `INSERT OR IGNORE INTO profile
      (id, bio, email, phone, github_url, linkedin_url)
     VALUES (1, ?, ?, ?, ?, ?)`,
    [
      'Full Stack Developer building responsive, scalable web applications with modern technologies - passionate about clean code and high-performance user experiences.',
      'sonukumar4533n@gmail.com',
      '+91-9667474437',
      'https://github.com/sonuk4533N',
      'https://www.linkedin.com/in/sonukumar45'
    ]
  );

  db.run('CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at)');
  db.run('CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category)');
  db.run('CREATE INDEX IF NOT EXISTS idx_experiences_created_at ON experiences(created_at)');
  db.run('CREATE INDEX IF NOT EXISTS idx_contact_messages_read_created ON contact_messages(is_read, created_at)');
  db.run('PRAGMA optimize');
});

module.exports = db;
