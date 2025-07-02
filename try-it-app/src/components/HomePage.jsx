import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadFromLocalStorage, removeFromLocalStorage } from '../utils/storage'
import { DEFAULT_AFM_CONTENT } from '../utils/templates'

const HomePage = ({ setCurrentAfmId, setIsEditingExisting, setAfmContent, setLoadedMetadata }) => {
  const [savedAfms, setSavedAfms] = useState([])
  const [activeTab, setActiveTab] = useState('examples')
  const [dragover, setDragover] = useState(false)
  const navigate = useNavigate()

  // Example AFM files
  const examples = [
    {
      id: 'math-tutor',
      title: 'Math Tutor',
      description: 'An AI assistant that helps with mathematics problems, with MCP integration for external computation tools',
      content: `# Role

The Math Tutor is an AI agent designed to assist students with mathematics problems, providing explanations, step-by-step solutions, and practice exercises.

# Instructions

- Use clear and concise language when explaining concepts
- Provide examples to illustrate complex ideas
- Encourage students to think critically and solve problems independently
- When using external tools, explain what the tool does before using it
- Always show your work step-by-step
- Adapt explanations to the student's level of understanding

## Capabilities

This agent should be able to:

- Answer questions about mathematical concepts
- Solve equations and provide step-by-step solutions
- Generate practice problems and quizzes
- Provide explanations and tips for solving math problems
- Create graphs and visualizations for mathematical functions
- Access external mathematical computation tools via MCP
`,
      metadata: {
        identifier: 'math-tutor',
        name: 'Math Tutor',
        description: 'An AI assistant that helps with mathematics problems',
        version: '1.0.0',
        namespace: 'education',
        license: 'MIT',
        authors: ['Jane Smith <jane@example.com>'],
        provider: {
          organization: 'Example AI Solutions',
          url: 'https://example.com'
        },
        iconUrl: 'https://example.com/math-icon.png',
        interface: {
          type: 'service',
          signature: {
            input: [
              {
                name: 'user_prompt',
                type: 'string',
                description: 'The student\'s math question or problem',
                required: true
              },
              {
                name: 'difficulty_level',
                type: 'string',
                description: 'Beginner, intermediate, or advanced',
                required: false
              }
            ],
            output: [
              {
                name: 'solution',
                type: 'string',
                description: 'Step-by-step solution to the problem'
              },
              {
                name: 'explanation',
                type: 'string',
                description: 'Educational explanation of concepts used'
              }
            ]
          },
          exposure: {
            http: {
              path: '/math-tutor'
            },
            a2a: {
              discoverable: true,
              agent_card: {
                name: 'Math Tutor Service',
                description: 'Expert mathematics tutoring and problem solving',
                icon: 'https://example.com/math-tutor-service.png'
              }
            }
          }
        },
        connections: {
          mcp: {
            servers: [
              {
                name: 'wolfram_alpha',
                transport: {
                  type: 'http_sse',
                  url: 'https://mcp.wolframalpha.com/api'
                }
              },
              {
                name: 'graphing_tools',
                transport: {
                  type: 'stdio',
                  command: 'npx -y @modelcontextprotocol/server-graphing'
                }
              }
            ],
            tool_filter: {
              allow: ['wolfram_alpha/solve_equation', 'wolfram_alpha/calculate', 'graphing_tools/plot_function'],
              deny: []
            }
          },
          a2a: {
            peers: []
          }
        }
      }
    },
    {
      id: 'simple-assistant',
      title: 'Simple Assistant',
      description: 'A basic AI assistant for general tasks without external connections',
      content: `# Role

You are a helpful AI assistant designed to help users with general questions and tasks.

# Instructions

- Be polite and professional in all interactions
- Provide accurate and helpful information
- Ask clarifying questions when needed
- Be concise but thorough in responses
- Admit when you don't know something

## Capabilities

This agent should be able to:

- Answer general knowledge questions
- Provide explanations and summaries
- Help with writing and editing
- Offer suggestions and recommendations
- Engage in helpful conversations`,
      metadata: {
        identifier: 'simple-assistant',
        name: 'Simple Assistant',
        description: 'A helpful AI assistant for general tasks',
        version: '1.0.0',
        namespace: 'general',
        license: 'MIT',
        authors: ['Example User <user@example.com>']
      }
    },
    {
      id: 'research-agent',
      title: 'Research Agent',
      description: 'A research-focused agent with collaboration capabilities',
      content: `# Role

The Research Agent is specialized in finding, analyzing, and summarizing research papers and academic content.


# Instructions

- Always provide accurate citations
- Maintain objectivity when analyzing research
- Explain complex concepts in understandable terms
- Flag potential conflicts of interest or biases
- Suggest related research areas when relevant

## Capabilities

This agent should be able to:

- Search for and analyze research papers
- Summarize complex academic content
- Identify key findings and conclusions
- Compare different research approaches
- Provide citations and references
- Collaborate with other research agents`,
      metadata: {
        identifier: 'research-agent',
        name: 'Research Agent',
        description: 'Expert in finding, analyzing, and summarizing research papers',
        version: '1.0.0',
        namespace: 'research',
        license: 'MIT',
        authors: ['Research Team <research@example.com>'],
        interface: {
          type: 'service',
          signature: {
            input: [
              {
                name: 'user_prompt',
                type: 'string',
                description: 'Research query or topic to investigate',
                required: true
              },
              {
                name: 'search_scope',
                type: 'string',
                description: 'Scope of research (recent, comprehensive, specific field)',
                required: false
              }
            ],
            output: [
              {
                name: 'research_summary',
                type: 'string',
                description: 'Comprehensive research summary'
              },
              {
                name: 'citations',
                type: 'json',
                description: 'List of academic citations and references'
              }
            ]
          },
          exposure: {
            http: {
              path: '/research-agent'
            },
            a2a: {
              discoverable: true,
              agent_card: {
                name: 'Research Assistant',
                description: 'Expert in finding, analyzing, and summarizing research papers',
                icon: 'https://example.com/icons/research-assistant.png'
              }
            }
          }
        },
        connections: {
          mcp: {
            servers: [
              {
                name: 'arxiv_search',
                transport: {
                  type: 'http_sse',
                  url: 'https://mcp.arxiv.org/api'
                }
              }
            ],
            tool_filter: {
              allow: ['arxiv_search/search_papers', 'arxiv_search/get_paper_details'],
              deny: []
            }
          },
          a2a: {
            peers: [
              {
                name: 'citation_formatter',
                endpoint: 'https://agents.example.com/citation-formatter'
              }
            ]
          }
        }
      }
    }
  ]

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

  const handleLoadExample = (example) => {
    setCurrentAfmId(null)
    setIsEditingExisting(false)
    setAfmContent(example.content)
    setLoadedMetadata(example.metadata)
    navigate('/editor')
  }

  return (
    <div className="home-container">
      <h1 className="text-center mb-4">Agent Flavored Markdown</h1>
      <p className="lead mb-4 text-center">Create, deploy, and interact with AI agents using the AFM standard</p>
      
      {/* Main Focus */}

      {/* Action Buttons */}
      <div className="action-buttons mb-5">
        <button className="btn btn-primary-custom" onClick={handleCreateNew}>
          <i className="bi bi-plus-circle me-2"></i>
          Create New AFM
        </button>
      </div>

      {/* Tabs */}
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'examples' ? 'active' : ''}`}
                onClick={() => setActiveTab('examples')}
              >
                <i className="bi bi-collection me-2"></i>
                Examples
              </button>
            </li>
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

          {/* Examples Tab */}
          {activeTab === 'examples' && (
            <div className="tab-content">
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Example AFM Files:</strong> Try these pre-built examples to see AFM in action. Click "Load Example" to open any example in the editor.
              </div>
              
              <div className="row">
                {examples.map((example) => (
                  <div key={example.id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100 example-card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title">{example.title}</h5>
                          <span className="badge bg-primary">{example.metadata.namespace || 'general'}</span>
                        </div>
                        <p className="card-text text-muted small mb-3">{example.description}</p>
                        
                        {/* Features */}
                        <div className="example-features mb-3">
                          {example.metadata.connections?.mcp?.servers && example.metadata.connections.mcp.servers.length > 0 && (
                            <span className="badge bg-warning me-1 mb-1">
                              <i className="bi bi-diagram-3 me-1"></i>
                              MCP
                            </span>
                          )}
                          {example.metadata.interface?.type === 'service' && (
                            <span className="badge bg-info me-1 mb-1">
                              <i className="bi bi-people me-1"></i>
                              Service
                            </span>
                          )}
                          {example.metadata.connections?.a2a?.peers && example.metadata.connections.a2a.peers.length > 0 && (
                            <span className="badge bg-success me-1 mb-1">
                              <i className="bi bi-arrow-left-right me-1"></i>
                              A2A
                            </span>
                          )}
                          {example.metadata.version && (
                            <span className="badge bg-secondary me-1 mb-1">
                              v{example.metadata.version}
                            </span>
                          )}
                        </div>
                        
                        <button 
                          className="btn btn-primary btn-sm w-100"
                          onClick={() => handleLoadExample(example)}
                        >
                          <i className="bi bi-play-circle me-2"></i>
                          Load Example
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
