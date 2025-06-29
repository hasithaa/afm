// Local storage operations

// LocalStorage key prefix
const AFM_STORAGE_PREFIX = 'afm_editor_';

// Get list of saved AFM identifiers from localStorage
function getSavedAfmsList() {
    const afms = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(AFM_STORAGE_PREFIX)) {
            afms.push(key.substring(AFM_STORAGE_PREFIX.length));
        }
    }
    return afms;
}

// Load a specific AFM from local storage
function loadAfmFromStorage(identifier) {
    const afmData = localStorage.getItem(AFM_STORAGE_PREFIX + identifier);
    if (!afmData) return null;
    
    try {
        // Parse stored data 
        const data = JSON.parse(afmData);
        return data;
    } catch (e) {
        console.error('Error parsing stored AFM:', e);
        return null;
    }
}

// Save an AFM to local storage
function saveAfmToStorage(identifier, formData, markdownContent, authors, mcpData) {
    // Create storage object
    const afmData = {
        name: formData.name || '',
        description: formData.description || '',
        version: formData.version || '',
        namespace: formData.namespace || '',
        license: formData.license || '',
        iconUrl: formData.iconUrl || '',
        markdownContent: markdownContent
    };
    
    // Add provider if either field is filled
    if (formData.providerOrg || formData.providerUrl) {
        afmData.provider = {
            organization: formData.providerOrg || '',
            url: formData.providerUrl || ''
        };
    }
    
    // Handle authors
    if (authors.length === 1) {
        afmData.author = authors[0];
    } else if (authors.length > 1) {
        afmData.authors = authors;
    }
    
    // Add connections data
    if (mcpData.servers.length > 0 || mcpData.toolAllow.length > 0 || mcpData.toolDeny.length > 0) {
        afmData.connections = {};
        
        // Add MCP configuration
        afmData.connections.mcp = {};
        
        // Add servers if available
        if (mcpData.servers.length > 0) {
            afmData.connections.mcp.servers = mcpData.servers;
        }
        
        // Add tool filter if either allow or deny has entries
        if (mcpData.toolAllow.length > 0 || mcpData.toolDeny.length > 0) {
            afmData.connections.mcp.tool_filter = {};
            
            if (mcpData.toolAllow.length > 0) {
                afmData.connections.mcp.tool_filter.allow = mcpData.toolAllow;
            }
            
            if (mcpData.toolDeny.length > 0) {
                afmData.connections.mcp.tool_filter.deny = mcpData.toolDeny;
            }
        }
    }
    
    // Save to localStorage
    try {
        localStorage.setItem(AFM_STORAGE_PREFIX + identifier, JSON.stringify(afmData));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

// Delete an AFM file from storage
function deleteAfmFromStorage(identifier) {
    try {
        localStorage.removeItem(AFM_STORAGE_PREFIX + identifier);
        return true;
    } catch (e) {
        console.error('Error deleting from localStorage:', e);
        return false;
    }
}

// Handle file upload
function handleFileUpload(file, parseCallback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        parseCallback(content, file.name);
    };
    reader.readAsText(file);
}

// Parse AFM content
function parseAfmContent(content, fileName) {
    try {
        // Extract identifier from filename
        let identifier = fileName.replace(/\.afm\.md$|\.afm$|\.md$/, '');
        
        // Parse AFM content
        const parts = content.split('---');
        if (parts.length >= 3) {
            const yamlString = parts[1];
            const markdownContent = parts.slice(2).join('---');
            
            // Parse YAML metadata
            const metadata = jsyaml.load(yamlString);
            
            return {
                identifier,
                metadata,
                markdownContent: markdownContent.trim(),
                success: true
            };
        } else {
            return { 
                success: false,
                error: 'Invalid AFM file format. Could not parse the file.' 
            };
        }
    } catch (e) {
        console.error('Error parsing AFM content:', e);
        return { 
            success: false,
            error: 'Error parsing the file: ' + e.message 
        };
    }
}
