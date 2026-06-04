/**
 * env.js — Centralized environment config
 *
 * All env variables are read here from import.meta.env (Vite).
 * Import this file wherever you need a config value.
 *
 * To customize: edit .env in the project root.
 */

const env = {
  // ── AI / API Keys ─────────────────────────────────────────
  /** Google Gemini API key. Set in .env as VITE_GEMINI_API_KEY */
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',

  // ── Admin Panel ───────────────────────────────────────────
  /** Admin panel password. Default: admin@kv */
  adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || 'admin@kv',

  // ── Personal Links ────────────────────────────────────────
  /** Contact email */
  email: import.meta.env.VITE_EMAIL || 'vignesh@example.com',

  /** LinkedIn profile URL */
  linkedinUrl: import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com/in/kvignesh',

  /** GitHub profile URL */
  githubUrl: import.meta.env.VITE_GITHUB_URL || 'https://github.com/kvignesh',

  /** Resume download link */
  resumeUrl: import.meta.env.VITE_RESUME_URL || '/resume.pdf',

  // ── Site Meta ─────────────────────────────────────────────
  /** Your display name */
  siteName: import.meta.env.VITE_SITE_NAME || 'K Vignesh',

  /** Browser tab title */
  siteTitle: import.meta.env.VITE_SITE_TITLE || 'K Vignesh | Backend & Cloud Architect',

  /** Meta description for SEO */
  siteDescription:
    import.meta.env.VITE_SITE_DESCRIPTION ||
    'Pioneering AI-Integrated Applications and Cloud Architecture',

  // ── Helpers ───────────────────────────────────────────────
  /** True when Gemini key is configured */
  hasGeminiKey: !!(import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE'),
}

export default env
