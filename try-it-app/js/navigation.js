// Navigation functionality

// Navigation functions
function showHomePage(homePage, editorPage, previewPage, loadSavedAfmsCallback) {
    debugLog('Showing home page');
    // Check if elements exist before trying to modify them
    if (!homePage) {
        console.error('Home page element not found');
        return;
    }
    
    homePage.style.display = 'block';
    
    if (editorPage) {
        editorPage.style.display = 'none';
    }
    
    if (previewPage) {
        previewPage.style.display = 'none';
    }
    
    // Only call the callback if it exists
    if (typeof loadSavedAfmsCallback === 'function') {
        loadSavedAfmsCallback(); // Refresh the saved AFM list
    }
}

function showEditorPage(homePage, editorPage, previewPage) {
    debugLog('Showing editor page');
    // Check if elements exist before trying to modify them
    if (!editorPage) {
        console.error('Editor page element not found');
        return;
    }
    
    if (homePage) {
        homePage.style.display = 'none';
    }
    
    editorPage.style.display = 'block';
    
    if (previewPage) {
        previewPage.style.display = 'none';
    }
    
    // Initialize editor if not already done
    setTimeout(function() {
        if (typeof initEditor === 'function') {
            initEditor();
            // Refresh the editor after a delay
            if (typeof easyMDE !== 'undefined' && typeof editorInitialized !== 'undefined' && editorInitialized) {
                setTimeout(function() {
                    easyMDE.codemirror.refresh();
                }, 100);
            }
        }
        
        // Set focus to the identifier field if it's empty
        const identifierField = document.getElementById('agent-identifier');
        if (identifierField && !identifierField.value && !identifierField.readOnly) {
            identifierField.focus();
        }
    }, 200);
}

function showPreviewPage(homePage, editorPage, previewPage) {
    debugLog('Showing preview page');
    // Check if elements exist before trying to modify them
    if (!previewPage) {
        console.error('Preview page element not found');
        return;
    }
    
    if (homePage) {
        homePage.style.display = 'none';
    }
    
    if (editorPage) {
        editorPage.style.display = 'none';
    }
    
    previewPage.style.display = 'block';
}

// Setup navigation event handlers
function setupNavigation(
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
    loadSavedAfmsCallback,
    saveToLocalCallback,
    downloadAFMCallback,
    previewAFMCallback,
    resetFormCallback
) {
    // Create new AFM
    if (createNewBtn) {
        createNewBtn.addEventListener('click', function() {
            debugLog('Create New AFM button clicked');
            try {
                // Reset current state
                resetFormCallback();
                
                // Show editor page
                showEditorPage(homePage, editorPage, previewPage);
            } catch(err) {
                debugLog('Error creating new AFM: ' + err.message);
                console.error('Error creating new AFM:', err);
            }
        });
    }
    
    // Back to home
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function() {
            debugLog('Back to Home button clicked');
            showHomePage(homePage, editorPage, previewPage, loadSavedAfmsCallback);
        });
    }
    
    // Back to editor
    if (backToEditorBtn) {
        backToEditorBtn.addEventListener('click', function() {
            debugLog('Back to Editor button clicked');
            showEditorPage(homePage, editorPage, previewPage);
        });
    }
    
    // Preview
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            debugLog('Preview button clicked');
            previewAFMCallback();
        });
    }
    
    // Edit from preview
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            debugLog('Edit button clicked');
            showEditorPage(homePage, editorPage, previewPage);
        });
    }
    
    // Download
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            debugLog('Download button clicked');
            downloadAFMCallback();
        });
    }
    
    // Preview Download
    if (previewDownloadBtn) {
        previewDownloadBtn.addEventListener('click', function() {
            debugLog('Preview Download button clicked');
            downloadAFMCallback();
        });
    }
    
    // Save to local storage
    if (saveLocalBtn) {
        saveLocalBtn.addEventListener('click', function() {
            debugLog('Save to Browser button clicked');
            saveToLocalCallback();
        });
    }
    
    // Preview Save to local storage
    if (saveLocalPreviewBtn) {
        saveLocalPreviewBtn.addEventListener('click', function() {
            debugLog('Preview Save to Browser button clicked');
            saveToLocalCallback();
        });
    }
}

// Render saved AFMs list
function renderSavedAfms(savedAfmsList, noSavedAfms, openCallback, cloneCallback, deleteCallback) {
    if (!savedAfmsList || !noSavedAfms) {
        console.error('Saved AFMs list elements not found');
        return;
    }

    const savedAfms = typeof getSavedAfmsList === 'function' ? getSavedAfmsList() : [];
    
    if (savedAfms.length === 0) {
        noSavedAfms.style.display = 'block';
        savedAfmsList.innerHTML = '';
        return;
    }
    
    noSavedAfms.style.display = 'none';
    savedAfmsList.innerHTML = '';
    
    savedAfms.forEach(identifier => {
        const item = document.createElement('div');
        item.className = 'saved-afm-item';
        
        const metadata = typeof loadAfmFromStorage === 'function' ? loadAfmFromStorage(identifier) : null;
        const title = document.createElement('div');
        title.className = 'saved-afm-title';
        title.textContent = metadata && metadata.name ? metadata.name : identifier;
        
        const actions = document.createElement('div');
        actions.className = 'saved-afm-actions';
        
        const openBtn = document.createElement('button');
        openBtn.className = 'btn btn-sm btn-outline-primary';
        openBtn.textContent = 'Open';
        openBtn.addEventListener('click', () => {
            if (typeof openCallback === 'function') {
                openCallback(identifier);
            }
        });
        
        const cloneBtn = document.createElement('button');
        cloneBtn.className = 'btn btn-sm btn-outline-secondary';
        cloneBtn.textContent = 'Clone';
        cloneBtn.addEventListener('click', () => {
            if (typeof cloneCallback === 'function') {
                cloneCallback(identifier);
            }
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-outline-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete "${metadata && metadata.name ? metadata.name : identifier}"?`)) {
                if (typeof deleteCallback === 'function') {
                    deleteCallback(identifier);
                }
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
