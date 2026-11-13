/**
 * ONE place for everything about you.
 * The home page, the terminal (Ctrl/Cmd + K) and the SEO data all read from here,
 * so the site never says two different things. Edit text here, not inside components.
 *
 * Anything with `placeholder: true` still needs your input. `npm run todo` lists them all.
 */

export const profile = {
  name: "Faris Karkelja",
  firstName: "Faris",
  lastName: "Karkelja",
  title: "Software Engineer",
  roles: ["Full-Stack Developer", "Software Engineer", "Web Developer"],
  location: "Sarajevo, Bosnia and Herzegovina",
  timezone: "Europe/Sarajevo",
  workModes: ["Remote", "Hybrid", "On-site"],
  site: "https://fariskarkelja.github.io",

  // Contact. These are the details already public on your CV.
  email: "faris.karkelja1803@gmail.com",
  phone: "+387 62 147 893",
  showPhone: true,
  socials: {
    github: "https://github.com/FarisKarkelja",
    linkedin: "https://www.linkedin.com/in/fariskarkelja/",
  },

  // Contact form (EmailJS, same account as the old site).
  emailjs: {
    serviceId: "service_yae2sl5",
    templateId: "template_ps5tnjr",
    publicKey: "mw4HjgALzc5F6pg84",
  },

  cvPdf: "/cv/Faris_Karkelja_CV_en.pdf",

  /**
   * The `status` card in the hero. The terminal command `status` prints the same lines.
   * Keep every value under 30 characters so nothing wraps on a phone.
   */
  status: [
    { key: "open_to_work", value: "yes", live: true },
    { key: "what_i_do", value: "ship web products end to end" },
    { key: "roles", value: "full-stack / software engineer" },
    { key: "modes", value: "remote / hybrid / on-site" },
    { key: "now", value: "MSc Software Engineering, IBU" },
  ] as { key: string; value: string; live?: boolean }[],

  // Used in SEO, social previews and the terminal (`whoami`).
  summary:
    "Full-stack software engineer from Sarajevo. MSc Software Engineering student (BSc IT, 9.06/10 CGPA). Freelance web developer since February 2026 with four production websites live for clients in Germany and Bosnia and Herzegovina. Experience with TypeScript, React, Node.js, Python/FastAPI, Kotlin, SQL and Oracle PL/SQL, and automated testing with Playwright, pytest and JUnit.",

  // Bio for the About section. Each string is one paragraph.
  bio: [
    "I'm Faris, a software engineer from Sarajevo. I finished my BSc in Information Technology at International Burch University with a 9.06/10 CGPA, and I'm now doing my MSc in Software Engineering there, focusing on software architecture and AI-driven engineering.",
    "Since February 2026 I work as a freelance web developer. I take projects from the first client call to a live, hosted website: requirements, UI design in Figma, implementation, cross-device testing, deployment, and maintenance afterwards. Before that I interned at Union Bank (Oracle databases and PL/SQL), IDK Studio (full-stack development) and BH Telecom, and spent a semester studying in Sweden at Mälardalen University.",
    "The project I'm proudest of is TTStudy, a text-to-speech study aid I built for visually impaired students in the Western Balkans and tested with the people it was made for. My master's thesis will take it further, toward a native Bosnian text-to-speech system.",
    "Outside of code, I am a professional dancer: on stage, on TV and in competitions since 2019. Dancing taught me what I bring to every team - rehearse until it is boring, communicate without ego, and deliver when the lights are on.",
  ],
} as const;

export type Experience = {
  role: string;
  org: string;
  place: string;
  start: string;
  end: string;
  type: string;
  points: string[];
  stack?: string[];
  /** true = hidden behind the "Show more experience" button */
  more?: boolean;
  placeholder?: boolean;
};

