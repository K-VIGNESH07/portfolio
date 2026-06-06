// ── Portfolio Seed Data ──────────────────────────────────────────────
// This is the DEFAULT data loaded when Firestore is empty.
// Once saved via admin panel, Firestore takes over as source of truth.

export const personalInfo = {
  name: 'K Vignesh',
  initials: 'KV',
  headline: 'Backend & Cloud Architect',
  subHeadline: 'Pioneering AI-Integrated Applications',
  bio: [
    "I'm <strong>K Vignesh</strong>, a Computer Science Engineering student with a passion for <span class='hl'>backend architecture</span> and <span class='hl'>AI-integrated systems</span>.",
    "Instead of treating AI as a surface-level feature, I build from the ground up — focusing on <strong>backend engineering</strong>, <strong>deep database management</strong>, <strong>cloud architecture</strong>, and <strong>OS-level optimization</strong> to maximize development efficiency.",
    "My goal is to bridge the gap between heavy infrastructure and intelligent automation, creating scalable applications where AI works effortlessly to optimize workflows and supercharge engineering efficiency.",
  ],
  badges: ['Backend Engineering', 'Cloud Architecture', 'AI Agents', 'Database Management', 'OS Optimization', 'Scalable Systems'],
  floatingBadges: ['☁️ Cloud', '🤖 AI', '⚡ Backend'],
  stats: [
    { num: '10+', label: 'Projects' },
    { num: '5+', label: 'Certifications' },
    { num: 'CS', label: 'Engineering' },
  ],
  typewriterWords: [
    'AI-Integrated Systems',
    'Cloud Architecture',
    'Backend Engines',
    'Scalable Microservices',
    'Intelligent Workflows',
    'RAG Pipelines',
  ],
  available: true,
  contact: {
    email: 'k.vignesh.25feb2007@gmail.com',
    linkedin: 'linkedin.com/in/vignesh-k-ab7712324',
    github: 'github.com/K-VIGNESH07',
    linkedinUrl: 'https://linkedin.com/in/vignesh-k-ab7712324',
    githubUrl: 'https://github.com/K-VIGNESH07',
  },
}

export const skillCategories = [
  {
    icon: '⚙️',
    title: 'Backend Development',
    skills: [
      { name: 'Python', level: 100 },
      { name: 'Node.js / Express.js', level: 100 },
      { name: 'FastAPI / Flask', level: 100 },
      { name: 'REST / GraphQL APIs', level: 100 },
      { name: 'OAuth 2.0 / JWT Auth', level: 100 },
    ],
  },
  {
    icon: '☁️',
    title: 'Cloud & DevOps',
    skills: [
      { name: 'AWS / GCP', level: 100 },
      { name: 'Docker / Kubernetes', level: 100 },
      { name: 'Terraform / IaC', level: 100 },
      { name: 'CI/CD (GitHub Actions)', level: 100 },
      { name: 'Serverless (AWS Lambda)', level: 100 },
    ],
  },
  {
    icon: '🤖',
    title: 'AI & Machine Learning',
    skills: [
      { name: 'AI Agents / LLM APIs', level: 100 },
      { name: 'LangChain / LlamaIndex', level: 100 },
      { name: 'RAG Systems', level: 100 },
      { name: 'PyTorch / TensorFlow', level: 100 },
      { name: 'Vector DBs (Pinecone / Redis)', level: 100 },
    ],
  },
  {
    icon: '🗄️',
    title: 'Databases & Systems',
    skills: [
      { name: 'PostgreSQL / MySQL', level: 100 },
      { name: 'MongoDB / Redis', level: 100 },
      { name: 'Linux / OS Internals', level: 100 },
      { name: 'UiPath / RPA', level: 100 },
      { name: 'Git & GitHub', level: 100 },
    ],
  },
]

export const projects = [
  {
    icon: '🧠',
    title: 'AI Agent Orchestration Framework',
    desc: 'A modular backend framework for orchestrating multiple AI agents with tool-use, memory, and inter-agent communication. Built to scale horizontally on cloud infrastructure.',
    tech: ['Python', 'LangChain', 'FastAPI', 'Redis'],
    github: '#',
    demo: '#',
  },
  {
    icon: '☁️',
    title: 'Serverless Cloud Data Pipeline',
    desc: 'End-to-end serverless data ingestion pipeline on AWS, processing real-time event streams with auto-scaling Lambda functions, S3 data lake, and Athena querying.',
    tech: ['AWS Lambda', 'S3', 'Kinesis', 'Terraform'],
    github: '#',
    demo: '#',
  },
  {
    icon: '🔍',
    title: 'RAG-Powered Knowledge Assistant',
    desc: 'Retrieval-Augmented Generation system that ingests documents and enables semantic Q&A over custom knowledge bases. Supports multi-document reasoning with vector search.',
    tech: ['LlamaIndex', 'Pinecone', 'OpenAI', 'FastAPI'],
    github: '#',
    demo: '#',
  },
  {
    icon: '⚡',
    title: 'High-Performance API Gateway',
    desc: 'Custom API gateway built with async Python supporting rate limiting, JWT auth, request caching with Redis, and load balancing across microservices.',
    tech: ['Python', 'Redis', 'PostgreSQL', 'Docker'],
    github: '#',
    demo: '#',
  },
  {
    icon: '🌐',
    title: 'Distributed ML Model Serving',
    desc: 'Production-grade ML model deployment system using Kubernetes for orchestration, with A/B testing, model versioning, and real-time performance monitoring.',
    tech: ['Kubernetes', 'TensorFlow', 'Prometheus', 'Grafana'],
    github: '#',
    demo: '#',
  },
  {
    icon: '🔐',
    title: 'Zero-Trust Auth Microservice',
    desc: 'Enterprise-grade authentication microservice implementing OAuth 2.0, RBAC, MFA, and zero-trust principles. Deployed as a standalone service with 99.99% uptime SLA.',
    tech: ['OAuth 2.0', 'JWT', 'PostgreSQL', 'AWS ECS'],
    github: '#',
    demo: '#',
  },
]

