/**
 * Complete Resume Data - Sonu Kumar
 * Full Stack Developer | Contact: +91-9667474437 | sonukumar4533n@gmail.com
 */

const RESUME_DATA = {
  // Personal Information
  personal: {
    name: 'Sonu Kumar',
    title: 'Full Stack Developer',
    email: 'sonukumar4533n@gmail.com',
    phone: '+91-9667474437',
    location: 'Sahibabad, Uttar Pradesh, India',
    linkedin: 'https://www.linkedin.com/in/sonukumar45',
    github: 'https://github.com/sonuk4533N',
    bio: 'Full Stack Developer with strong expertise in modern web development technologies and hands-on experience building responsive, scalable web applications. Proficient in front-end frameworks (React.js, Angular) and back-end technologies (Node.js, PHP, MySQL). Passionate about writing clean, maintainable code and delivering high-performance user experiences.'
  },

  // Professional Summary
  summary: {
    heading: 'Building elegant digital experiences with modern web technologies',
    subheading: 'Full Stack Developer crafting responsive, scalable web applications',
    description: 'Full Stack Developer with strong expertise in modern web development technologies and hands-on experience building responsive, scalable web applications. Proficient in front-end frameworks (React.js, Angular) and back-end technologies (Node.js, PHP, MySQL). Passionate about writing clean, maintainable code and delivering high-performance user experiences. Seeking to contribute technical skills and continuous learning mindset to a dynamic development team at an innovative organization.'
  },

  // Featured Projects
  projects: [
    {
      id: 1,
      title: 'SarvadaaPower Corporate Website',
      description: 'Professional corporate website for an energy solutions company serving as the company\'s primary online presence and lead generation tool. Fully responsive across all devices with exceptional performance metrics.',
      longDescription: `Developed a professional corporate website for SarvadaaPower, an energy solutions company. The site serves as the company's primary online presence and lead generation tool.
      
Key Achievements:
• Built fully responsive website achieving 100% compatibility across desktop (1920px+), tablet (768px-1024px), and mobile (320px-480px) devices
• Implemented optimized performance metrics: Page Load Time: 2.3 seconds, Lighthouse Score: 94/100 (Desktop), 92/100 (Mobile)
• Integrated smooth scrolling, form validation, and intuitive navigation improving user engagement
• Optimized images using WebP format and lazy loading, reducing initial page load by 40%
• SEO optimization resulted in improved search visibility with meta tags, structured data, and semantic HTML
• Website currently active with 100% uptime, serving as primary marketing tool`,
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Responsive Design', 'Performance Optimization', 'SEO'],
      category: 'web',
      github_url: '',
      live_url: 'https://sarvadaapower.in',
      icon: '⚡',
      image: '',
      highlights: [
        '100% Device Compatibility',
        '94/100 Lighthouse Score',
        '2.3s Load Time',
        '40% Faster Loading',
        '100% Uptime'
      ]
    },
    {
      id: 2,
      title: 'E-Commerce Product Listing Platform',
      description: 'Full-stack e-commerce platform demonstrating modern development practices with front-end and back-end integration, product filtering, shopping cart, and secure authentication.',
      longDescription: `Built a full-stack e-commerce platform demonstrating modern development practices with front-end and back-end integration.

Frontend Development:
• Created responsive React.js application with 8+ reusable components using functional components and hooks
• Implemented product filtering, sorting, and search functionality
• Built shopping cart with add/remove/quantity features using Context API for state management
• Optimized component rendering, reducing unnecessary re-renders by 35%

Backend Development:
• Developed Node.js/Express API with 15+ REST endpoints
• Designed MySQL database schema with proper relationships and indexing
• Implemented JWT-based authentication for secure user sessions
• Created CRUD operations for products, users, and orders

Performance & Quality:
• API response time: < 200ms for most endpoints
• Database queries optimized with indexing achieving 50% faster lookups
• Implemented error handling and validation across all endpoints
• Code structured with MVC architecture for maintainability`,
      tags: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'JWT', 'Context API', 'REST API', 'MVC Architecture'],
      category: 'web',
      github_url: 'https://github.com/sonuk4533N',
      live_url: '',
      icon: '🛒',
      image: '',
      highlights: [
        '8+ Reusable Components',
        '15+ API Endpoints',
        '<200ms Response Time',
        '50% Faster DB Queries',
        '35% Fewer Re-renders'
      ]
    },
    {
      id: 3,
      title: 'Personal Portfolio Website',
      description: 'Professional portfolio website showcasing projects, technical skills, and work history. Single-page application with smooth navigation, animations, and mobile-first responsive design.',
      longDescription: `Designed and built a professional portfolio website showcasing projects and technical skills.

Key Achievements:
• Developed single-page application with smooth navigation and animations
• Integrated contact form with email functionality
• Implemented mobile-first responsive design ensuring perfect display on all devices
• SEO optimized for better search engine visibility
• Clean, modern UI with focus on user experience

Features:
• Dynamic project showcase with filtering
• Skills categorization by technology stack
• Work experience timeline
• Contact form with validation
• Smooth scroll navigation
• Dark/Light theme toggle`,
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Responsive Design', 'SEO'],
      category: 'design',
      github_url: 'https://github.com/sonuk4533N',
      live_url: '',
      icon: '🎨',
      image: '',
      highlights: [
        'Single-Page App',
        'Mobile-First Design',
        'Theme Toggle',
        'Email Integration',
        'SEO Optimized'
      ]
    },
    {
      id: 4,
      title: 'Freelance Client Websites',
      description: 'Developed and deployed 3+ client websites across e-commerce, service-based, and portfolio industries with 100% client satisfaction and positive feedback.',
      longDescription: `Professional freelance web development service delivering high-quality websites across multiple industries.

Achievements:
• Developed and deployed 3+ client websites across e-commerce, service-based, and portfolio industries
• Delivered projects with 100% client satisfaction with positive feedback on design quality and functionality
• Managed full development lifecycle from requirements gathering to deployment and maintenance
• Technologies utilized: HTML5, CSS3, JavaScript, Bootstrap, WordPress
• Average project turnaround: 20-30 days with post-launch support

Industries Served:
• E-Commerce businesses
• Service-based companies
• Portfolio/freelancer websites

Client Satisfaction: 100%
Average Delivery Time: 20-30 days
Post-Launch Support: Included`,
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'WordPress', 'Client Management'],
      category: 'design',
      github_url: 'https://github.com/sonuk4533N',
      live_url: '',
      icon: '💼',
      image: '',
      highlights: [
        '3+ Websites',
        '100% Client Satisfaction',
        '20-30 Days Delivery',
        'Full Lifecycle Management',
        'Post-Launch Support'
      ]
    }
  ],

  // Technical Skills
  skills: {
    categories: [
      {
        name: 'Front-End Technologies',
        icon: '🖥️',
        skills: [
          { name: 'HTML5', level: 'Expert', icon: '🏗️' },
          { name: 'CSS3', level: 'Expert', icon: '🎨' },
          { name: 'JavaScript (ES6+)', level: 'Expert', icon: '⚙️' },
          { name: 'React.js', level: 'Advanced', icon: '⚛️' },
          { name: 'Angular JS', level: 'Intermediate', icon: '🔲' },
          { name: 'Bootstrap', level: 'Expert', icon: '📦' },
          { name: 'Tailwind CSS', level: 'Advanced', icon: '🌀' },
          { name: 'Responsive Design', level: 'Expert', icon: '📱' }
        ]
      },
      {
        name: 'Back-End Technologies',
        icon: '⚙️',
        skills: [
          { name: 'Node.js', level: 'Advanced', icon: '🟢' },
          { name: 'Express.js', level: 'Advanced', icon: '🚀' },
          { name: 'PHP', level: 'Intermediate', icon: '🐘' },
          { name: 'MySQL', level: 'Advanced', icon: '🗄️' },
          { name: 'Database Design', level: 'Advanced', icon: '📊' },
          { name: 'REST API Development', level: 'Expert', icon: '🔌' },
          { name: 'JWT Authentication', level: 'Advanced', icon: '🔐' },
          { name: 'OAuth Basics', level: 'Intermediate', icon: '🔑' }
        ]
      },
      {
        name: 'Developer Tools',
        icon: '🛠️',
        skills: [
          { name: 'Git', level: 'Advanced', icon: '📦' },
          { name: 'GitHub', level: 'Advanced', icon: '🐙' },
          { name: 'VS Code', level: 'Expert', icon: '💻' },
          { name: 'Postman', level: 'Advanced', icon: '📮' },
          { name: 'Chrome DevTools', level: 'Advanced', icon: '🔍' },
          { name: 'Figma', level: 'Intermediate', icon: '🎨' },
          { name: 'Adobe XD', level: 'Intermediate', icon: '✏️' },
          { name: 'npm/yarn', level: 'Advanced', icon: '📦' }
        ]
      },
      {
        name: 'Core Competencies',
        icon: '💡',
        skills: [
          { name: 'Problem Solving', level: 'Expert', icon: '🧠' },
          { name: 'Code Optimization', level: 'Advanced', icon: '⚡' },
          { name: 'Performance Tuning', level: 'Advanced', icon: '🚀' },
          { name: 'Debugging & Troubleshooting', level: 'Expert', icon: '🐛' },
          { name: 'Responsive Design', level: 'Expert', icon: '📐' },
          { name: 'Quick Learner', level: 'Advanced', icon: '📚' },
          { name: 'Attention to Detail', level: 'Expert', icon: '👁️' },
          { name: 'UX/UI Fundamentals', level: 'Intermediate', icon: '🎯' }
        ]
      },
      {
        name: 'Languages',
        icon: '🌐',
        skills: [
          { name: 'English', level: 'Professional', proficiency: 'Professional' },
          { name: 'Hindi', level: 'Native', proficiency: 'Fluent' }
        ]
      }
    ]
  },

  // Work Experience
  experience: [
    {
      id: 1,
      title: 'Freelance Web Developer',
      company: 'Self-Employed',
      period: '2024 – Present',
      duration: 'Ongoing',
      description: 'Developing and deploying 3+ client websites across e-commerce, service-based, and portfolio industries. Delivering projects with 100% client satisfaction. Managing full development lifecycle from requirements gathering to deployment and maintenance.',
      highlights: [
        'Developed and deployed 3+ client websites',
        '100% client satisfaction rate',
        'Full development lifecycle management',
        'Average turnaround: 20-30 days',
        'Post-launch support provided',
        'Technologies: HTML5, CSS3, JavaScript, Bootstrap, WordPress'
      ],
      type: 'work'
    },
    {
      id: 2,
      title: 'Full Stack Web Development Training',
      company: 'Arth Institute, Laxmi Nagar, New Delhi',
      period: 'Completed 2024',
      duration: '120 Hours',
      description: 'Comprehensive training in front-end and back-end technologies with hands-on projects. Covered HTML5, CSS3, JavaScript, React.js, Node.js, Express.js, MySQL, Git, and deployment workflows.',
      highlights: [
        'Front-end technologies: HTML5, CSS3, JavaScript, React.js',
        'Back-end technologies: PHP, Node.js, Express.js, MySQL',
        'Database design and management',
        'REST API development',
        'Version control with Git & GitHub',
        'Deployment practices'
      ],
      type: 'education'
    },
    {
      id: 3,
      title: 'Git & GitHub Mastery',
      company: 'Apna College (Self-paced)',
      period: 'Completed 2024',
      duration: 'Self-paced',
      description: 'Version control fundamentals, branching strategies, merge conflicts, pull requests, and collaborative workflows. Applied learnings across all personal and freelance projects.',
      highlights: [
        'Version control fundamentals',
        'Branching strategies',
        'Merge conflict resolution',
        'Pull request workflows',
        'Collaborative development',
        'Applied to all projects'
      ],
      type: 'education'
    },
    {
      id: 4,
      title: 'Bachelor of Computer Application (BCA)',
      company: 'Modern College of Professional Studies, Ghaziabad',
      period: 'Currently Pursuing',
      duration: '3rd Semester',
      description: 'Studying core computer science concepts, software development, database management, and web technologies. Building academic knowledge alongside real-world project experience.',
      highlights: [
        'Core computer science concepts',
        'Software development principles',
        'Database management systems',
        'Web technologies',
        'Real-world project experience',
        'Academic excellence focus'
      ],
      type: 'education'
    }
  ],

  // Certifications & Training
  certifications: [
    {
      name: 'Full Stack Web Development',
      issuer: 'Arth Institute, Laxmi Nagar, New Delhi',
      date: 'Completed 2024',
      hours: '120 Hours',
      description: 'Comprehensive training in front-end and back-end technologies',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'React.js', 'Node.js']
    },
    {
      name: 'Git & GitHub Mastery',
      issuer: 'Apna College, YouTube',
      date: 'Completed 2024',
      type: 'Self-paced',
      description: 'Version control fundamentals, branching strategies, collaborative workflows',
      skills: ['Git', 'GitHub', 'Version Control', 'Branching', 'Collaboration']
    }
  ],

  // Education
  education: [
    {
      degree: 'Bachelor of Computer Application (BCA)',
      school: 'Modern College of Professional Studies, Ghaziabad, Uttar Pradesh',
      status: 'Currently Pursuing',
      semester: '3rd Semester',
      year: 'In Progress'
    },
    {
      degree: 'Class 12 (CBSE)',
      school: 'S.B.V Anand Vihar, Delhi',
      status: 'Graduated',
      year: '2023'
    },
    {
      degree: 'Class 10 (CBSE)',
      school: 'S.B.V Anand Vihar, Delhi',
      status: 'Graduated',
      year: '2021'
    }
  ],

  // Achievements & Highlights
  achievements: [
    {
      title: 'Performance Optimization',
      description: 'Optimized web pages achieving 90+ Lighthouse scores, improving user experience and SEO rankings',
      icon: '⚡'
    },
    {
      title: 'Project Delivery',
      description: 'Completed 3+ freelance projects with 100% client satisfaction and on-time delivery',
      icon: '✅'
    },
    {
      title: 'Responsive Design Mastery',
      description: 'Extensive experience with mobile-first design approach, CSS Flexbox/Grid, and Bootstrap framework',
      icon: '📱'
    },
    {
      title: 'Problem Solver',
      description: 'Quickly debugged and resolved technical issues, improving code quality and application performance',
      icon: '🧠'
    },
    {
      title: 'NCC Grade A Certificate',
      description: 'Grade A - Physical Fitness & Discipline',
      icon: '🏅'
    },
    {
      title: 'Continuous Learner',
      description: 'Actively learning modern frameworks (React.js) and best practices in web development',
      icon: '📚'
    }
  ],

  // Soft Skills
  softSkills: [
    { name: 'Team Collaboration', icon: '🤝' },
    { name: 'Problem Solving', icon: '🧩' },
    { name: 'Critical Thinking', icon: '🧠' },
    { name: 'Attention to Detail', icon: '👁️' },
    { name: 'Time Management', icon: '⏰' },
    { name: 'Adaptive Learning', icon: '📚' },
    { name: 'Self-Motivated', icon: '🔥' },
    { name: 'Clear Communication', icon: '💬' },
    { name: 'Client Interaction', icon: '🤵' },
    { name: 'Presentation Skills', icon: '🎤' },
    { name: 'Proactive Initiative', icon: '🚀' },
    { name: 'Reliable Deadline Management', icon: '✅' }
  ],

  // Statistics
  stats: {
    projects: {
      number: 5,
      description: 'Completed Projects'
    },
    clients: {
      number: 3,
      description: 'Satisfied Clients'
    },
    satisfaction: {
      number: 100,
      unit: '%',
      description: 'Client Satisfaction'
    },
    lighthouse: {
      number: 94,
      unit: '/100',
      description: 'Lighthouse Score'
    },
    experience: {
      number: 2,
      unit: '+',
      description: 'Years Experience'
    },
    freelance: {
      number: 3,
      description: 'Freelance Projects'
    }
  },

  // Availability & Additional Info
  availability: {
    status: 'Available for work',
    startDate: 'Immediate',
    openTo: [
      'Full-time opportunities (Internship/Junior Developer roles)',
      'Contract projects and freelance assignments',
      'Collaborative open-source contributions',
      'Continuous learning and skill development'
    ]
  }
};

// Export for use in Node/Module contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RESUME_DATA;
}
