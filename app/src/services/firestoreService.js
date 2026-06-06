/**
 * firestoreService.js — All Firestore database operations
 *
 * SCHEMA:
 *   portfolioData/{section}   → { value: any, updatedAt: Timestamp }
 *   contactMessages/{id}      → { name, email, message, read, createdAt }
 *   meta/stats                → { pageViews, lastUpdated }
 */

import {
  doc, getDoc, setDoc, deleteDoc,
  collection, addDoc, getDocs,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'

const PORTFOLIO_COL = 'portfolioData'
const MESSAGES_COL  = 'contactMessages'
const META_COL      = 'meta'
const SECTIONS      = ['personalInfo', 'skillCategories', 'projects', 'education', 'certifications']

// ── Portfolio Data ────────────────────────────────────────────────────

/**
 * Load all portfolio sections from Firestore.
 * Returns partial object — only sections that exist in Firestore.
 */
export async function loadPortfolioData() {
  const result = {}
  await Promise.all(
    SECTIONS.map(async (section) => {
      const snap = await getDoc(doc(db, PORTFOLIO_COL, section))
      if (snap.exists()) result[section] = snap.data().value
    })
  )
  return result
}

/**
 * Save a single portfolio section to Firestore.
 * @param {string} section - e.g. 'personalInfo'
 * @param {*} value - data to save
 */
export async function saveSection(section, value) {
  await setDoc(doc(db, PORTFOLIO_COL, section), {
    value,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Reset all sections to provided defaults.
 * @param {object} defaults - object with all section defaults
 */
export async function resetAllData(defaults) {
  await Promise.all(
    SECTIONS.map((section) =>
      setDoc(doc(db, PORTFOLIO_COL, section), {
        value: defaults[section],
        updatedAt: serverTimestamp(),
      })
    )
  )
}

// ── Contact Messages ──────────────────────────────────────────────────

/**
 * Save a contact form submission.
 * @param {{ name: string, email: string, message: string }} data
 */
export async function saveContactMessage(data) {
  await addDoc(collection(db, MESSAGES_COL), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  })
}

/**
 * Fetch all contact messages (newest first). Admin only.
 * @returns {Array} messages with id field
 */
export async function getContactMessages() {
  const q = query(collection(db, MESSAGES_COL), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Delete a contact message by ID.
 * @param {string} id
 */
export async function deleteContactMessage(id) {
  await deleteDoc(doc(db, MESSAGES_COL, id))
}

// ── Visitor Stats ─────────────────────────────────────────────────────

/** Increment page view counter (best-effort, non-critical) */
export async function incrementPageView() {
  try {
    const ref = doc(db, META_COL, 'stats')
    const snap = await getDoc(ref)
    const views = snap.exists() ? (snap.data().pageViews || 0) : 0
    await setDoc(ref, { pageViews: views + 1, lastUpdated: serverTimestamp() })
  } catch { /* non-critical */ }
}

/** Get visitor stats */
export async function getVisitorStats() {
  try {
    const snap = await getDoc(doc(db, META_COL, 'stats'))
    return snap.exists() ? snap.data() : { pageViews: 0 }
  } catch {
    return { pageViews: 0 }
  }
}
