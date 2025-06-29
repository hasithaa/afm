// Model Context Protocol functionality

// Initialize MCP variables
let mcpServers = [];
let mcpToolAllow = [];
let mcpToolDeny = [];

// Setup MCP functionality
function setupMcp(
    addMcpServerBtn,
    mcpServersContainer,
    mcpServerTemplate,
    addToolAllowBtn,
    addToolDenyBtn,
    mcpToolAllowContainer,
    mcpToolDenyContainer,
    toolFilterEntryTemplate
) {
    // Set up MCP server button
    if (addMcpServerBtn) {
        addMcpServerBtn.addEventListener('click', function() {
            addMcpServerEntry(mcpServersContainer, mcpServerTemplate);
        });
    }
    
    // Set up tool filter buttons
    if (addToolAllowBtn) {
        addToolAllowBtn.addEventListener('click', function() {
            addToolFilterEntry(mcpToolAllowContainer, mcpToolAllow, toolFilterEntryTemplate);
        });
    }
    
    if (addToolDenyBtn) {
        addToolDenyBtn.addEventListener('click', function() {
            addToolFilterEntry(mcpToolDenyContainer, mcpToolDeny, toolFilterEntryTemplate);
        });
    }
}

// Clear MCP containers
function clearMcpContainers(mcpServersContainer, mcpToolAllowContainer, mcpToolDenyContainer) {
    if (mcpServersContainer) mcpServersContainer.innerHTML = '';
    if (mcpToolAllowContainer) mcpToolAllowContainer.innerHTML = '';
    if (mcpToolDenyContainer) mcpToolDenyContainer.innerHTML = '';
    
    mcpServers = [];
    mcpToolAllow = [];
    mcpToolDeny = [];
}

// Add MCP server entry
function addMcpServerEntry(mcpServersContainer, mcpServerTemplate, serverData = null) {
    if (!mcpServerTemplate || !mcpServersContainer) return;
    
    const serverEntry = document.importNode(mcpServerTemplate.content, true).firstElementChild;
    mcpServersContainer.appendChild(serverEntry);
    
    // Set values if provided
    if (serverData) {
        serverEntry.querySelector('.mcp-server-name').value = serverData.name || '';
        serverEntry.querySelector('.mcp-transport-type').value = serverData.transport?.type || 'http_sse';
        
        if (serverData.transport?.type === 'stdio') {
            serverEntry.querySelector('.mcp-command-field').style.display = 'block';
            serverEntry.querySelector('.mcp-url-field').style.display = 'none';
            serverEntry.querySelector('.mcp-server-command').value = serverData.transport?.command || '';
        } else {
            serverEntry.querySelector('.mcp-server-url').value = serverData.transport?.url || '';
        }
        
        // Handle authentication
        if (serverData.authentication) {
            serverEntry.querySelector('.mcp-auth-toggle').checked = true;
            serverEntry.querySelector('.mcp-auth-section').style.display = 'block';
            serverEntry.querySelector('.mcp-auth-type').value = serverData.authentication.type || 'oauth2';
        }
    }
    
    // Set up event listeners for the new server entry
    setupMcpServerEventListeners(serverEntry);
    
    // Update internal data structure
    updateMcpServersData();
}

// Set up event listeners for MCP server entry
function setupMcpServerEventListeners(serverEntry) {
    // Transport type change
    const transportSelect = serverEntry.querySelector('.mcp-transport-type');
    transportSelect.addEventListener('change', function() {
        const urlField = serverEntry.querySelector('.mcp-url-field');
        const commandField = serverEntry.querySelector('.mcp-command-field');
        
        if (this.value === 'stdio') {
            urlField.style.display = 'none';
            commandField.style.display = 'block';
        } else {
            urlField.style.display = 'block';
            commandField.style.display = 'none';
        }
        
        updateMcpServersData();
    });
    
    // Authentication toggle
    const authToggle = serverEntry.querySelector('.mcp-auth-toggle');
    authToggle.addEventListener('change', function() {
        const authSection = serverEntry.querySelector('.mcp-auth-section');
        authSection.style.display = this.checked ? 'block' : 'none';
        updateMcpServersData();
    });
    
    // Input changes
    const inputs = serverEntry.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', updateMcpServersData);
        input.addEventListener('input', updateMcpServersData);
    });
    
    // Remove button
    const removeBtn = serverEntry.querySelector('.remove-mcp-server-btn');
    removeBtn.addEventListener('click', function() {
        serverEntry.remove();
        updateMcpServersData();
    });
}

