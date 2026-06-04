import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  personalInfo as defaultPersonal,
  skillCategories as defaultSkills,
  projects as defaultProjects,
  education as defaultEducation,
  certifications as defaultCerts,
} from '../data/portfolioData'

const STORAGE_KEY = 'kv_portfolio_data'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save portfolio data to localStorage', e)
  }
}

const defaultData = {
  personalInfo: defaultPersonal,
  skillCategories: defaultSkills,
  projects: defaultProjects,
  education: defaultEducation,
  certifications: defaultCerts,
}

const PortfolioDataContext = createContext(null)

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState(() => {
    const stored = loadFromStorage()
    return stored ? { ...defaultData, ...stored } : defaultData
  })

  const updateSection = useCallback((section, value) => {
    setData((prev) => {
      const next = { ...prev, [section]: value }
      saveToStorage(next)
      return next
    })
  }, [])

  const resetSection = useCallback((section) => {
    setData((prev) => {
      const next = { ...prev, [section]: defaultData[section] }
      saveToStorage(next)
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setData(defaultData)
  }, [])

  return (
    <PortfolioDataContext.Provider value={{ data, updateSection, resetSection, resetAll }}>
      {children}
    </PortfolioDataContext.Provider>
  )
}

export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext)
  if (!ctx) throw new Error('usePortfolioData must be used inside PortfolioDataProvider')
  return ctx
}
