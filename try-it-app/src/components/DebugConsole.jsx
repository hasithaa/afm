import React, { useState, useEffect } from 'react'

const DebugConsole = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    // Listen for debug logs
    const handleDebugLog = (event) => {
      setLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        message: event.detail
      }])
    }

    window.addEventListener('debugLog', handleDebugLog)
    return () => window.removeEventListener('debugLog', handleDebugLog)
  }, [])

  const toggleDebug = () => {
    setIsVisible(!isVisible)
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <>
      <div className="debug-toggle" onClick={toggleDebug}>
        <i className="bi bi-bug"></i>
      </div>

      <div className={`debug-info ${isVisible ? 'show' : ''}`}>
        <div className="debug-header">
          <span>Debug Console</span>
          <div>
            <button 
              className="debug-close-btn me-2" 
              onClick={clearLogs}
              title="Clear logs"
            >
              <i className="bi bi-trash"></i>
            </button>
            <button className="debug-close-btn" onClick={toggleDebug}>
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>
        <div className="debug-content">
          {logs.length === 0 ? (
            <div style={{ color: '#666' }}>No debug logs yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ marginBottom: '4px' }}>
                <span style={{ color: '#888', fontSize: '10px' }}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span style={{ marginLeft: '8px' }}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default DebugConsole