export const experience: Experience[] = [
  {
    role: "Online Data Analyst",
    org: "TELUS Digital",
    place: "Remote",
    start: "Oct 2026",
    end: "Present",
    type: "Part-time",
    points: [
      "Evaluate search results against detailed quality guidelines, delivering consistent and well-documented ratings.",
    ],
  },
  {
    role: "Freelance Web Developer",
    org: "Self-employed",
    place: "Remote",
    start: "Feb 2026",
    end: "Present",
    type: "Freelance",
    points: [
      "Deliver and host production websites for clients in Germany and Bosnia and Herzegovina, end to end: requirements, Figma design, build, deployment, maintenance.",
      "Run cross-device testing before and after every launch; manage hosting, domains, SSL and email setup for clients.",
      "Administer the WordPress website of ADA e.V., a scholarship association in Germany, and made it trilingual (German, English, Bosnian) with Polylang.",
    ],
    stack: [
      "HTML",
      "CSS",
      "JavaScript",
      "Bootstrap",
      "PHP",
      "MySQL",
      "WordPress",
      "Figma",
    ],
  },
  {
    role: "Information Technology Intern",
    org: "BH Telecom",
    place: "Sarajevo, BA",
    start: "Dec 2025",
    end: "Feb 2026",
    type: "Internship",
    points: [
      "Rotated through app development, QA and server operations teams, plus SMS/MMS, voice and packet core departments in a live telecom network.",
    ],
  },
  {
    role: "Database Developer Intern",
    org: "Union Bank d.d.",
    place: "Sarajevo, BA",
    start: "Sep 2025",
    end: "Oct 2025",
    type: "Internship",
    points: [
      "Optimized SQL queries and database processes supporting internal banking applications.",
      "Built an Oracle APEX application with the team for tracking the import, export and consumption of consumable materials.",
    ],
    stack: ["Oracle DB", "SQL", "PL/SQL", "Oracle APEX"],
  },
  {
    role: "Full Stack Developer Intern",
    org: "IDK Studio d.o.o.",
    place: "Remote",
    start: "Sep 2025",
    end: "Oct 2025",
    type: "Internship",
    points: [
      'Designed in Figma and developed "Unwind", a full-stack movie library app with trailers and personalized watchlists.',
    ],
    stack: ["Figma", "Full-stack web"],
  },
  {
    role: "Laboratory Demonstrator",
    org: "International Burch University",
    place: "Sarajevo, BA",
    start: "Oct 2024",
    end: "Jan 2025",
    type: "Part-time",
    points: [
      "Courses: Fundamentals of Programming, Foundations of Web Development.",
      "Co-led lab sessions with the head teaching assistant and helped students debug their code and build their projects.",
    ],
  },

  // ---- behind "Show more experience" ----
  {
    role: "Professional Dancer",
    org: "Dance Studio Aster",
    place: "Sarajevo, BA",
    start: "2019",
    end: "Present",
    type: "Stage",
    points: [
      "Partner and formation dancing on TV, at brand events and in competitions; first place at national and international level.",
      "Lead workshops and trainings for other dancers.",
    ],
    more: true,
  },
  {
    role: "Coordinator of Volunteers",
    org: "Meru Yoga and Health Association",
    place: "Sarajevo, BA",
    start: "2021",
    end: "Present",
    type: "Volunteer",
    points: [
      "Coordinate the volunteer team and co-lead a yearly summer camp in Trpanj, Croatia.",
    ],
    more: true,
  },
];

export const education = [
  {
    degree: "MSc Software Engineering",
    school: "International Burch University",
    place: "Sarajevo, BA",
    start: "Oct 2026",
    end: "Present",
    detail:
      "Courses: Software Architectures, AI-Driven Software Engineering, Generative AI with LLMs, Scientific Research Methods.",
  },
  {
    degree: "BSc Information Technology",
    school: "International Burch University",
    place: "Sarajevo, BA",
    start: "Oct 2023",
    end: "Jul 2026",
    detail:
      "CGPA 9.06/10. Thesis: TTStudy, a text-to-speech study aid for visually impaired students.",
  },
  {
    degree: "Erasmus+ Exchange Semester, Computer Science",
    school: "Mälardalen University",
    place: "Västerås, Sweden",
    start: "Jan 2025",
    end: "Jun 2025",
    detail:
      "AI algorithms (BFS/DFS, ant colony optimization, neural networks), a Docker/Linux IoT cloud monitoring system (team), probability seminar.",
  },
  {
    degree: "High School Diploma, General Studies",
    school: "Gymnasium Dobrinja",
    place: "Sarajevo, BA",
    start: "Sep 2019",
    end: "Jun 2023",
    detail: "",
  },
];

/**
 * Toolkit. `icon` is a Simple Icons slug (https://simpleicons.org) - tools with an icon also
 * appear in the moving logo strip. Leave `icon` out for tools without a logo there.
 */
export type Tool = { name: string; icon?: string };