// Add tool filter entry
function addToolFilterEntry(container, dataArray, toolFilterEntryTemplate, value = '') {
    if (!toolFilterEntryTemplate || !container) return;
    
    const entryElement = document.importNode(toolFilterEntryTemplate.content, true).firstElementChild;
    container.appendChild(entryElement);
    
    // Set value if provided
    if (value) {
        entryElement.querySelector('.tool-filter-value').value = value;
    }
    
    // Set up event listeners
    const input = entryElement.querySelector('.tool-filter-value');
    input.addEventListener('change', function() {
        updateToolFilterData(container, dataArray);
    });
    input.addEventListener('input', function() {
        updateToolFilterData(container, dataArray);
    });
    
    // Remove button
    const removeBtn = entryElement.querySelector('.remove-tool-filter-btn');
    removeBtn.addEventListener('click', function() {
        entryElement.remove();
        updateToolFilterData(container, dataArray);
    });
    
    updateToolFilterData(container, dataArray);
}

// Update MCP servers data structure
function updateMcpServersData() {
    mcpServers = [];
    const serverEntries = document.querySelectorAll('.mcp-server-entry');
    
    serverEntries.forEach(entry => {
        const name = entry.querySelector('.mcp-server-name').value.trim();
        const transportType = entry.querySelector('.mcp-transport-type').value;
        
        // Skip if no name provided
        if (!name) return;
        
        const serverObj = {
            name: name,
            transport: {
                type: transportType
            }
        };
        
        // Add URL or command based on transport type
        if (transportType === 'stdio') {
            const command = entry.querySelector('.mcp-server-command').value.trim();
            if (command) {
                serverObj.transport.command = command;
            }
        } else {
            const url = entry.querySelector('.mcp-server-url').value.trim();
            if (url) {
                serverObj.transport.url = url;
            }
        }
        
        // Handle authentication if enabled
        const authToggle = entry.querySelector('.mcp-auth-toggle');
        if (authToggle.checked) {
            const authType = entry.querySelector('.mcp-auth-type').value;
            serverObj.authentication = {
                type: authType
            };
        }
        
        mcpServers.push(serverObj);
    });
}

// Update tool filter data structure
function updateToolFilterData(container, dataArray) {
    dataArray.length = 0; // Clear the array
    const entries = container.querySelectorAll('.tool-filter-entry');
    
    entries.forEach(entry => {
        const value = entry.querySelector('.tool-filter-value').value.trim();
        if (value) {
            dataArray.push(value);
        }
    });
}

// Load MCP data from parsed metadata
function loadMcpData(metadata, mcpServersContainer, mcpToolAllowContainer, mcpToolDenyContainer, 
                    mcpServerTemplate, toolFilterEntryTemplate) {
    // Clear existing data
    clearMcpContainers(mcpServersContainer, mcpToolAllowContainer, mcpToolDenyContainer);
    
    if (metadata && metadata.connections && metadata.connections.mcp) {
        const mcp = metadata.connections.mcp;
        
        // Handle servers
        if (mcp.servers && Array.isArray(mcp.servers)) {
            mcp.servers.forEach(server => {
                addMcpServerEntry(mcpServersContainer, mcpServerTemplate, server);
            });
        }
        
        // Handle tool filter
        if (mcp.tool_filter) {
            // Add allow entries
            if (mcp.tool_filter.allow && Array.isArray(mcp.tool_filter.allow)) {
                mcp.tool_filter.allow.forEach(tool => {
                    addToolFilterEntry(mcpToolAllowContainer, mcpToolAllow, toolFilterEntryTemplate, tool);
                });
            }
            
            // Add deny entries
            if (mcp.tool_filter.deny && Array.isArray(mcp.tool_filter.deny)) {
                mcp.tool_filter.deny.forEach(tool => {
                    addToolFilterEntry(mcpToolDenyContainer, mcpToolDeny, toolFilterEntryTemplate, tool);
                });
            }
        }
    }
}

// Get MCP data for metadata generation
function getMcpData() {
    return {
        servers: mcpServers,
        toolAllow: mcpToolAllow,
        toolDeny: mcpToolDeny
    };
}
