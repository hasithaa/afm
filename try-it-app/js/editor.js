// Editor functionality

let easyMDE;
let editorInitialized = false;

// Initialize EasyMDE editor
function initEditor() {
    if (editorInitialized) return;
    
    const editorElement = document.getElementById('markdown-editor');
    if (editorElement) {
        try {
            debugLog('Initializing EasyMDE editor');
            easyMDE = new EasyMDE({
                element: editorElement,
                autofocus: false,
                spellChecker: false,
                status: ['lines', 'words'],
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
            });
            editorInitialized = true;
            
            // Add event listener for changes to update live preview
            easyMDE.codemirror.on('change', function() {
                // Only update if preview is visible
                const editorPreview = document.getElementById('editor-preview');
                if (editorPreview && editorPreview.style.display !== 'none') {
                    editorPreview.innerHTML = marked.parse(easyMDE.value());
                }
            });
            
            debugLog('EasyMDE editor initialized successfully');
        } catch (err) {
            debugLog('Error initializing EasyMDE: ' + err.message);
            console.error('Error initializing EasyMDE:', err);
        }
    } else {
        debugLog('Warning: markdown-editor element not found!');
    }
}

// Get current editor content
function getEditorContent() {
    if (editorInitialized && easyMDE) {
        return easyMDE.value();
    } else {
        const editorElement = document.getElementById('markdown-editor');
        return editorElement ? editorElement.value : "# Content not available";
    }
}

// Set editor content
function setEditorContent(content) {
    if (editorInitialized && easyMDE) {
        easyMDE.value(content);
    } else {
        const editorElement = document.getElementById('markdown-editor');
        if (editorElement) {
            editorElement.value = content;
        }
    }
}

// Set default editor content
function setDefaultEditorContent() {
    setEditorContent(`# Role
Describe your agent's role here...

# Capabilities
- First capability
- Second capability

## Instructions
- First instruction
- Second instruction`);
}

// Preview AFM content
function previewAFM(metadata, markdownContent, previewContent) {
    try {
        // Generate preview HTML
        let previewHTML = '<div class="card mb-3"><div class="card-header"><h3>Metadata</h3></div><div class="card-body">';
        
        if (Object.keys(metadata).length > 0) {
            previewHTML += '<table class="table"><tbody>';
            for (const [key, value] of Object.entries(metadata)) {
                // Handle complex objects with special rendering
                if (key === 'authors' && Array.isArray(value)) {
                    previewHTML += `<tr><th>${key}</th><td>${value.join('<br>')}</td></tr>`;
                } else if (key === 'connections' && typeof value === 'object') {
                    previewHTML += `<tr><th>${key}</th><td><pre>${JSON.stringify(value, null, 2)}</pre></td></tr>`;
                } else {
                    // Ensure emails are properly displayed by encoding < and >
                    const displayValue = typeof value === 'string' ? 
                        value.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 
                        JSON.stringify(value);
                    previewHTML += `<tr><th>${key}</th><td>${displayValue}</td></tr>`;
                }
            }
            previewHTML += '</tbody></table>';
        } else {
            previewHTML += '<p>No metadata provided</p>';
        }
        
        previewHTML += '</div></div>';
        
        // Add View Source button
        previewHTML += '<div class="text-end mb-3"><button class="btn btn-outline-secondary btn-sm" id="view-source-btn">View Source</button></div>';
        
        // Content preview
        previewHTML += '<div class="card" id="content-preview"><div class="card-header"><h3>Content</h3></div><div class="card-body">';
        previewHTML += marked.parse(markdownContent);
        previewHTML += '</div></div>';
        
        // Hidden source view
        previewHTML += '<div class="card mb-3" id="source-preview" style="display:none"><div class="card-header"><h3>AFM Source</h3></div><div class="card-body"><pre><code>';
        
        // Format YAML for display
        let displayYaml = jsyaml.dump(metadata).trim();
        if (displayYaml === '{}') {
            displayYaml = '';
        }
        
        previewHTML += `---\n${displayYaml}\n---\n\n${markdownContent}`.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        previewHTML += '</code></pre></div></div>';
        
        previewContent.innerHTML = previewHTML;
        
        // Add event listener for View Source button
        const viewSourceBtn = document.getElementById('view-source-btn');
        if (viewSourceBtn) {
            viewSourceBtn.addEventListener('click', function() {
                const contentPreview = document.getElementById('content-preview');
                const sourcePreview = document.getElementById('source-preview');
                
                if (sourcePreview.style.display === 'none') {
                    sourcePreview.style.display = 'block';
                    contentPreview.style.display = 'none';
                    viewSourceBtn.textContent = 'View Rendered';
                } else {
                    sourcePreview.style.display = 'none';
                    contentPreview.style.display = 'block';
                    viewSourceBtn.textContent = 'View Source';
                }
            });
        }
        
        return true;
    } catch (e) {
        debugLog('Error generating preview: ' + e.message);
        console.error('Error generating preview:', e);
        return false;
    }
}