export const toolkit: { group: string; items: Tool[] }[] = [
  {
    group: "Languages",
    items: [
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Python", icon: "python" },
      { name: "SQL" },
      { name: "PHP", icon: "php" },
      { name: "Java", icon: "openjdk" },
      { name: "Kotlin", icon: "kotlin" },
      { name: "HTML", icon: "html5" },
      { name: "CSS", icon: "css" },
    ],
  },
  {
    group: "Frontend",
    items: [
      { name: "React", icon: "react" },
      { name: "Vite", icon: "vite" },
      { name: "Astro", icon: "astro" },
      { name: "Bootstrap", icon: "bootstrap" },
      { name: "Three.js", icon: "threedotjs" },
      { name: "GSAP", icon: "gsap" },
      { name: "Figma", icon: "figma" },
      { name: "Responsive design" },
      { name: "Accessibility" },
    ],
  },
  {
    group: "Backend and data",
    items: [
      { name: "Node.js", icon: "nodedotjs" },
      { name: "Express", icon: "express" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "REST APIs" },
      { name: "MySQL", icon: "mysql" },
      { name: "Oracle DB" },
      { name: "PL/SQL" },
      { name: "Oracle APEX" },
    ],
  },
  {
    group: "Testing",
    items: [
      { name: "Playwright" },
      { name: "pytest", icon: "pytest" },
      { name: "Vitest", icon: "vitest" },
      { name: "Supertest" },
      { name: "JUnit", icon: "junit5" },
      { name: "Selenium", icon: "selenium" },
      { name: "Postman", icon: "postman" },
    ],
  },
  {
    group: "Tools and delivery",
    items: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "Linux", icon: "linux" },
      { name: "cPanel and web hosting", icon: "cpanel" },
      { name: "WordPress", icon: "wordpress" },
      { name: "Domains, DNS and SSL" },
    ],
  },
  {
    group: "Also worked with",
    items: [
      { name: "Jetpack Compose", icon: "jetpackcompose" },
      { name: "Firebase", icon: "firebase" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Docker", icon: "docker" },
      { name: "Google Cloud", icon: "googlecloud" },
      { name: "Gemini API", icon: "googlegemini" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Redis", icon: "redis" },
      { name: "Neo4j", icon: "neo4j" },
      { name: "SQLite", icon: "sqlite" },
      { name: "C++", icon: "cplusplus" },
      { name: "Claude and Claude Code", icon: "claude" },
      { name: "Room, Hilt, Retrofit" },
      { name: "Google Cloud Text-to-Speech" },
    ],
  },
];

export const languages = [
  { name: "Bosnian / Croatian / Serbian", level: "Native" },
  { name: "English", level: "Fluent" },
  { name: "German", level: "Upper-intermediate (TestDaF)" },
  { name: "Swedish", level: "Beginner" },
];

export const awards: {
  name: string;
  org: string;
  year: string;
  placeholder?: boolean;
}[] = [
  {
    name: "3rd Place, Computer Science and IT Student Symposium",
    org: "BHAAAS",
    year: "2026",
  },
  {
    name: "Outstanding Contribution Award, European Heritage Days",
    org: "Federal Ministry of Culture and Sports",
    year: "2024",
  },
  {
    name: "1st Place, National Dance Competition",
    org: "Modern Dance Association of BiH",
    year: "2021-2023, 2025",
  },
];

/**
 * Certificates, listed as text. The documents themselves are sent on request (see certificatesNote).
 * Order: newest first.
 */
export type Certificate = {
  name: string;
  org: string;
  year: string;
  detail: string;
  placeholder?: boolean;
};

export const certificates: Certificate[] = [
  {
    name: "Claude 101",
    org: "Anthropic Academy",
    year: "2026",
    detail: "Working with Claude for research, writing and analysis.",
  },
  {
    name: "Claude Code 101",
    org: "Anthropic Academy",
    year: "2026",
    detail: "Agentic coding with Claude Code in real repositories.",
  },
  {
    name: "Claude Platform 101",
    org: "Anthropic Academy",
    year: "2026",
    detail: "Building on the Claude API: prompting, tool use and model choice.",
  },
  {
    name: "TestDaF - German as a Foreign Language",
    org: "TestDaF-Institut",
    year: "20XX",
    detail: "Reading TDN 3, Listening TDN 4, Writing TDN 3, Speaking TDN 4.",
    placeholder: true, // fill in the year
  },
  {
    name: "Web Programming and C++ Intermediate",
    org: "Logosoft and the Association of Mathematicians of Sarajevo Canton",
    year: "2019",
    detail: "Intermediate C++ and the basics of web programming.",
  },
];

export const certificatesNote =
  "Copies of any certificate can be issued and sent on request.";

export type Volunteering = {
  role: string;
  org: string;
  start: string;
  end: string;
  detail: string;
  placeholder?: boolean;
};

export const volunteering: Volunteering[] = [
  {
    role: "Volunteer",
    org: "European Heritage Days",
    start: "2024",
    end: "2024",
    detail:
      "Recognized with a plaque for outstanding contribution by the Federal Ministry of Culture and Sports.",
    placeholder: true, // confirm the role and add one line about what you did
  },
  {
    role: "Role title",
    org: "Organisation",
    start: "20XX",
    end: "20XX",
    detail: "Add another volunteering role here, or delete this entry.",
    placeholder: true,
  },
];
