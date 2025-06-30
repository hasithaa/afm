// UI utility functions

// Setup metadata navigation - switching between tabs in the metadata panel
function setupMetadataNavigation(metadataNavLinks, metadataSections) {
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
}

// Setup editor mode toggle - switching between write and preview modes
function setupEditorModeToggle(editorModeButtons, editorContainer, editorPreview, easyMDE) {
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
                    if (easyMDE) {
                        const content = easyMDE.value();
                        editorPreview.innerHTML = marked.parse(content);
                    }
                    editorContainer.style.display = 'none';
                    editorPreview.style.display = 'block';
                }
            });
        });
    }
}

// Setup file upload handling
function setupFileUpload(fileUploadArea, fileUploadInput, handleFileUpload) {
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
}

// Set up modal behavior
function setupModal(modal, cancelBtn, confirmBtn, clickOutsideCloses = true) {
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    if (clickOutsideCloses) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Setup tabs without requiring Bootstrap JS
function setupTabs() {
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    if (!tabButtons || tabButtons.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the target tab
            const target = this.getAttribute('data-bs-target');
            if (!target) return;
            
            const targetElement = document.querySelector(target);
            if (!targetElement) return;

            // Get the parent tab list and content
            const tabList = this.closest('.nav-tabs');
            const tabContent = document.getElementById(tabList.getAttribute('aria-controls')) || 
                              targetElement.parentElement;
            
            if (!tabList || !tabContent) return;

            // Deactivate all tabs in this list
            tabList.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });

            // Hide all tab panes in this content area
            tabContent.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active', 'show');
            });

            // Activate this tab
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            // Show the target tab pane
            targetElement.classList.add('active', 'show');
            
            // If this tab contains saved AFMs, refresh the list
            if (target === '#saved-content') {
                window.loadSavedAfms && window.loadSavedAfms();
            }
        });
    });
}
