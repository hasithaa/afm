import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import EasyMDE from 'easymde'
import { marked } from 'marked'
import { saveToLocalStorage } from '../utils/storage'
import { debugLog } from '../utils/debug'
import HubSpokeEditor from './HubSpokeEditor'

const EditorPage = ({ currentAfmId, isEditingExisting, afmContent, setAfmContent, loadedMetadata, setLoadedMetadata }) => {
  const [editorMode, setEditorMode] = useState('pro-code')
  const [easyMDE, setEasyMDE] = useState(null)
  const [previewContent, setPreviewContent] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isAgentDetailsCollapsed, setIsAgentDetailsCollapsed] = useState(false)
  const [isAgentConnectionsCollapsed, setIsAgentConnectionsCollapsed] = useState(false)
  
  // Metadata form state
  const [metadata, setMetadata] = useState({
    identifier: '',
    name: '',
    description: '',
    version: '',
    namespace: '',
    license: '',
    authors: [],
    provider: { organization: '', url: '' },
    iconUrl: '',
    mcpServers: [],
    toolFilters: { allow: [], deny: [] }
  })
  
  const editorRef = useRef(null)
  const navigate = useNavigate()

  // Load metadata when editing existing AFM
  useEffect(() => {
    if (isEditingExisting && loadedMetadata) {
      setMetadata({
        identifier: loadedMetadata.identifier || '',
        name: loadedMetadata.name || '',
        description: loadedMetadata.description || '',
        version: loadedMetadata.version || '',
        namespace: loadedMetadata.namespace || '',
        license: loadedMetadata.license || '',
        authors: loadedMetadata.authors || [],
        provider: loadedMetadata.provider || { organization: '', url: '' },
        iconUrl: loadedMetadata.iconUrl || '',
        mcpServers: loadedMetadata.mcpServers || [],
        toolFilters: loadedMetadata.toolFilters || { allow: [], deny: [] }
      })
    }
  }, [isEditingExisting, loadedMetadata])

  useEffect(() => {
    if (editorMode === 'pro-code') {
      // Clean up any existing editor first
      if (easyMDE) {
        try {
          easyMDE.toTextArea()
        } catch (err) {
          console.warn('Error cleaning up EasyMDE:', err)
        }
        setEasyMDE(null)
      }
      // Initialize editor after a small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initEditor()
      }, 100)
      return () => clearTimeout(timer)
    } else {
      // Clean up editor when switching to hub-spoke mode
      if (easyMDE) {
        try {
          easyMDE.toTextArea()
        } catch (err) {
          console.warn('Error cleaning up EasyMDE:', err)
        }
        setEasyMDE(null)
      }
    }
  }, [editorMode])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (easyMDE) {
        try {
          easyMDE.toTextArea()
        } catch (err) {
          console.warn('Error cleaning up EasyMDE on unmount:', err)
        }
        setEasyMDE(null)
      }
    }
  }, [])

  // Load content into editor when it's ready - but avoid cursor reset
  useEffect(() => {
    if (easyMDE && afmContent && editorMode === 'pro-code') {
      // Only set content if it's different to avoid cursor jumping
      if (easyMDE.value() !== afmContent) {
        const cursor = easyMDE.codemirror.getCursor()
        easyMDE.value(afmContent)
        // Restore cursor position after a short delay
        setTimeout(() => {
          if (easyMDE.codemirror) {
            easyMDE.codemirror.setCursor(cursor)
          }
        }, 10)
      }
      parseMetadataFromContent(afmContent)
    }
  }, [easyMDE, editorMode]) // Removed afmContent dependency to prevent cursor jumping

  const initEditor = () => {
    if (editorRef.current && !easyMDE && editorMode === 'pro-code') {
      try {
        debugLog('Initializing EasyMDE editor')
        
        // Clear any existing CodeMirror instances
        const existingEditor = editorRef.current.nextSibling
        if (existingEditor && existingEditor.classList && existingEditor.classList.contains('CodeMirror')) {
          existingEditor.remove()
        }
        
        // Ensure textarea is visible for EasyMDE initialization
        editorRef.current.style.display = 'block'
        
        const editor = new EasyMDE({
          element: editorRef.current,
          autofocus: false,
          spellChecker: false,
          status: ['lines', 'words', 'cursor'],
          renderingConfig: {
            singleLineBreaks: false,
            codeSyntaxHighlighting: true,
          },
          toolbar: [
            'bold', 'italic', 'heading', '|',
            'unordered-list', 'ordered-list', '|',
            'link', 'image', 'code', '|',
            'undo', 'redo'
          ]
        })

        editor.codemirror.on('change', () => {
          const content = editor.value()
          setAfmContent(content)
          if (showPreview) {
            setPreviewContent(marked.parse(content))
          }
        })

        setEasyMDE(editor)
        debugLog('EasyMDE editor initialized successfully')
        
        // Set initial content if available, without affecting cursor
        if (afmContent && afmContent !== editor.value()) {
          editor.value(afmContent)
        }
      } catch (err) {
        debugLog('Error initializing EasyMDE: ' + err.message)
        console.error('Error initializing EasyMDE:', err)
      }
    }
  }

  const parseMetadataFromContent = (content) => {
    // Disabled auto-parsing to prevent unwanted field population
    // Users should fill metadata manually
  }

  const updateMetadataField = (field, value) => {
    // Validate agent identifier format
    if (field === 'identifier') {
      // Remove invalid characters and convert to lowercase
      value = value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
      // Ensure it starts with alphanumeric character
      if (value && !/^[a-z0-9]/.test(value)) {
        value = value.replace(/^[^a-z0-9]*/, '')
      }
    }
    
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNestedMetadata = (path, value) => {
    setMetadata(prev => {
      const newMetadata = { ...prev }
      const keys = path.split('.')
      let current = newMetadata
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newMetadata
    })
  }

  const addAuthor = () => {
    const nameInput = document.getElementById('author-name-input')
    const emailInput = document.getElementById('author-email-input')
    
    if (nameInput?.value && emailInput?.value) {
      const newAuthor = `${nameInput.value} <${emailInput.value}>`
      setMetadata(prev => ({
        ...prev,
        authors: [...prev.authors, newAuthor]
      }))
      nameInput.value = ''
      emailInput.value = ''
    }
  }

  const removeAuthor = (index) => {
    setMetadata(prev => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index)
    }))
  }

  const handleBack = () => {
    navigate('/')
  }

  const handlePreview = () => {
    const content = getCurrentContent()
    if (content) {
      setAfmContent(content)
    }
    navigate('/preview')
  }

  const getCurrentContent = () => {
    if (editorMode === 'pro-code' && easyMDE) {
      return easyMDE.value()
    }
    return afmContent
  }

  const generateAfmWithFrontMatter = (content) => {
    const frontMatter = []
    frontMatter.push('---')
    if (metadata.identifier) frontMatter.push(`identifier: "${metadata.identifier}"`)
    if (metadata.name) frontMatter.push(`name: "${metadata.name}"`)
    if (metadata.description) frontMatter.push(`description: "${metadata.description}"`)
    if (metadata.version) frontMatter.push(`version: "${metadata.version}"`)
    if (metadata.namespace) frontMatter.push(`namespace: "${metadata.namespace}"`)
    if (metadata.license) frontMatter.push(`license: "${metadata.license}"`)
    if (metadata.iconUrl) frontMatter.push(`iconUrl: "${metadata.iconUrl}"`)
    frontMatter.push('---')
    frontMatter.push('')
    
    return frontMatter.join('\n') + content
  }

  const handleDownload = () => {
    if (!metadata.identifier) {
      alert('Please enter an Agent Identifier before downloading.')
      return
    }
    
    const content = getCurrentContent()
    if (content) {
      const afmContent = generateAfmWithFrontMatter(content)
      const blob = new Blob([afmContent], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${metadata.identifier}.afm.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleSaveLocal = () => {
    if (!metadata.identifier) {
      alert('Please enter an Agent Identifier before saving.')
      return
    }
    
    const content = getCurrentContent()
    if (content) {
      const afm = {
        id: metadata.identifier,
        title: metadata.name || metadata.identifier,
        description: metadata.description || extractDescription(content),
        content: content,
        metadata: metadata,
        lastModified: Date.now()
      }
      saveToLocalStorage(afm)
      alert('AFM saved locally!')
    }
  }

  const extractTitle = (content) => {
    const lines = content.split('\n')
    for (const line of lines) {
      if (line.startsWith('# ')) {
        return line.substring(2).trim()
      }
    }
    return null
  }

  const extractDescription = (content) => {
    const lines = content.split('\n')
    let foundTitle = false
    for (const line of lines) {
      if (line.startsWith('# ')) {
        foundTitle = true
        continue
      }
      if (foundTitle && line.trim() && !line.startsWith('#')) {
        return line.trim()
      }
    }
    return null
  }

  const togglePreview = () => {
    const content = getCurrentContent()
    if (!showPreview) {
      // Showing source code
      if (content) {
        const fullAfmSource = generateAfmWithFrontMatter(content)
        setPreviewContent(fullAfmSource)
      }
      setShowPreview(true)
    } else {
      // Hiding source code, set default to Pro-Code
      setShowPreview(false)
      setEditorMode('pro-code')
    }
  }

  const renderMetadataForm = () => {
    return (
      <div className="metadata-section">
        {/* Agent Details Section */}
        <div className="metadata-main-section mb-4">
          <div 
            className="metadata-section-header clickable"
            onClick={() => setIsAgentDetailsCollapsed(!isAgentDetailsCollapsed)}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="text-primary mb-0">
                <i className="bi bi-person-gear me-2"></i>
                Agent Details
              </h6>
              <i className={`bi ${isAgentDetailsCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'}`}></i>
            </div>
          </div>
          {!isAgentDetailsCollapsed && (
            <div className="metadata-section-content">
              {/* Basic Information */}
              <div className="metadata-subsection mb-3">
                <div className="form-group mb-3">
                  <label htmlFor="agent-name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="agent-name"
                    placeholder=""
                    value={metadata.name}
                    onChange={(e) => updateMetadataField('name', e.target.value)}
                  />
                  <small className="form-text text-muted">
                    A human-readable name for your agent.
                  </small>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="agent-description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="agent-description"
                    rows="3"
                    placeholder="Brief description of the agent's purpose"
                    value={metadata.description}
                    onChange={(e) => updateMetadataField('description', e.target.value)}
                  />
                  <small className="form-text text-muted">
                    A short summary of what your agent does.
                  </small>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="agent-version" className="form-label">Version</label>
                  <input
                    type="text"
                    className="form-control"
                    id="agent-version"
                    placeholder=""
                    value={metadata.version}
                    onChange={(e) => updateMetadataField('version', e.target.value)}
                  />
                  <small className="form-text text-muted">
                    Semantic versioning (MAJOR.MINOR.PATCH).
                  </small>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="agent-namespace" className="form-label">Namespace</label>
                  <input
                    type="text"
                    className="form-control"
                    id="agent-namespace"
                    placeholder="e.g. education"
                    value={metadata.namespace}
                    onChange={(e) => updateMetadataField('namespace', e.target.value)}
                  />
                  <small className="form-text text-muted">
                    Category or domain for your agent.
                  </small>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="agent-license" className="form-label">License</label>
                  <input
                    type="text"
                    className="form-control"
                    id="agent-license"
                    placeholder="e.g. MIT, Apache 2.0"
                    value={metadata.license}
                    onChange={(e) => updateMetadataField('license', e.target.value)}
                  />
                  <small className="form-text text-muted">
                    The license under which this agent is released.
                  </small>
                </div>
              </div>

              {/* Authors & Provider */}
              <div className="metadata-subsection mb-3">
                <h6 className="text-secondary mb-3">
                  <i className="bi bi-people me-2"></i>
                  Authors & Provider
                </h6>
                
                <div className="form-group mb-3">
                  <label className="form-label">Authors</label>
                  <div className="author-tags mb-2">
                    {metadata.authors.map((author, index) => (
                      <span key={index} className="badge bg-secondary me-2 mb-2">
                        {author}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-2"
                          onClick={() => removeAuthor(index)}
                          style={{ fontSize: '0.6em' }}
                        ></button>
                      </span>
                    ))}
                  </div>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      id="author-name-input"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      className="form-control"
                      id="author-email-input"
                      placeholder="Email"
                    />
                    <button className="btn btn-outline-secondary" onClick={addAuthor}>
                      Add
                    </button>
                  </div>
                  <small className="form-text text-muted">
                    Format: Name &lt;email@example.com&gt;
                  </small>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Provider</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Organization name"
                    value={metadata.provider.organization}
                    onChange={(e) => updateNestedMetadata('provider.organization', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="URL (e.g. https://example.com)"
                    value={metadata.provider.url}
                    onChange={(e) => updateNestedMetadata('provider.url', e.target.value)}
                  />
                  <small className="form-text text-muted">
                    The organization providing this agent and its website.
                  </small>
                </div>
              </div>

              {/* Additional Details */}
              <div className="metadata-subsection">
                <h6 className="text-secondary mb-3">
                  <i className="bi bi-gear me-2"></i>
                  Additional Details
                </h6>
                
                <div className="form-group mb-3">
                  <label htmlFor="agent-iconurl" className="form-label">Icon URL</label>
                  <input
                    type="text"
                    className="form-control"
                    id="agent-iconurl"
                    placeholder="https://example.com/icon.png"
                    value={metadata.iconUrl}
                    onChange={(e) => updateMetadataField('iconUrl', e.target.value)}
                  />
                  <small className="form-text text-muted">
                    URL to an image that represents your agent.
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Agent Connections Section */}
        <div className="metadata-main-section">
          <div 
            className="metadata-section-header clickable"
            onClick={() => setIsAgentConnectionsCollapsed(!isAgentConnectionsCollapsed)}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="text-primary mb-0">
                <i className="bi bi-diagram-3 me-2"></i>
                Agent Connections
              </h6>
              <i className={`bi ${isAgentConnectionsCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'}`}></i>
            </div>
          </div>
          {!isAgentConnectionsCollapsed && (
            <div className="metadata-section-content">
              <div className="form-group mb-3">
                <label className="form-label">MCP Connections</label>
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  MCP (Model Context Protocol) connections will be implemented in a future version.
                </div>
              </div>

              <div className="text-muted p-3 text-center mt-4">
                <p>Additional connection options will be available in future versions.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      {/* Editor Toolbar */}
      <div className="row">
        <div className="col-12">
          <div className="editor-toolbar">
            <div className="d-flex align-items-center justify-content-between w-100">
              <button className="btn btn-outline-secondary" onClick={handleBack}>
                <i className="bi bi-arrow-left me-2"></i>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor Content */}
      <div className="row mt-3">
        {/* AFM Editor Header - Full Width */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="d-flex align-items-center gap-3">
                  <h5 className="mb-0">
                    <i className="bi bi-code-slash me-2"></i>
                    AFM Editor
                  </h5>
                  
                  <div className="d-flex align-items-center gap-2">
                    <label htmlFor="header-agent-identifier" className="form-label mb-0 small">
                      Agent Identifier <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-sm ${!metadata.identifier ? 'is-invalid' : metadata.identifier && /^[a-z0-9][a-z0-9_-]*$/.test(metadata.identifier) ? 'is-valid' : 'is-invalid'}`}
                      id="header-agent-identifier"
                      placeholder="e.g. math-tutor"
                      value={metadata.identifier}
                      onChange={(e) => updateMetadataField('identifier', e.target.value)}
                      required
                      style={{ width: '200px' }}
                    />
                  </div>
                  
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-success btn-sm" onClick={handleDownload}>
                      <i className="bi bi-download me-2"></i>
                      Download
                    </button>
                    <button className="btn btn-outline-warning btn-sm" onClick={handleSaveLocal}>
                      <i className="bi bi-save me-2"></i>
                      Save Local
                    </button>
                  </div>
                </div>
                
                <div className="d-flex align-items-center gap-2">
                  {!showPreview && (
                    <div className="editor-mode-toggle">
                      <div className="btn-group" role="group" aria-label="Editor mode toggle">
                        <button 
                          className={`btn btn-sm ${editorMode === 'pro-code' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setEditorMode('pro-code')}
                        >
                          <i className="bi bi-code-slash me-2"></i>
                          Pro Code
                        </button>
                        <button 
                          className={`btn btn-sm ${editorMode === 'hub-spoke' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setEditorMode('hub-spoke')}
                        >
                          <i className="bi bi-diagram-3 me-2"></i>
                          Low-Code
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    className="btn btn-outline-info btn-sm"
                    onClick={togglePreview}
                  >
                    <i className={`bi ${showPreview ? 'bi-eye-slash' : 'bi-code'} me-2`}></i>
                    {showPreview ? 'Hide Source' : 'Show Source Code'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content - 2 Column Layout */}
      <div className="row mt-3">
        {/* Left Column - Markdown Editor */}
        {!showPreview && (
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0 small">
                  <i className="bi bi-pencil-square me-2"></i>
                  Describe your Agent
                </h6>
                <p className="text-muted small mb-0 mt-1">Write a brief description of your agent's purpose and functionality.</p>
              </div>
              <div className="card-body p-0">
                {editorMode === 'pro-code' ? (
                  <div key="pro-code-editor" style={{ minHeight: '500px' }}>
                    <textarea
                      ref={editorRef}
                      defaultValue={afmContent}
                      style={{ 
                        width: '100%', 
                        minHeight: '500px',
                        border: 'none',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        padding: '1rem'
                      }}
                    />
                    {!easyMDE && (
                      <div className="position-absolute top-50 start-50 translate-middle">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading editor...</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div key="hub-spoke-editor" style={{ position: 'relative' }}>
                    <HubSpokeEditor 
                      metadata={metadata}
                      updateMetadata={setMetadata}
                      afmContent={afmContent}
                      setAfmContent={setAfmContent}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Right Column - Metadata Editor */}
        {!showPreview && (
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0 small">
                  <i className="bi bi-gear me-2"></i>
                  Agent Metadata
                </h6>
              </div>
              <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {renderMetadataForm()}
              </div>
            </div>
          </div>
        )}

        {/* Preview Panel (if enabled) */}
        {showPreview && (
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-code me-2"></i>
                  AFM Source Code
                </h5>
              </div>
              <div className="card-body">
                <pre 
                  className="preview-content"
                  style={{ 
                    maxHeight: '500px', 
                    overflowY: 'auto',
                    fontSize: '0.875rem',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '0.375rem',
                    padding: '1rem',
                    margin: 0,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {previewContent}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="row mt-3">
        <div className="col-12">
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Create your Agent Flavored Markdown file by filling in the metadata form and writing your agent's content in markdown format.{' '}
            <a href="#" className="alert-link">View the AFM Specification</a> for more guidance.
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorPage
