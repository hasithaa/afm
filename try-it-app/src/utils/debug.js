// Debug utility functions
export const debugLog = (message) => {
  console.log(`[AFM] ${message}`)
  
  // Dispatch custom event for debug console
  const event = new CustomEvent('debugLog', { detail: message })
  window.dispatchEvent(event)
}

export const debugError = (message, error) => {
  console.error(`[AFM ERROR] ${message}`, error)
  
  const event = new CustomEvent('debugLog', { 
    detail: `ERROR: ${message} - ${error?.message || error}` 
  })
  window.dispatchEvent(event)
}

export const debugWarn = (message) => {
  console.warn(`[AFM WARN] ${message}`)
  
  const event = new CustomEvent('debugLog', { detail: `WARN: ${message}` })
  window.dispatchEvent(event)
}
