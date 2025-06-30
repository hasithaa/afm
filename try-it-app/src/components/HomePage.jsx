import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadFromLocalStorage, removeFromLocalStorage } from '../utils/storage'
import { DEFAULT_AFM_CONTENT } from '../utils/templates'

const HomePage = ({ setCurrentAfmId, setIsEditingExisting, setAfmContent, setLoadedMetadata }) => {
  const [savedAfms, setSavedAfms] = useState([])
  const [activeTab, setActiveTab] = useState('upload')
  const [dragover, setDragover] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadSavedAfms()
  }, [])

  const loadSavedAfms = () => {
    const afms = loadFromLocalStorage()
    setSavedAfms(afms)
  }

  const parseFileContent = (content) => {
    // Check if content has front matter (starts with ---)
    if (content.startsWith('---')) {
      const frontMatterEnd = content.indexOf('---', 3)
      if (frontMatterEnd !== -1) {
        const frontMatter = content.substring(3, frontMatterEnd).trim()
        const extractedContent = content.substring(frontMatterEnd + 3).trim()
        
        // Parse YAML front matter
        const extractedMetadata = {}
        const lines = frontMatter.split('\n')
        for (const line of lines) {
          const colonIndex = line.indexOf(':')
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim()
            const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '')
            extractedMetadata[key] = value
          }
        }
        
        return { extractedContent, extractedMetadata }
      }
    }
    
    // No front matter, return content as-is
    return { extractedContent: content, extractedMetadata: {} }
  }

  const handleCreateNew = () => {
    setCurrentAfmId(null)
    setIsEditingExisting(false)
    setAfmContent(DEFAULT_AFM_CONTENT)
    setLoadedMetadata(null)
    navigate('/editor')
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && (file.name.endsWith('.afm') || file.name.endsWith('.afm.md'))) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        const { extractedContent, extractedMetadata } = parseFileContent(content)
        
        // Extract identifier from filename
        let filename = file.name
        if (filename.endsWith('.afm.md')) {
          filename = filename.slice(0, -7) // Remove .afm.md
        } else if (filename.endsWith('.afm')) {
          filename = filename.slice(0, -4) // Remove .afm
        }
        
        // Add filename as identifier if not present in metadata
        if (!extractedMetadata.identifier) {
          extractedMetadata.identifier = filename
        }
        
        setAfmContent(extractedContent)
        setLoadedMetadata(extractedMetadata)
        setCurrentAfmId(null)
        setIsEditingExisting(false)
        navigate('/editor')
      }
      reader.readAsText(file)
    } else {
      alert('Please select a valid .afm or .afm.md file')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragover(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragover(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragover(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.name.endsWith('.afm') || file.name.endsWith('.afm.md')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target.result
          const { extractedContent, extractedMetadata } = parseFileContent(content)
          
          // Extract identifier from filename
          let filename = file.name
          if (filename.endsWith('.afm.md')) {
            filename = filename.slice(0, -7) // Remove .afm.md
          } else if (filename.endsWith('.afm')) {
            filename = filename.slice(0, -4) // Remove .afm
          }
          
          // Add filename as identifier if not present in metadata
          if (!extractedMetadata.identifier) {
            extractedMetadata.identifier = filename
          }
          
          setAfmContent(extractedContent)
          setLoadedMetadata(extractedMetadata)
          setCurrentAfmId(null)
          setIsEditingExisting(false)
          navigate('/editor')
        }
        reader.readAsText(file)
      } else {
        alert('Please drop a valid .afm or .afm.md file')
      }
    }
  }

  const handleLoadAfm = (afm) => {
    setCurrentAfmId(afm.id)
    setIsEditingExisting(true)
    setAfmContent(afm.content)
    setLoadedMetadata(afm.metadata || null)
    navigate('/editor')
  }

  const handleDeleteAfm = (afmId, e) => {
    e.stopPropagation()
    removeFromLocalStorage(afmId)
    loadSavedAfms()
  }

  const handleRunAfm = (afm, e) => {
    e.stopPropagation()
    setAfmContent(afm.content)
    navigate('/preview')
  }

  return (
    <div className="home-container">
      <h1 className="text-center mb-4">Agent Flavored Markdown</h1>
      <p className="lead mb-4 text-center">Create, deploy, and interact with AI agents using the AFM standard</p>
      
      {/* Workflow Steps */}
      <div className="workflow-steps mb-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="workflow-step">
              <div className="step-icon">
                <i className="bi bi-pencil-square"></i>
              </div>
              <h3>1. Create AFM</h3>
              <p>Write your agent's behavior, tools, and capabilities in Agent Flavored Markdown format</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="workflow-step">
              <div className="step-icon">
                <i className="bi bi-eye"></i>
              </div>
              <h3>2. Preview & Test</h3>
              <p>See how your agent will appear and test its functionality before deployment</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="workflow-step">
              <div className="step-icon">
                <i className="bi bi-cloud-upload"></i>
              </div>
              <h3>3. Deploy</h3>
              <p>Export or deploy your agent to your preferred platform or framework</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons mb-5">
        <button className="btn btn-primary-custom" onClick={handleCreateNew}>
          <i className="bi bi-plus-circle me-2"></i>
          Create New AFM
        </button>
        <button className="btn btn-outline-custom" onClick={() => setActiveTab('saved')}>
          <i className="bi bi-folder me-2"></i>
          Browse Saved
        </button>
      </div>

      {/* Tabs */}
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                <i className="bi bi-upload me-2"></i>
                Upload AFM File
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={() => setActiveTab('saved')}
              >
                <i className="bi bi-folder me-2"></i>
                Saved AFMs ({savedAfms.length})
              </button>
            </li>
          </ul>

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="tab-content">
              <div 
                className={`file-upload-area ${dragover ? 'dragover' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload-input').click()}
              >
                <div className="file-upload-icon">
                  <i className="bi bi-cloud-upload"></i>
                </div>
                <h4>Drop your AFM file here</h4>
                <p className="text-muted">or click to browse</p>
                <input
                  type="file"
                  id="file-upload-input"
                  accept=".afm,.md"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          )}

          {/* Saved Tab */}
          {activeTab === 'saved' && (
            <div className="tab-content">
              {savedAfms.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-folder-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                  <h4 className="mt-3 text-muted">No saved AFMs</h4>
                  <p className="text-muted">Create your first AFM to get started</p>
                  <button className="btn btn-primary-custom" onClick={handleCreateNew}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Create New AFM
                  </button>
                </div>
              ) : (
                <div className="saved-afms-list">
                  {savedAfms.map((afm) => (
                    <div 
                      key={afm.id} 
                      className="saved-afm-item"
                      onClick={() => handleLoadAfm(afm)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="saved-afm-header">
                        <div className="saved-afm-title">
                          {afm.metadata?.identifier || afm.title || 'Untitled AFM'}
                        </div>
                        <div className="saved-afm-date">
                          {new Date(afm.lastModified).toLocaleDateString()}
                        </div>
                      </div>
                      {afm.metadata?.name && afm.metadata.name !== afm.metadata?.identifier && (
                        <div className="saved-afm-subtitle">{afm.metadata.name}</div>
                      )}
                      {afm.description && (
                        <div className="saved-afm-description">{afm.description}</div>
                      )}
                      <div className="saved-afm-actions">
                        <button 
                          className="btn btn-sm btn-outline-primary btn-sm-custom"
                          onClick={(e) => handleLoadAfm(afm)}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-success btn-sm-custom"
                          onClick={(e) => handleRunAfm(afm, e)}
                        >
                          <i className="bi bi-play me-1"></i>
                          Run
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger btn-sm-custom"
                          onClick={(e) => handleDeleteAfm(afm.id, e)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
