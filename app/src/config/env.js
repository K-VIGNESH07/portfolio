/**
 * env.js — Centralized environment variable access
 * Always import config values from here, never directly from import.meta.env
 */
const env = {
  // Firebase
  firebaseApiKey:            import.meta.env.VITE_FIREBASE_API_KEY || '',
  firebaseAuthDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  firebaseProjectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  firebaseStorageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  firebaseMessagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  firebaseAppId:             import.meta.env.VITE_FIREBASE_APP_ID || '',
  firebaseMeasurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',

  // AI
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',

  // Site meta
  siteName:        import.meta.env.VITE_SITE_NAME || 'K Vignesh',
  siteTitle:       import.meta.env.VITE_SITE_TITLE || 'K Vignesh | Backend & Cloud Architect',
  siteDescription: import.meta.env.VITE_SITE_DESCRIPTION || 'Pioneering AI-Integrated Applications',

  // Personal
  email:       import.meta.env.VITE_EMAIL || '',
  linkedinUrl: import.meta.env.VITE_LINKEDIN_URL || '',
  githubUrl:   import.meta.env.VITE_GITHUB_URL || '',
  resumeUrl:   import.meta.env.VITE_RESUME_URL || '/resume.pdf',

  // Feature flags
  hasGemini:   !!(import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE'),
  hasFirebase: !!(import.meta.env.VITE_FIREBASE_PROJECT_ID),
}

export default env