export const education = [
  {
    period: '2022 – 2026',
    status: 'current',
    statusLabel: 'Current',
    title: 'B.E. Computer Science & Engineering',
    institution: 'Anna University (Affiliated College)',
    desc: 'Specializing in backend systems, cloud computing, and AI-driven application development. Active member of the coding and tech club.',
    tags: ['Data Structures', 'OS Concepts', 'Cloud Computing', 'AI & ML'],
  },
  {
    period: '2020 – 2022',
    status: 'done',
    statusLabel: 'Completed',
    title: 'Higher Secondary Education (HSC)',
    institution: 'Tamil Nadu State Board',
    desc: 'Completed 12th with Computer Science as core subject. Scored distinction with strong focus on Mathematics and Computer Science fundamentals.',
    tags: ['Computer Science', 'Mathematics', 'Physics'],
  },
  {
    period: '2018 – 2020',
    status: 'done',
    statusLabel: 'Completed',
    title: 'Secondary Education (SSLC)',
    institution: 'Tamil Nadu State Board',
    desc: 'Completed 10th with distinction. First introduction to programming with QBASIC. Developed logical thinking and problem-solving skills.',
    tags: ['QBASIC', 'Mathematics', 'Science'],
  },
]

export const certifications = [
  { icon: '☁️', title: 'AWS Solutions Architect - Fundamentals', issuer: 'Amazon Web Services',      year: '2026' },
  { icon: '🤖', title: 'UiPath Automation Developer Associate', issuer: 'UiPath / ICT Academy',   year: '2025' },
  { icon: '🏆', title: 'AWS Cloud Practitioner',        issuer: 'Amazon Web Services',      year: '2024' },
  { icon: '🎓', title: 'Google Cloud Associate',        issuer: 'Google Cloud Platform',    year: '2024' },
  { icon: '🤖', title: 'Deep Learning Specialization',  issuer: 'DeepLearning.AI / Coursera', year: '2023' },
  { icon: '⚙️', title: 'Docker & Kubernetes Mastery',   issuer: 'Udemy — KodeKloud',        year: '2023' },
  { icon: '🐍', title: 'Python for Data Engineering',   issuer: 'DataCamp',                 year: '2022' },
  { icon: '🔗', title: 'LangChain & LLM Development',   issuer: 'DeepLearning.AI',          year: '2024' },
]

// AI Chatbot knowledge base prompt
export const PORTFOLIO_CONTEXT = `
You are an AI assistant representing K Vignesh's portfolio website.
Answer questions about Vignesh naturally, confidently, and concisely.
Keep responses to 2-4 sentences. Be friendly and professional.

About K Vignesh:
- Full Name: K Vignesh
- Role: Backend & Cloud Architect | AI-Integrated Applications Developer
- Studying: B.E. Computer Science & Engineering (2022–2026, Anna University affiliated college)
- Located: Tamil Nadu, India
- Email: k.vignesh.25feb2007@gmail.com

Top Skills: Python, FastAPI, Node.js, Express.js, AWS, GCP, Docker, Kubernetes, Terraform, LangChain, LlamaIndex, RAG Systems, PyTorch, PostgreSQL, MongoDB, Redis, Linux internals, UiPath (RPA).

Key Projects: AI Agent Orchestration Framework, Serverless Cloud Data Pipeline (AWS), RAG-Powered Knowledge Assistant, High-Performance API Gateway, Distributed ML Model Serving (Kubernetes), Zero-Trust Auth Microservice.

Certifications: AWS Solutions Architect - Fundamentals, UiPath Automation Developer Associate, AWS Cloud Practitioner, Google Cloud Associate, Deep Learning Specialization, Docker & Kubernetes Mastery, Python for Data Engineering, LangChain & LLM Development.

Availability: Open to internships, project collaborations, and full-time opportunities after graduation in 2026.
`
