import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './components/HomePage'
import EditorPage from './components/EditorPage'
import PreviewPage from './components/PreviewPage'
import DebugConsole from './components/DebugConsole'
import { debugLog } from './utils/debug'
import './App.css'

function App() {
  const [currentAfmId, setCurrentAfmId] = useState(null)
  const [isEditingExisting, setIsEditingExisting] = useState(false)
  const [afmContent, setAfmContent] = useState('')
  const [loadedMetadata, setLoadedMetadata] = useState(null)

  useEffect(() => {
    debugLog('AFM Try-it App initialized')
  }, [])

  return (
    <Router basename="/try-it">
      <div className="App">
        <Header />
        <DebugConsole />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                setCurrentAfmId={setCurrentAfmId}
                setIsEditingExisting={setIsEditingExisting}
                setAfmContent={setAfmContent}
                setLoadedMetadata={setLoadedMetadata}
              />
            } 
          />
          <Route 
            path="/editor" 
            element={
              <EditorPage 
                currentAfmId={currentAfmId}
                isEditingExisting={isEditingExisting}
                afmContent={afmContent}
                setAfmContent={setAfmContent}
                loadedMetadata={loadedMetadata}
                setLoadedMetadata={setLoadedMetadata}
              />
            } 
          />
          <Route 
            path="/preview" 
            element={
              <PreviewPage 
                afmContent={afmContent}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
