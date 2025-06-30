// Main application code

// Global state
let currentAfmId = null;
let isEditingExisting = false;

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    debugLog('DOM fully loaded');
    
    // Page elements
    const homePage = document.getElementById('home-page');
    const editorPage = document.getElementById('editor-page');
    const previewPage = document.getElementById('preview-page');
    const afmIdentifierModal = document.getElementById('afm-identifier-modal');
    
    // Tab elements
    const uploadTab = document.getElementById('upload-tab');
    const savedTab = document.getElementById('saved-tab');
    const uploadContent = document.getElementById('upload-content');
    const savedContent = document.getElementById('saved-content');

    // Home page elements
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
    
    // Form fields
    const formFields = {
        name: document.getElementById('agent-name'),
        description: document.getElementById('agent-description'),
        version: document.getElementById('agent-version'),
        namespace: document.getElementById('agent-namespace'),
        identifier: document.getElementById('agent-identifier'),
        license: document.getElementById('agent-license'),
        iconUrl: document.getElementById('agent-iconurl'),
        providerOrg: document.getElementById('provider-organization'),
        providerUrl: document.getElementById('provider-url')
    };
    
    // Author management elements
    const authorNameInput = document.getElementById('author-name-input');
    const authorEmailInput = document.getElementById('author-email-input');
    const addAuthorBtn = document.getElementById('add-author-btn');
    const authorsDisplay = document.getElementById('authors-display');
    
    // MCP elements
    const addMcpServerBtn = document.getElementById('add-mcp-server-btn');
    const mcpServersContainer = document.getElementById('mcp-servers-container');
    const mcpServerTemplate = document.getElementById('mcp-server-template');
    
    const addToolAllowBtn = document.getElementById('add-tool-allow-btn');
    const addToolDenyBtn = document.getElementById('add-tool-deny-btn');
    const mcpToolAllowContainer = document.getElementById('mcp-tool-allow-container');
    const mcpToolDenyContainer = document.getElementById('mcp-tool-deny-container');
    const toolFilterEntryTemplate = document.getElementById('tool-filter-entry-template');
    
    // Setup UI components
    setupMetadataNavigation(metadataNavLinks, metadataSections);
    setupEditorModeToggle(editorModeButtons, editorContainer, editorPreview, easyMDE);
    setupAuthorManagement(addAuthorBtn, authorNameInput, authorEmailInput, authorsDisplay);
    setupIdentifierSync(formFields.name, formFields.identifier, isEditingExisting);
    setupMcp(
        addMcpServerBtn,
        mcpServersContainer,
        mcpServerTemplate,
        addToolAllowBtn,
        addToolDenyBtn,
        mcpToolAllowContainer,
        mcpToolDenyContainer,
        toolFilterEntryTemplate
    );
    
    // Setup file upload
    setupFileUpload(fileUploadArea, fileUploadInput, function(file) {
        handleFileUpload(file, function(content, fileName) {
            const result = parseAfmContent(content, fileName);
            if (result.success) {
                // Reset state
                currentAfmId = result.identifier;
                isEditingExisting = false;
                
                // Fill form fields
                formFields.name.value = result.metadata.name || '';
                formFields.description.value = result.metadata.description || '';
                formFields.version.value = result.metadata.version || '';
                formFields.namespace.value = result.metadata.namespace || '';
                formFields.identifier.value = result.identifier;
                formFields.license.value = result.metadata.license || '';
                formFields.iconUrl.value = result.metadata.iconUrl || '';
                
                // Handle provider fields
                if (result.metadata.provider) {
                    formFields.providerOrg.value = result.metadata.provider.organization || '';
                    formFields.providerUrl.value = result.metadata.provider.url || '';
                } else {
                    formFields.providerOrg.value = '';
                    formFields.providerUrl.value = '';
                }
                
                // Handle authors
                authors = [];
                if (result.metadata.authors && Array.isArray(result.metadata.authors)) {
                    authors = [...result.metadata.authors];
                } else if (result.metadata.author) {
                    authors = [result.metadata.author];
                }
                renderAuthors(authorsDisplay);
                
                // Handle MCP data
                loadMcpData(
                    result.metadata,
                    mcpServersContainer,
                    mcpToolAllowContainer,
                    mcpToolDenyContainer,
                    mcpServerTemplate,
                    toolFilterEntryTemplate
                );
                
                // Set markdown content
                setEditorContent(result.markdownContent);
                
                // Show editor page
                showEditorPage(homePage, editorPage, previewPage);
            } else {
                alert(result.error);
            }
        });
    });
    
    // Setup modal
    setupModal(afmIdentifierModal, modalCancelBtn, modalSaveBtn, true);
    
    if (modalAgentIdentifier) {
        modalAgentIdentifier.addEventListener('input', updateModalPreview);
    }
    
    if (modalSaveBtn) {
        modalSaveBtn.addEventListener('click', () => {
            const identifier = modalAgentIdentifier.value;
            saveAfm(identifier);
        });
    }
    
    // Helper for updating modal preview
    function updateModalPreview() {
        const identifier = modalAgentIdentifier.value || 'agent';
        
        // Generate metadata
        const metadata = generateMetadata(formFields, authors, getMcpData());
        const markdownContent = getEditorContent();
        const afmContent = generateAFM(metadata, markdownContent);
        
        afmPreview.textContent = `${identifier}.afm.md\n\n${afmContent}`;
    }
    
    // Helper for saving AFM
    function saveAfm(identifier) {
        if (!identifier) {
            alert('Please provide an Agent Identifier');
            modalAgentIdentifier.focus();
            return;
        }
        
        // Clean the identifier
        const cleanIdentifier = getCleanIdentifier(identifier, formFields.name);
        
        // Check for overwrite
        if (localStorage.getItem(AFM_STORAGE_PREFIX + cleanIdentifier) && cleanIdentifier !== currentAfmId) {
            if (!confirm(`An Agent Flavored Markdown file with identifier "${cleanIdentifier}" already exists. Do you want to overwrite it?`)) {
                return;
            }
        }
        
        // Update state
        currentAfmId = cleanIdentifier;
        formFields.identifier.value = cleanIdentifier;
        
        // Save to localStorage
        const saved = saveAfmToStorage(cleanIdentifier, {
            name: formFields.name.value,
            description: formFields.description.value,
            version: formFields.version.value,
            namespace: formFields.namespace.value,
            license: formFields.license.value,
            iconUrl: formFields.iconUrl.value,
            providerOrg: formFields.providerOrg.value,
            providerUrl: formFields.providerUrl.value
        }, getEditorContent(), authors, getMcpData());
        
        // Hide modal
        afmIdentifierModal.style.display = 'none';
        
        // Set identifier field to readonly
        formFields.identifier.readOnly = true;
        isEditingExisting = true;
        
        // Refresh saved AFMs list
        loadSavedAfms();
        
        if (saved) {
            alert(`AFM "${formFields.name.value || cleanIdentifier}" saved successfully!`);
        }
    }
    
    // Reset form to create a new AFM
    function resetForm() {
        currentAfmId = null;
        isEditingExisting = false;
        
        // Reset form fields
        resetFormFields(formFields, isEditingExisting);
        
        // Reset authors
        authors = [];
        renderAuthors(authorsDisplay);
        
        // Reset MCP data
        clearMcpContainers(mcpServersContainer, mcpToolAllowContainer, mcpToolDenyContainer);
        
        // Reset markdown editor
        setDefaultEditorContent();
    }
    
    // Function to open an AFM from storage
    function openAfm(identifier) {
        const data = loadAfmFromStorage(identifier);
        if (!data) {
            alert('Error loading AFM file');
            return;
        }
        
        // Update state
        currentAfmId = identifier;
        isEditingExisting = true;
        
        // Populate form fields
        formFields.name.value = data.name || '';
        formFields.description.value = data.description || '';
        formFields.version.value = data.version || '';
        formFields.namespace.value = data.namespace || '';
        formFields.identifier.value = identifier;
        formFields.identifier.readOnly = true;
        formFields.license.value = data.license || '';
        formFields.iconUrl.value = data.iconUrl || '';
        
        // Handle provider fields
        if (data.provider) {
            formFields.providerOrg.value = data.provider.organization || '';
            formFields.providerUrl.value = data.provider.url || '';
        } else {
            formFields.providerOrg.value = '';
            formFields.providerUrl.value = '';
        }
        
        // Handle authors
        authors = [];
        if (data.authors && Array.isArray(data.authors)) {
            authors = [...data.authors];
        } else if (data.author) {
            authors = [data.author];
        }
        renderAuthors(authorsDisplay);
        
        // Handle MCP data
        loadMcpData(
            data,
            mcpServersContainer,
            mcpToolAllowContainer,
            mcpToolDenyContainer,
            mcpServerTemplate,
            toolFilterEntryTemplate
        );
        
        // Set markdown content
        if (data.markdownContent) {
            setEditorContent(data.markdownContent);
        }
        
        // Show editor page
        showEditorPage(homePage, editorPage, previewPage);
    }
    
    // Function to clone an AFM
    function cloneAfm(identifier) {
        const data = loadAfmFromStorage(identifier);
        if (!data) {
            alert('Error loading AFM file');
            return;
        }
        
        // Update state
        currentAfmId = null;
        isEditingExisting = false;
        
        // Populate form fields
        formFields.name.value = data.name ? `${data.name} (Copy)` : '';
        formFields.description.value = data.description || '';
        formFields.version.value = data.version || '';
        formFields.namespace.value = data.namespace || '';
        formFields.identifier.value = identifier ? `${identifier}-copy` : '';
        formFields.identifier.readOnly = false;
        formFields.license.value = data.license || '';
        formFields.iconUrl.value = data.iconUrl || '';
        
        // Handle provider fields
        if (data.provider) {
            formFields.providerOrg.value = data.provider.organization || '';
            formFields.providerUrl.value = data.provider.url || '';
        } else {
            formFields.providerOrg.value = '';
            formFields.providerUrl.value = '';
        }
        
        // Handle authors
        authors = [];
        if (data.authors && Array.isArray(data.authors)) {
            authors = [...data.authors];
        } else if (data.author) {
            authors = [data.author];
        }
        renderAuthors(authorsDisplay);
        
        // Handle MCP data
        loadMcpData(
            data,
            mcpServersContainer,
            mcpToolAllowContainer,
            mcpToolDenyContainer,
            mcpServerTemplate,
            toolFilterEntryTemplate
        );
        
        // Set markdown content
        if (data.markdownContent) {
            setEditorContent(data.markdownContent);
        }
        
        // Show editor page
        showEditorPage(homePage, editorPage, previewPage);
    }
    
    // Load saved AFMs from local storage
    function loadSavedAfms() {
        renderSavedAfms(
            savedAfmsList, 
            noSavedAfms, 
            openAfm,
            cloneAfm,
            function deleteAfm(identifier) {
                deleteAfmFromStorage(identifier);
                loadSavedAfms();
            }
        );
    }
    
    // Validate form fields
    function validateForm() {
        if (!formFields.identifier.value.trim()) {
            alert('Agent Identifier is required.');
            formFields.identifier.focus();
            return false;
        }
        return true;
    }
    
    // Save AFM to local storage
    function saveToLocalStorage() {
        if (!validateForm()) return;
        
        // Set the current identifier if available
        if (currentAfmId || formFields.identifier.value) {
            modalAgentIdentifier.value = currentAfmId || formFields.identifier.value;
        } else {
            // Generate a default identifier from the agent name
            const name = formFields.name.value || 'agent';
            modalAgentIdentifier.value = name.toLowerCase().replace(/\s+/g, '-');
        }
        
        // Update the preview
        updateModalPreview();
        
        // Show the modal
        afmIdentifierModal.style.display = 'flex';
    }
    
    // Preview AFM content
    function handlePreview() {
        // Generate metadata
        const metadata = generateMetadata(formFields, authors, getMcpData());
        const markdownContent = getEditorContent();
        
        // Preview content
        const success = previewAFM(metadata, markdownContent, previewContent);
        if (success) {
            showPreviewPage(homePage, editorPage, previewPage);
        } else {
            alert('Error generating preview');
        }
    }
    
    // Download AFM file
    function downloadAFM() {
        // Generate metadata
        const metadata = generateMetadata(formFields, authors, getMcpData());
        const markdownContent = getEditorContent();
        const afmContent = generateAFM(metadata, markdownContent);
        
        // Get clean identifier for filename
        const identifier = getCleanIdentifier(formFields.identifier.value, formFields.name);
        const fileName = `${identifier}.afm.md`;
        
        // Download the file
        downloadFile(afmContent, fileName);
    }
    
    // Set up navigation events
    setupNavigation(
        createNewBtn,
        backToHomeBtn,
        backToEditorBtn,
        previewBtn,
        editBtn,
        downloadBtn,
        previewDownloadBtn,
        saveLocalBtn,
        saveLocalPreviewBtn,
        homePage,
        editorPage,
        previewPage,
        formFields,
        authors,
        loadSavedAfms,
        saveToLocalStorage,
        downloadAFM,
        handlePreview,
        resetForm
    );
    
    // Setup tabs manually if Bootstrap JS is not working
    if (uploadTab && savedTab) {
        uploadTab.addEventListener('click', function(e) {
            e.preventDefault();
            uploadTab.classList.add('active');
            uploadTab.setAttribute('aria-selected', 'true');
            savedTab.classList.remove('active');
            savedTab.setAttribute('aria-selected', 'false');
            
            if (uploadContent) {
                uploadContent.classList.add('active', 'show');
            }
            if (savedContent) {
                savedContent.classList.remove('active', 'show');
            }
        });
        
        savedTab.addEventListener('click', function(e) {
            e.preventDefault();
            savedTab.classList.add('active');
            savedTab.setAttribute('aria-selected', 'true');
            uploadTab.classList.remove('active');
            uploadTab.setAttribute('aria-selected', 'false');
            
            if (savedContent) {
                savedContent.classList.add('active', 'show');
            }
            if (uploadContent) {
                uploadContent.classList.remove('active', 'show');
            }
            
            // Refresh saved AFMs list when tab is clicked
            loadSavedAfms();
        });
    }
    
    // Initial load - Make sure we have DOM elements before proceeding
    if (homePage && savedAfmsList) {
        loadSavedAfms();
        showHomePage(homePage, editorPage, previewPage, loadSavedAfms);
    } else {
        console.error('Required DOM elements not found');
    }
});
