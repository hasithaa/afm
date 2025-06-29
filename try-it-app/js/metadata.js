// Metadata handling functions

let authors = [];

// Render authors as tags
function renderAuthors(authorsDisplay) {
    if (!authorsDisplay) return;
    
    authorsDisplay.innerHTML = '';
    
    if (authors.length === 0) {
        return;
    }
    
    authors.forEach((author, index) => {
        const authorTag = document.createElement('div');
        authorTag.className = 'author-tag';
        
        // Parse author string to display
        let displayText = author;
        if (author.includes('<') && author.includes('>')) {
            displayText = author.replace('<', ' &lt;').replace('>', '&gt;');
        }
        
        authorTag.innerHTML = `${displayText} <button data-index="${index}">×</button>`;
        authorTag.querySelector('button').addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-index'));
            authors.splice(idx, 1);
            renderAuthors(authorsDisplay);
        });
        
        authorsDisplay.appendChild(authorTag);
    });
}

// Setup author management
function setupAuthorManagement(addAuthorBtn, authorNameInput, authorEmailInput, authorsDisplay) {
    if (addAuthorBtn) {
        addAuthorBtn.addEventListener('click', function() {
            if (authorNameInput && authorEmailInput) {
                const name = authorNameInput.value.trim();
                const email = authorEmailInput.value.trim();
                
                if (name) {
                    const authorString = email ? `${name} <${email}>` : name;
                    authors.push(authorString);
                    renderAuthors(authorsDisplay);
                    
                    // Clear inputs
                    authorNameInput.value = '';
                    authorEmailInput.value = '';
                }
            }
        });
    }
}

// Setup name-to-identifier synchronization
function setupIdentifierSync(nameField, identifierField, isEditingExisting) {
    if (nameField && identifierField) {
        nameField.addEventListener('input', function() {
            if (!isEditingExisting && (!identifierField.value || identifierField.value === '')) {
                identifierField.value = nameField.value.toLowerCase().replace(/\s+/g, '-');
            }
        });
    }
}

// Generate metadata object from form fields
function generateMetadata(formFields, authors, mcpData) {
    const metadata = {};
    
    // Basic fields
    if (formFields.name && formFields.name.value) metadata.name = formFields.name.value;
    if (formFields.description && formFields.description.value) metadata.description = formFields.description.value;
    if (formFields.version && formFields.version.value) metadata.version = formFields.version.value;
    if (formFields.namespace && formFields.namespace.value) metadata.namespace = formFields.namespace.value;
    if (formFields.license && formFields.license.value) metadata.license = formFields.license.value;
    if (formFields.iconUrl && formFields.iconUrl.value) metadata.iconUrl = formFields.iconUrl.value;
    
    // Provider
    if ((formFields.providerOrg && formFields.providerOrg.value) || 
        (formFields.providerUrl && formFields.providerUrl.value)) {
        metadata.provider = {};
        if (formFields.providerOrg && formFields.providerOrg.value) {
            metadata.provider.organization = formFields.providerOrg.value;
        }
        if (formFields.providerUrl && formFields.providerUrl.value) {
            metadata.provider.url = formFields.providerUrl.value;
        }
    }
    
    // Authors
    if (authors.length === 1) {
        metadata.author = authors[0];
    } else if (authors.length > 1) {
        metadata.authors = [...authors];
    }
    
    // MCP connections
    if (mcpData && (mcpData.servers.length > 0 || mcpData.toolAllow.length > 0 || mcpData.toolDeny.length > 0)) {
        metadata.connections = { mcp: {} };
        
        if (mcpData.servers.length > 0) {
            metadata.connections.mcp.servers = mcpData.servers;
        }
        
        if (mcpData.toolAllow.length > 0 || mcpData.toolDeny.length > 0) {
            metadata.connections.mcp.tool_filter = {};
            
            if (mcpData.toolAllow.length > 0) {
                metadata.connections.mcp.tool_filter.allow = mcpData.toolAllow;
            }
            
            if (mcpData.toolDeny.length > 0) {
                metadata.connections.mcp.tool_filter.deny = mcpData.toolDeny;
            }
        }
    }
    
    // Remove empty fields
    Object.keys(metadata).forEach(key => {
        if (metadata[key] === undefined || metadata[key] === '' || 
            (typeof metadata[key] === 'object' && Object.keys(metadata[key]).length === 0)) {
            delete metadata[key];
        }
    });
    
    return metadata;
}

// Generate complete AFM content
function generateAFM(metadata, markdownContent) {
    // Generate YAML string - handle empty object case specially
    let yamlString;
    if (Object.keys(metadata).length === 0) {
        yamlString = ''; // Empty string instead of "{}"
    } else {
        yamlString = jsyaml.dump(metadata);
    }
    
    return `---\n${yamlString}---\n\n${markdownContent}`;
}

// Reset form fields
function resetFormFields(formFields, isEditingExisting) {
    // Basic metadata
    formFields.name.value = '';
    formFields.description.value = '';
    formFields.version.value = '';
    formFields.namespace.value = '';
    formFields.identifier.value = '';
    formFields.identifier.readOnly = !isEditingExisting;
    formFields.license.value = '';
    formFields.iconUrl.value = '';
    
    // Provider
    formFields.providerOrg.value = '';
    formFields.providerUrl.value = '';
}

// Get a clean identifier for filenames
function getCleanIdentifier(identifier, nameField) {
    return identifier ? 
        identifier.toLowerCase().replace(/\s+/g, '-') : 
        nameField && nameField.value ? 
        nameField.value.toLowerCase().replace(/\s+/g, '-') : 
        'agent';
}
