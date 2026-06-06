/**
 * DataContext.jsx — Portfolio data context powered by Firestore
 *
 * - Loads data from Firestore on mount (falls back to seed defaults)
 * - Saves changes to Firestore via updateSection()
 * - Exposes syncStatus: 'idle' | 'saving' | 'saved' | 'error'
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  personalInfo as defPersonal,
  skillCategories as defSkills,
  projects as defProjects,
  education as defEducation,
  certifications as defCerts,
} from '../data/portfolioData'
import { loadPortfolioData, saveSection, resetAllData } from '../services/firestoreService'

const defaultData = {
  personalInfo:    defPersonal,
  skillCategories: defSkills,
  projects:        defProjects,
  education:       defEducation,
  certifications:  defCerts,
}

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [data, setData]           = useState(defaultData)
  const [loading, setLoading]     = useState(true)
  const [syncStatus, setSyncStatus] = useState('idle') // 'idle'|'saving'|'saved'|'error'

  // Load from Firestore on mount
  useEffect(() => {
    let cancelled = false
    loadPortfolioData()
      .then((fsData) => {
        if (cancelled) return
        setData({ ...defaultData, ...fsData })
      })
      .catch((err) => {
        if (!cancelled) console.warn('Firestore load failed, using defaults:', err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const setSyncFor = (ms) => {
    setSyncStatus('saving')
    return { resolve: () => { setSyncStatus('saved'); setTimeout(() => setSyncStatus('idle'), 2500) },
             reject:  () => { setSyncStatus('error');  setTimeout(() => setSyncStatus('idle'), 4000) } }
  }

  const updateSection = useCallback(async (section, value) => {
    setData((prev) => ({ ...prev, [section]: value })) // optimistic
    const { resolve, reject } = setSyncFor()
    try { await saveSection(section, value); resolve() }
    catch (err) { console.error('Firestore save failed:', err); reject() }
  }, [])

  const resetSection = useCallback(async (section) => {
    const def = defaultData[section]
    setData((prev) => ({ ...prev, [section]: def }))
    const { resolve, reject } = setSyncFor()
    try { await saveSection(section, def); resolve() }
    catch (err) { console.error('Firestore reset failed:', err); reject() }
  }, [])

  const resetAll = useCallback(async () => {
    setData(defaultData)
    const { resolve, reject } = setSyncFor()
    try { await resetAllData(defaultData); resolve() }
    catch (err) { console.error('Firestore reset all failed:', err); reject() }
  }, [])

  return (
    <DataContext.Provider value={{ data, loading, syncStatus, updateSection, resetSection, resetAll }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
