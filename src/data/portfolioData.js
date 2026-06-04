// ---- Portfolio Data ----
// Edit this file to update your portfolio content

export const personalInfo = {
  name: 'K Vignesh',
  initials: 'KV',
  headline: 'Backend & Cloud Architect',
  subHeadline: 'Pioneering AI-Integrated Applications',
  bio: [
    "I'm <strong>K Vignesh</strong>, a Computer Science Engineering student with a passion for <span class='highlight-text'>backend architecture</span> and <span class='highlight-text'>AI-integrated systems</span>.",
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
  contact: {
    email: 'vignesh@example.com',
    linkedin: 'linkedin.com/in/kvignesh',
    github: 'github.com/kvignesh',
    linkedinUrl: 'https://linkedin.com/in/kvignesh',
    githubUrl: 'https://github.com/kvignesh',
  },
  available: true,
}

export const skillCategories = [
  {
    icon: '⚙️',
    title: 'Backend Development',
    skills: [
      { name: 'Python', level: 90 },
      { name: 'Node.js', level: 80 },
      { name: 'REST / GraphQL APIs', level: 85 },
      { name: 'FastAPI / Flask', level: 88 },
    ],
  },
  {
    icon: '☁️',
    title: 'Cloud & DevOps',
    skills: [
      { name: 'AWS / GCP', level: 82 },
      { name: 'Docker / Kubernetes', level: 78 },
      { name: 'CI/CD Pipelines', level: 75 },
      { name: 'Terraform / IaC', level: 70 },
    ],
  },
  {
    icon: '🤖',
    title: 'AI & Machine Learning',
    skills: [
      { name: 'AI Agents / LLM APIs', level: 87 },
      { name: 'LangChain / LlamaIndex', level: 80 },
      { name: 'PyTorch / TensorFlow', level: 72 },
      { name: 'RAG Systems', level: 85 },
    ],
  },
  {
    icon: '🗄️',
    title: 'Databases & Systems',
    skills: [
      { name: 'PostgreSQL / MySQL', level: 88 },
      { name: 'MongoDB / Redis', level: 82 },
      { name: 'Linux / OS Internals', level: 78 },
      { name: 'Vector Databases', level: 75 },
    ],
  },
]

export const projects = [
  {
    icon: '🧠',
    title: 'AI Agent Orchestration Framework',
    desc: 'A modular backend framework for orchestrating multiple AI agents with tool-use, memory, and inter-agent communication. Built to scale horizontally on cloud infrastructure.',
    tech: ['Python', 'LangChain', 'FastAPI', 'Redis'],
    categories: ['ai', 'backend'],
    github: '#',
    demo: '#',
  },
  {
    icon: '☁️',
    title: 'Serverless Cloud Data Pipeline',
    desc: 'End-to-end serverless data ingestion pipeline on AWS, processing real-time event streams with auto-scaling Lambda functions, S3 data lake, and Athena querying.',
    tech: ['AWS Lambda', 'S3', 'Kinesis', 'Terraform'],
    categories: ['cloud', 'backend'],
    github: '#',
    demo: '#',
  },
  {
    icon: '🔍',
    title: 'RAG-Powered Knowledge Assistant',
    desc: 'Retrieval-Augmented Generation system that ingests documents and enables semantic Q&A over custom knowledge bases. Supports multi-document reasoning with vector search.',
    tech: ['LlamaIndex', 'Pinecone', 'OpenAI', 'FastAPI'],
    categories: ['ai'],
    github: '#',
    demo: '#',
  },
  {
    icon: '⚡',
    title: 'High-Performance API Gateway',
    desc: 'Custom API gateway built with async Python supporting rate limiting, JWT auth, request caching with Redis, and load balancing across microservices.',
    tech: ['Python', 'Redis', 'PostgreSQL', 'Docker'],
    categories: ['backend'],
    github: '#',
    demo: '#',
  },
  {
    icon: '🌐',
    title: 'Distributed ML Model Serving',
    desc: 'Production-grade ML model deployment system using Kubernetes for orchestration, with A/B testing, model versioning, and real-time performance monitoring.',
    tech: ['Kubernetes', 'TensorFlow', 'Prometheus', 'Grafana'],
    categories: ['ai', 'cloud'],
    github: '#',
    demo: '#',
  },
  {
    icon: '🔐',
    title: 'Zero-Trust Auth Microservice',
    desc: 'Enterprise-grade authentication microservice implementing OAuth 2.0, RBAC, MFA, and zero-trust principles. Deployed as a standalone service with 99.99% uptime SLA.',
    tech: ['OAuth 2.0', 'JWT', 'PostgreSQL', 'AWS ECS'],
    categories: ['backend', 'cloud'],
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
  { icon: '🏆', title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', year: '2024' },
  { icon: '🎓', title: 'Google Cloud Associate', issuer: 'Google Cloud Platform', year: '2024' },
  { icon: '🤖', title: 'Deep Learning Specialization', issuer: 'DeepLearning.AI / Coursera', year: '2023' },
  { icon: '⚙️', title: 'Docker & Kubernetes Mastery', issuer: 'Udemy — KodeKloud', year: '2023' },
  { icon: '🐍', title: 'Python for Data Engineering', issuer: 'DataCamp', year: '2022' },
  { icon: '🔗', title: 'LangChain & LLM Development', issuer: 'DeepLearning.AI', year: '2024' },
]

// AI Chatbot knowledge base
export const PORTFOLIO_CONTEXT = `
You are an AI assistant representing K Vignesh's portfolio website.
Answer questions about Vignesh naturally, confidently, and concisely.
Keep responses to 2-4 sentences. Be friendly and professional.

About K Vignesh:
- Full Name: K Vignesh
- Role: Backend & Cloud Architect | AI-Integrated Applications Developer
- Studying: B.E. Computer Science & Engineering (2022–2026, Anna University affiliated college)
- Located: Tamil Nadu, India

Top Skills: Python, FastAPI, Node.js, AWS, GCP, Docker, Kubernetes, Terraform, LangChain, LlamaIndex, RAG Systems, PyTorch, PostgreSQL, MongoDB, Redis, Linux internals.

Key Projects: AI Agent Orchestration Framework, Serverless Cloud Data Pipeline (AWS), RAG-Powered Knowledge Assistant, High-Performance API Gateway, Distributed ML Model Serving (Kubernetes), Zero-Trust Auth Microservice.

Certifications: AWS Cloud Practitioner, Google Cloud Associate, Deep Learning Specialization, Docker & Kubernetes Mastery, Python for Data Engineering, LangChain & LLM Development.

Availability: Open to internships, project collaborations, and full-time opportunities after graduation in 2026.
`
