// Debug helper function
function debugLog(message) {
    console.log(message);
    const debugDiv = document.getElementById('debug');
    if (debugDiv) {
        debugDiv.style.display = 'block';
        debugDiv.innerHTML += message + '<br>';
        // Limit to last 5 messages
        const lines = debugDiv.innerHTML.split('<br>');
        if (lines.length > 6) {
            debugDiv.innerHTML = lines.slice(-6).join('<br>');
        }
    }
}

// Initialize variables at global scope
let easyMDE;
let editorInitialized = false;
let currentAfmId = null;
let isEditingExisting = false;
let authors = [];

// LocalStorage key prefix
const AFM_STORAGE_PREFIX = 'afm_editor_';

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    debugLog('DOM fully loaded');
    
    // Page elements - add new UI elements
    const homePage = document.getElementById('home-page');
    const editorPage = document.getElementById('editor-page');
    const previewPage = document.getElementById('preview-page');
    const afmIdentifierModal = document.getElementById('afm-identifier-modal');

    // Home page buttons
    const createNewBtn = document.getElementById('create-new-btn');
    const runAfmBtn = document.getElementById('run-afm-btn');
    const savedAfmsList = document.getElementById('saved-afms-list');
    const noSavedAfms = document.getElementById('no-saved-afms');
    
    // File upload elements
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileUploadInput = document.getElementById('file-upload-input');

    // Editor page elements
    const backToHomeBtn = document.getElementById('back-to-home');
    const previewBtn = document.getElementById('preview-btn');
    const downloadBtn = document.getElementById('download-btn');
    const saveLocalBtn = document.getElementById('save-local-btn');
    
    // Editor toggle elements
    const editorModeButtons = document.querySelectorAll('.editor-mode-toggle button');
    const editorContainer = document.getElementById('markdown-editor-container');
    const editorPreview = document.getElementById('editor-preview');
    
    // Metadata navigation
    const metadataNavLinks = document.querySelectorAll('.metadata-nav-link');
    const metadataSections = document.querySelectorAll('.metadata-section');

    // Preview page elements
    const backToEditorBtn = document.getElementById('back-to-editor');
    const editBtn = document.getElementById('edit-btn');
    const previewDownloadBtn = document.getElementById('preview-download-btn');
    const saveLocalPreviewBtn = document.getElementById('save-local-preview-btn');
    const previewContent = document.getElementById('preview-content');
    
    // Modal elements
    const modalAgentIdentifier = document.getElementById('modal-agent-identifier');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    const afmPreview = document.getElementById('afm-preview');
    
    // Form fields - add the new fields
    const nameField = document.getElementById('agent-name');
    const descriptionField = document.getElementById('agent-description');
    const versionField = document.getElementById('agent-version');
    const namespaceField = document.getElementById('agent-namespace');
    const identifierField = document.getElementById('agent-identifier');
    const licenseField = document.getElementById('agent-license');
    const iconUrlField = document.getElementById('agent-iconurl');
    const providerOrgField = document.getElementById('provider-organization');
    const providerUrlField = document.getElementById('provider-url');
    
    // Author management - updated for new UI
    const authorNameInput = document.getElementById('author-name-input');
    const authorEmailInput = document.getElementById('author-email-input');
    const addAuthorBtn = document.getElementById('add-author-btn');
    const authorsDisplay = document.getElementById('authors-display');
    
    // Handle editor mode toggle
    if (editorModeButtons && editorModeButtons.length > 0) {
        editorModeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mode = button.getAttribute('data-mode');
                
                // Update active button
                editorModeButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                
                if (mode === 'write') {
                    editorContainer.style.display = 'block';
                    editorPreview.style.display = 'none';
                } else {
                    // Update preview content
                    if (editorInitialized && easyMDE) {
                        const content = easyMDE.value();
                        editorPreview.innerHTML = marked.parse(content);
                    }
                    editorContainer.style.display = 'none';
                    editorPreview.style.display = 'block';
                }
            });
        });
    }
    
    // Handle metadata navigation - add null check
    if (metadataNavLinks && metadataNavLinks.length > 0) {
        metadataNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                const section = link.getAttribute('data-section');
                
                // Update active link
                metadataNavLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Show selected section
                metadataSections.forEach(s => {
                    if (s.id === `metadata-${section}`) {
                        s.style.display = 'block';
                    } else {
                        s.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Author management functions - updated for new UI
    if (addAuthorBtn) {
        addAuthorBtn.addEventListener('click', function() {
            if (authorNameInput && authorEmailInput) {
                const name = authorNameInput.value.trim();
                const email = authorEmailInput.value.trim();
                
                if (name) {
                    const authorString = email ? `${name} <${email}>` : name;
                    authors.push(authorString);
                    renderAuthors();
                    
                    // Clear inputs
                    authorNameInput.value = '';
                    authorEmailInput.value = '';
                }
            }
        });
    }

    // Render author badges - updated for new UI
    function renderAuthors() {
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
                renderAuthors();
            });
            
            authorsDisplay.appendChild(authorTag);
        });
    }

    // Sync name and identifier fields - add null checks
    if (nameField && identifierField) {
        nameField.addEventListener('input', function() {
            if (!isEditingExisting && (!identifierField.value || identifierField.value === '')) {
                identifierField.value = nameField.value.toLowerCase().replace(/\s+/g, '-');
            }
        });
    }
    
    // Handle file upload - existing code
    if (fileUploadArea) {
        fileUploadArea.addEventListener('click', function() {
            fileUploadInput.click();
        });
        
        fileUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            fileUploadArea.classList.add('bg-light');
        });
        
        fileUploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            fileUploadArea.classList.remove('bg-light');
        });
        
        fileUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            fileUploadArea.classList.remove('bg-light');
            
            if (e.dataTransfer.files.length) {
                handleFileUpload(e.dataTransfer.files[0]);
            }
        });
    }
    
    if (fileUploadInput) {
        fileUploadInput.addEventListener('change', function() {
            if (fileUploadInput.files.length) {
                handleFileUpload(fileUploadInput.files[0]);
            }
        });
    }

    function handleFileUpload(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            parseAfmContent(content, file.name);
        };
        reader.readAsText(file);
    }
    
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
                
                // Create new AFM in editor
                currentAfmId = identifier;
                isEditingExisting = false; // This is an upload, not from local storage
                
                // Fill form fields
                nameField.value = metadata.name || '';
                descriptionField.value = metadata.description || '';
                versionField.value = metadata.version || '';
                namespaceField.value = metadata.namespace || '';
                identifierField.value = identifier;
                licenseField.value = metadata.license || '';
                
                // Handle new fields
                iconUrlField.value = metadata.iconUrl || '';
                
                // Handle provider fields
                if (metadata.provider) {
                    providerOrgField.value = metadata.provider.organization || '';
                    providerUrlField.value = metadata.provider.url || '';
                } else {
                    providerOrgField.value = '';
                    providerUrlField.value = '';
                }
                
                // Handle authors
                authors = [];
                if (metadata.authors && Array.isArray(metadata.authors)) {
                    authors = [...metadata.authors];
                } else if (metadata.author) {
                    authors = [metadata.author];
                }
                renderAuthors();
                
                // Set markdown content
                const editorElement = document.getElementById('markdown-editor');
                editorElement.value = markdownContent.trim();
                
                // Show editor
                showEditorPage();
            } else {
                alert('Invalid AFM file format. Could not parse the file.');
            }
        } catch (e) {
            console.error('Error parsing uploaded file:', e);
            alert('Error parsing the file: ' + e.message);
        }
    }

    // Load saved AFMs from local storage and display them
    function loadSavedAfms() {
        const savedAfms = getSavedAfmsList();
        
        if (savedAfms.length === 0) {
            noSavedAfms.style.display = 'block';
            return;
        }
        
        noSavedAfms.style.display = 'none';
        savedAfmsList.innerHTML = '';
        
        savedAfms.forEach(identifier => {
            const item = document.createElement('div');
            item.className = 'saved-afm-item';
            
            const metadata = loadAfmFromStorage(identifier);
            const title = document.createElement('div');
            title.className = 'saved-afm-title';
            title.textContent = metadata.name || identifier;
            
            const actions = document.createElement('div');
            actions.className = 'saved-afm-actions';
            
            const openBtn = document.createElement('button');
            openBtn.className = 'btn btn-sm btn-outline-primary';
            openBtn.textContent = 'Open';
            openBtn.addEventListener('click', () => {
                openAfm(identifier);
            });
            
            const cloneBtn = document.createElement('button');
            cloneBtn.className = 'btn btn-sm btn-outline-secondary';
            cloneBtn.textContent = 'Clone';
            cloneBtn.addEventListener('click', () => {
                cloneAfm(identifier);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete "${metadata.name || identifier}"?`)) {
                    deleteAfm(identifier);
                }
            });
            
            actions.appendChild(openBtn);
            actions.appendChild(cloneBtn);
            actions.appendChild(deleteBtn);
            item.appendChild(title);
            item.appendChild(actions);
            savedAfmsList.appendChild(item);
        });
    }
    
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
    
    // Open an AFM file from storage
    function openAfm(identifier) {
        const data = loadAfmFromStorage(identifier);
        if (!data) {
            alert('Error loading AFM file');
            return;
        }
        
        // Set the current AFM ID
        currentAfmId = identifier;
        isEditingExisting = true;
        
        // Populate form fields
        nameField.value = data.name || '';
        descriptionField.value = data.description || '';
        versionField.value = data.version || '';
        namespaceField.value = data.namespace || '';
        identifierField.value = identifier;
        // Make identifier field readonly since this is an existing file
        identifierField.readOnly = true;
        licenseField.value = data.license || '';
        
        // Handle new fields
        iconUrlField.value = data.iconUrl || '';
        
        // Handle provider fields
        if (data.provider) {
            providerOrgField.value = data.provider.organization || '';
            providerUrlField.value = data.provider.url || '';
        } else {
            providerOrgField.value = '';
            providerUrlField.value = '';
        }
        
        // Handle authors
        authors = [];
        if (data.authors && Array.isArray(data.authors)) {
            authors = [...data.authors];
        } else if (data.author) {
            authors = [data.author];
        }
        renderAuthors();
        
        // Set markdown content
        if (data.markdownContent) {
            if (editorInitialized && easyMDE) {
                easyMDE.value(data.markdownContent);
            } else {
                const editorElement = document.getElementById('markdown-editor');
                if (editorElement) {
                    editorElement.value = data.markdownContent;
                }
            }
        }
        
        // Show editor page
        showEditorPage();
    }
    
    // Clone an AFM
    function cloneAfm(identifier) {
        const data = loadAfmFromStorage(identifier);
        if (!data) {
            alert('Error loading AFM file');
            return;
        }
        
        // Set new id and clear readonly status
        currentAfmId = null;
        isEditingExisting = false;
        
        // Populate form fields
        nameField.value = data.name ? `${data.name} (Copy)` : '';
        descriptionField.value = data.description || '';
        versionField.value = data.version || '';
        namespaceField.value = data.namespace || '';
        identifierField.value = identifier ? `${identifier}-copy` : '';
        // Make identifier editable since this is a new file
        identifierField.readOnly = false;
        licenseField.value = data.license || '';
        
        // Handle new fields
        iconUrlField.value = data.iconUrl || '';
        
        // Handle provider fields
        if (data.provider) {
            providerOrgField.value = data.provider.organization || '';
            providerUrlField.value = data.provider.url || '';
        } else {
            providerOrgField.value = '';
            providerUrlField.value = '';
        }
        
        // Set markdown content
        if (data.markdownContent) {
            if (editorInitialized && easyMDE) {
                easyMDE.value(data.markdownContent);
            } else {
                const editorElement = document.getElementById('markdown-editor');
                if (editorElement) {
                    editorElement.value = data.markdownContent;
                }
            }
        }
        
        // Show editor page
        showEditorPage();
    }
    
    // Delete an AFM file from storage
    function deleteAfm(identifier) {
        localStorage.removeItem(AFM_STORAGE_PREFIX + identifier);
        loadSavedAfms(); // Refresh the list immediately
    }

    // Save AFM to local storage
    function saveToLocalStorage() {
        showAfmIdentifierModal();
    }
    
    // Show the AFM identifier modal
    function showAfmIdentifierModal() {
        // Set the current identifier if available
        if (currentAfmId || identifierField.value) {
            modalAgentIdentifier.value = currentAfmId || identifierField.value;
        } else {
            // Generate a default identifier from the agent name
            const name = nameField.value || 'agent';
            modalAgentIdentifier.value = name.toLowerCase().replace(/\s+/g, '-');
        }
        
        // Update the preview
        updateModalPreview();
        
        // Show the modal
        afmIdentifierModal.style.display = 'flex';
    }
    
    // Update the AFM preview in the modal
    function updateModalPreview() {
        const identifier = modalAgentIdentifier.value || 'agent';
        const afmContent = generateAFM();
        afmPreview.textContent = `${identifier}.afm.md\n\n${afmContent}`;
    }
    
    // Save the AFM to local storage with the specified identifier
    function saveAfmToStorage(identifier) {
        if (!identifier) {
            alert('Please provide an agent identifier');
            return;
        }
        
        // Clean the identifier (lowercase, replace spaces with hyphens)
        const cleanIdentifier = identifier.toLowerCase().replace(/\s+/g, '-');
        
        // Check if identifier exists and confirm overwrite if needed
        if (localStorage.getItem(AFM_STORAGE_PREFIX + cleanIdentifier) && cleanIdentifier !== currentAfmId) {
            if (!confirm(`An AFM with identifier "${cleanIdentifier}" already exists. Do you want to overwrite it?`)) {
                return; // User cancelled the overwrite
            }
        }
        
        // Update fields
        currentAfmId = cleanIdentifier;
        identifierField.value = cleanIdentifier;
        
        // Get AFM content
        const markdownContent = editorInitialized && easyMDE ? 
            easyMDE.value() : 
            document.getElementById('markdown-editor').value;
        
        // Create storage object
        const afmData = {
            name: nameField.value || '',
            description: descriptionField.value || '',
            version: versionField.value || '',
            namespace: namespaceField.value || '',
            license: licenseField.value || '',
            iconUrl: iconUrlField.value || '',
            markdownContent: markdownContent
        };
        
        // Add provider if either field is filled
        if (providerOrgField.value || providerUrlField.value) {
            afmData.provider = {
                organization: providerOrgField.value || '',
                url: providerUrlField.value || ''
            };
        }
        
        // Handle authors
        if (authors.length === 1) {
            afmData.author = authors[0];
        } else if (authors.length > 1) {
            afmData.authors = authors;
        }
        
        // Save to localStorage
        localStorage.setItem(AFM_STORAGE_PREFIX + cleanIdentifier, JSON.stringify(afmData));
        
        // Hide modal
        afmIdentifierModal.style.display = 'none';
        
        // Set identifier field to readonly since we're now editing an existing file
        identifierField.readOnly = true;
        isEditingExisting = true;
        
        // Refresh saved AFMs list
        loadSavedAfms();
        
        // Show success message
        alert(`AFM "${nameField.value || cleanIdentifier}" saved successfully!`);
    }

    // Modal event listeners
    if (modalAgentIdentifier) {
        modalAgentIdentifier.addEventListener('input', updateModalPreview);
    }
    
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', () => {
            afmIdentifierModal.style.display = 'none';
        });
    }
    
    if (modalSaveBtn) {
        modalSaveBtn.addEventListener('click', () => {
            saveAfmToStorage(modalAgentIdentifier.value);
        });
    }
    
    // Close modal when clicking outside
    if (afmIdentifierModal) {
        afmIdentifierModal.addEventListener('click', (e) => {
            if (e.target === afmIdentifierModal) {
                afmIdentifierModal.style.display = 'none';
            }
        });
    }

    // Function to initialize the EasyMDE editor
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

    // Navigation functions
    function showHomePage() {
        debugLog('Showing home page');
        loadSavedAfms(); // Refresh the saved AFM list
        homePage.style.display = 'block';
        editorPage.style.display = 'none';
        previewPage.style.display = 'none';
    }

    function showEditorPage() {
        debugLog('Showing editor page');
        homePage.style.display = 'none';
        editorPage.style.display = 'block';
        previewPage.style.display = 'none';
        
        // Initialize editor if not already done
        setTimeout(function() {
            initEditor();
            // Refresh the editor after a delay
            if (easyMDE && editorInitialized) {
                setTimeout(function() {
                    easyMDE.codemirror.refresh();
                }, 100);
            }
        }, 200);
    }

    function showPreviewPage() {
        debugLog('Showing preview page');
        homePage.style.display = 'none';
        editorPage.style.display = 'none';
        previewPage.style.display = 'block';
    }

    // Preview AFM
    function previewAFM() {
        debugLog('Previewing AFM');
        const afmContent = generateAFM();
        const parts = afmContent.split('---');
        
        if (parts.length >= 3) {
            const yamlString = parts[1];
            const markdownContent = parts.slice(2).join('---');
            
            try {
                const metadata = jsyaml.load(yamlString);
                
                // Generate preview HTML
                let previewHTML = '<div class="card mb-3"><div class="card-header"><h3>Metadata</h3></div><div class="card-body">';
                
                if (Object.keys(metadata).length > 0) {
                    previewHTML += '<table class="table"><tbody>';
                    for (const [key, value] of Object.entries(metadata)) {
                        // Handle authors array specially
                        if (key === 'authors' && Array.isArray(value)) {
                            previewHTML += `<tr><th>${key}</th><td>${value.join('<br>')}</td></tr>`;
                        } else {
                            // Ensure emails are properly displayed by encoding < and >
                            const displayValue = typeof value === 'string' ? 
                                value.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 
                                value;
                            previewHTML += `<tr><th>${key}</th><td>${displayValue}</td></tr>`;
                        }
                    }
                    previewHTML += '</tbody></table>';
                } else {
                    previewHTML += '<p>No metadata provided</p>';
                }
                
                previewHTML += '</div></div>';
                
                // Remove YAML Front Matter section since it's redundant
                // Add View Source button instead
                previewHTML += '<div class="text-end mb-3"><button class="btn btn-outline-secondary btn-sm" id="view-source-btn">View Source</button></div>';
                
                previewHTML += '<div class="card" id="content-preview"><div class="card-header"><h3>Content</h3></div><div class="card-body">';
                previewHTML += marked.parse(markdownContent);
                previewHTML += '</div></div>';
                
                // Hidden source view that will be shown when "View Source" is clicked
                previewHTML += '<div class="card mb-3" id="source-preview" style="display:none"><div class="card-header"><h3>AFM Source</h3></div><div class="card-body"><pre><code>';
                
                // Clean up empty frontmatter
                let displayYaml = yamlString.trim();
                if (displayYaml === '{}') {
                    displayYaml = '';
                }
                
                previewHTML += `---\n${displayYaml}\n---\n\n${markdownContent}`.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                previewHTML += '</code></pre></div></div>';
                
                if (previewContent) {
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
                    
                    showPreviewPage();
                } else {
                    debugLog('Error: previewContent element not found');
                }
            } catch (e) {
                debugLog('Error parsing YAML: ' + e.message);
                alert('Error parsing YAML: ' + e.message);
            }
        }
    }

    // Generate AFM content
    function generateAFM() {
        debugLog('Generating AFM content');
        
        const metadata = {
            name: nameField && nameField.value ? nameField.value : undefined,
            description: descriptionField && descriptionField.value ? descriptionField.value : undefined,
            version: versionField && versionField.value ? versionField.value : undefined,
            namespace: namespaceField && namespaceField.value ? namespaceField.value : undefined,
            license: licenseField && licenseField.value ? licenseField.value : undefined,
            iconUrl: iconUrlField && iconUrlField.value ? iconUrlField.value : undefined,
        };
        
        // Add provider object if either field is filled
        if ((providerOrgField && providerOrgField.value) || (providerUrlField && providerUrlField.value)) {
            metadata.provider = {
                organization: providerOrgField && providerOrgField.value ? providerOrgField.value : undefined,
                url: providerUrlField && providerUrlField.value ? providerUrlField.value : undefined
            };
            
            // Remove undefined fields from provider
            Object.keys(metadata.provider).forEach(key => {
                if (metadata.provider[key] === undefined || metadata.provider[key] === '') {
                    delete metadata.provider[key];
                }
            });
            
            // If provider is empty, remove it
            if (Object.keys(metadata.provider).length === 0) {
                delete metadata.provider;
            }
        }
        
        // Add authors if available
        if (authors.length === 1) {
            metadata.author = authors[0];
        } else if (authors.length > 1) {
            metadata.authors = authors;
        }

        // Remove undefined fields
        Object.keys(metadata).forEach(key => {
            if (metadata[key] === undefined || metadata[key] === '') {
                delete metadata[key];
            }
        });

        // Generate YAML string - handle empty object case specially
        let yamlString;
        if (Object.keys(metadata).length === 0) {
            yamlString = ''; // Empty string instead of "{}"
        } else {
            yamlString = jsyaml.dump(metadata);
        }
        
        let markdownContent;
        if (editorInitialized && easyMDE) {
            markdownContent = easyMDE.value();
        } else {
            const editorElement = document.getElementById('markdown-editor');
            markdownContent = editorElement ? editorElement.value : "# Content not available";
        }

        return `---\n${yamlString}---\n\n${markdownContent}`;
    }

    // Make sure downloadAFM function is properly defined and accessible
    function downloadAFM() {
        debugLog('Downloading AFM');
        const afmContent = generateAFM();
        const identifier = identifierField && identifierField.value ? 
            identifierField.value.toLowerCase().replace(/\s+/g, '-') : 
            nameField && nameField.value ? 
            nameField.value.toLowerCase().replace(/\s+/g, '-') : 
            'agent';
        
        const fileName = `${identifier}.afm.md`;
        
        try {
            const blob = new Blob([afmContent], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            debugLog('Error downloading file: ' + e.message);
            console.error('Error downloading file:', e);
        }
    }

    // Event listeners with explicit click handling and error trapping - add null checks
    if (createNewBtn) {
        debugLog('Adding event listener to createNewBtn');
        createNewBtn.addEventListener('click', function(e) {
            debugLog('Create New AFM button clicked');
            try {
                // Reset current AFM
                currentAfmId = null;
                isEditingExisting = false;
                
                // Clear form fields
                nameField.value = '';
                descriptionField.value = '';
                versionField.value = '';
                namespaceField.value = '';
                identifierField.value = '';
                identifierField.readOnly = false; // Make identifier editable for new files
                licenseField.value = '';
                
                // Clear new fields
                iconUrlField.value = '';
                providerOrgField.value = '';
                providerUrlField.value = '';
                
                // Reset authors
                authors = [];
                renderAuthors();
                
                // Reset markdown editor
                if (editorInitialized && easyMDE) {
                    easyMDE.value(`# Role
Describe your agent's role here...

# Capabilities
- First capability
- Second capability

## Instructions
- First instruction
- Second instruction`);
                }
                
                showEditorPage();
            } catch(err) {
                debugLog('Error in showEditorPage: ' + err.message);
                console.error('Error:', err);
            }
        });
    } else {
        debugLog('Warning: createNewBtn not found!');
    }
    
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function() {
            debugLog('Back to Home button clicked');
            showHomePage();
        });
    }
    
    if (backToEditorBtn) {
        backToEditorBtn.addEventListener('click', function() {
            debugLog('Back to Editor button clicked');
            showEditorPage();
        });
    }
    
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            debugLog('Preview button clicked');
            previewAFM();
        });
    }
    
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            debugLog('Edit button clicked');
            showEditorPage();
        });
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            debugLog('Download button clicked');
            downloadAFM();
        });
    }
    
    if (previewDownloadBtn) {
        previewDownloadBtn.addEventListener('click', function() {
            debugLog('Preview Download button clicked');
            downloadAFM();
        });
    }
    
    if (saveLocalBtn) {
        saveLocalBtn.addEventListener('click', function() {
            debugLog('Save to Browser button clicked');
            saveToLocalStorage();
        });
    }
    
    if (saveLocalPreviewBtn) {
        saveLocalPreviewBtn.addEventListener('click', function() {
            debugLog('Preview Save to Browser button clicked');
            saveToLocalStorage();
        });
    }
    
    // Initialize rendering
    renderAuthors();

    // Load saved AFMs when page loads
    loadSavedAfms();

    // Check if we need to show a specific page based on URL
    const path = window.location.pathname;
    debugLog('Current path: ' + path);
    
    // Initialize default view
    debugLog('Showing home page by default');
    showHomePage();
});

// Add a global error handler
window.onerror = function(message, source, lineno, colno, error) {
    debugLog(`Error: ${message} at ${source}:${lineno}:${colno}`);
    console.error('Global error:', error);
    return false;
};
