import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { marked } from 'marked'

const PreviewPage = ({ afmContent }) => {
  const [renderedContent, setRenderedContent] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (afmContent) {
      setRenderedContent(marked.parse(afmContent))
    }
  }, [afmContent])

  const handleBack = () => {
    navigate('/editor')
  }

  const handleEdit = () => {
    navigate('/editor')
  }

  const handleDownload = () => {
    const blob = new Blob([afmContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'agent.afm'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!afmContent) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center py-5">
              <i className="bi bi-file-earmark-text" style={{ fontSize: '4rem', color: '#ccc' }}></i>
              <h4 className="mt-3 text-muted">No content to preview</h4>
              <p className="text-muted">Create or load an AFM file to see the preview</p>
              <button className="btn btn-primary-custom" onClick={() => navigate('/')}>
                <i className="bi bi-arrow-left me-2"></i>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          {/* Preview Toolbar */}
          <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm">
            <div className="d-flex align-items-center">
              <button className="btn btn-outline-secondary me-3" onClick={handleBack}>
                <i className="bi bi-arrow-left me-2"></i>
                Back to Editor
              </button>
              <h5 className="mb-0">
                <i className="bi bi-eye me-2"></i>
                AFM Preview
              </h5>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary" onClick={handleEdit}>
                <i className="bi bi-pencil me-2"></i>
                Edit
              </button>
              <button className="btn btn-outline-success" onClick={handleDownload}>
                <i className="bi bi-download me-2"></i>
                Download AFM
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h6 className="mb-0">
                    <i className="bi bi-robot me-2"></i>
                    Agent Preview
                  </h6>
                </div>
                <div className="card-body">
                  <div 
                    className="preview-content"
                    dangerouslySetInnerHTML={{ __html: renderedContent }}
                    style={{ 
                      minHeight: '400px',
                      fontSize: '16px',
                      lineHeight: '1.6'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="row justify-content-center mt-4">
            <div className="col-lg-10">
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">
                    <i className="bi bi-tools me-2"></i>
                    Agent Actions
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="d-grid">
                        <button className="btn btn-outline-primary">
                          <i className="bi bi-play-circle me-2"></i>
                          Test Agent
                        </button>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-grid">
                        <button className="btn btn-outline-info">
                          <i className="bi bi-cloud-upload me-2"></i>
                          Deploy Agent
                        </button>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-grid">
                        <button className="btn btn-outline-secondary">
                          <i className="bi bi-share me-2"></i>
                          Share Agent
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewPage
