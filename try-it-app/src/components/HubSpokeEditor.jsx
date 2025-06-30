import React, { useState } from 'react'

const HubSpokeEditor = ({ metadata, updateMetadata, afmContent, setAfmContent }) => {
  const [selectedSpoke, setSelectedSpoke] = useState(null)

  const handleSpokeClick = (spokeType) => {
    console.log('Spoke clicked:', spokeType)
    setSelectedSpoke(spokeType)
    // This would open modals for editing each spoke in a full implementation
    alert(`${spokeType} configuration coming soon! This would open a detailed editor for configuring the ${spokeType} component.`)
  }

  return (
    <div className="hub-spoke-container">
      <div className="hub-spoke-wrapper">
        {/* Central Hub */}
        <div className="hub" onClick={() => handleSpokeClick('core')}>
          <div className="hub-icon">
            <i className="bi bi-robot"></i>
          </div>
          <div className="hub-title">Agent Core</div>
          <div className="hub-subtitle">{metadata.name || 'Unnamed Agent'}</div>
        </div>

        {/* Spokes */}
        <div className="spokes-container">
          {/* Model Provider Spoke */}
          <div className="spoke-group model-group">
            <div className="spoke-group-label">Model</div>
            <div className="spoke-group-items">
              <div 
                className={`spoke model-spoke ${selectedSpoke === 'model' ? 'selected' : ''}`}
                onClick={() => handleSpokeClick('model')}
                data-spoke="model"
              >
                <div className="spoke-icon">🧠</div>
                <div className="spoke-title">Model Provider</div>
                <div className="spoke-subtitle">Configure AI Model</div>
              </div>
            </div>
          </div>

          {/* Memory Spoke */}
          <div className="spoke-group memory-group">
            <div className="spoke-group-label">Memory</div>
            <div className="spoke-group-items">
              <div 
                className={`spoke memory-spoke ${selectedSpoke === 'memory' ? 'selected' : ''}`}
                onClick={() => handleSpokeClick('memory')}
                data-spoke="memory"
              >
                <div className="spoke-icon">💾</div>
                <div className="spoke-title">Memory</div>
                <div className="spoke-subtitle">Conversation History</div>
              </div>
            </div>
          </div>

          {/* MCP Connections */}
          <div className="spoke-group mcp-group">
            <div className="spoke-group-label">MCP Connections</div>
            <div className="spoke-group-items">
              <div 
                className={`spoke mcp-spoke add-spoke ${selectedSpoke === 'mcp' ? 'selected' : ''}`}
                onClick={() => handleSpokeClick('mcp')}
                data-spoke="mcp"
              >
                <div className="spoke-icon">
                  <i className="bi bi-diagram-3"></i>
                </div>
                <div className="spoke-title">Add MCP</div>
                <div className="spoke-subtitle">External Tools</div>
              </div>
              {/* Dynamic MCP spokes would be rendered here */}
            </div>
          </div>

          {/* Peer Agents (A2A) */}
          <div className="spoke-group a2a-group">
            <div className="spoke-group-label">Peer Agents (A2A)</div>
            <div className="spoke-group-items">
              <div 
                className={`spoke a2a-spoke add-spoke ${selectedSpoke === 'a2a' ? 'selected' : ''}`}
                onClick={() => handleSpokeClick('a2a')}
                data-spoke="a2a"
              >
                <div className="spoke-icon">👥</div>
                <div className="spoke-title">Add A2A</div>
                <div className="spoke-subtitle">Agent Network</div>
              </div>
              {/* Dynamic A2A spokes would be rendered here */}
            </div>
          </div>
        </div>

        {/* Connection Lines */}
        <svg className="connections" viewBox="0 0 800 600">
          {/* Lines from hub to spokes */}
          <line x1="400" y1="300" x2="250" y2="150" stroke="#e0e0e0" strokeWidth="2" />
          <line x1="400" y1="300" x2="250" y2="350" stroke="#e0e0e0" strokeWidth="2" />
          <line x1="400" y1="300" x2="550" y2="200" stroke="#e0e0e0" strokeWidth="2" />
          <line x1="400" y1="300" x2="550" y2="400" stroke="#e0e0e0" strokeWidth="2" />
        </svg>
      </div>

      {/* Instructions */}
      <div className="hub-spoke-instructions">
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          Click on any spoke to configure that component of your agent. 
          The visual editor helps you build your agent by connecting different capabilities.
          {selectedSpoke && (
            <div className="mt-2">
              <strong>Selected:</strong> {selectedSpoke.charAt(0).toUpperCase() + selectedSpoke.slice(1)} component
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HubSpokeEditor
