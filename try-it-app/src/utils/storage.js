// Local storage utility functions
const STORAGE_KEY = 'afm-saved-files'

export const saveToLocalStorage = (afm) => {
  try {
    const saved = loadFromLocalStorage()
    const existingIndex = saved.findIndex(item => item.id === afm.id)
    
    if (existingIndex >= 0) {
      saved[existingIndex] = afm
    } else {
      saved.push(afm)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    return true
  } catch (error) {
    console.error('Error saving to localStorage:', error)
    return false
  }
}

export const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return []
  }
}

export const removeFromLocalStorage = (afmId) => {
  try {
    const saved = loadFromLocalStorage()
    const filtered = saved.filter(item => item.id !== afmId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error removing from localStorage:', error)
    return false
  }
}

export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Error clearing localStorage:', error)
    return false
  }
}
