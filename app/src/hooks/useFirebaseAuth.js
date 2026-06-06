/**
 * useFirebaseAuth.js — Firebase Auth hook
 * Provides: user, loading, error, signIn(), signOut()
 */
import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from 'firebase/auth'
import { auth } from '../config/firebase'

export function useFirebaseAuth() {
  const [user, setUser]       = useState(undefined) // undefined = still loading
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  async function signIn(email, password) {
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (err) {
      const msgs = {
        'auth/user-not-found':     'No account found with this email.',
        'auth/wrong-password':     'Incorrect password.',
        'auth/invalid-email':      'Invalid email address.',
        'auth/too-many-requests':  'Too many attempts. Try again later.',
        'auth/invalid-credential': 'Invalid email or password.',
      }
      setError(msgs[err.code] || 'Login failed. Please try again.')
      return false
    }
  }

  async function signOut() {
    await fbSignOut(auth)
  }

  return { user, loading, error, signIn, signOut, setError }
}
