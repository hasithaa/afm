// Debug helper function
function debugLog(message) {
    console.log(message);
    const debugDiv = document.getElementById('debug');
    const debugContent = document.getElementById('debug-content');
    
    if (debugDiv && debugContent) {
        // Create log entry with timestamp
        const entry = document.createElement('div');
        entry.className = 'debug-log-entry';
        
        const timestamp = document.createElement('span');
        timestamp.className = 'debug-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();
        
        const msg = document.createElement('span');
        msg.className = 'debug-message';
        msg.textContent = message;
        
        entry.appendChild(timestamp);
        entry.appendChild(msg);
        debugContent.appendChild(entry);
        
        // Limit to last 30 messages
        const entries = debugContent.querySelectorAll('.debug-log-entry');
        if (entries.length > 30) {
            debugContent.removeChild(entries[0]);
        }
        
        // Scroll to bottom
        debugContent.scrollTop = debugContent.scrollHeight;
    }
}

// Setup debug toggle and close button
document.addEventListener('DOMContentLoaded', function() {
    const debugToggle = document.getElementById('debug-toggle');
    const debugDiv = document.getElementById('debug');
    const debugCloseBtn = document.getElementById('debug-close');
    
    // Functions to show/hide debug window
    function showDebugWindow() {
        if (debugDiv) {
            debugDiv.style.display = 'block';
            // Scroll to bottom when showing
            const debugContent = document.getElementById('debug-content');
            if (debugContent) {
                debugContent.scrollTop = debugContent.scrollHeight;
            }
        }
    }
    
    function hideDebugWindow() {
        if (debugDiv) {
            debugDiv.style.display = 'none';
        }
    }
    
    // Set up toggle functionality
    if (debugToggle) {
        debugToggle.addEventListener('click', function() {
            if (debugDiv && debugDiv.style.display === 'block') {
                hideDebugWindow();
            } else {
                showDebugWindow();
            }
        });
    }
    
    // Set up close button
    if (debugCloseBtn) {
        debugCloseBtn.addEventListener('click', function() {
            hideDebugWindow();
        });
    }
    
    // Initialize with welcome message
    debugLog('Debug console initialized');
});

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    debugLog(`Error: ${message} at ${source}:${lineno}:${colno}`);
    console.error('Global error:', error);
    return false;
};

// Download file helper
function downloadFile(content, filename, type = 'text/markdown') {
    try {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (e) {
        debugLog('Error downloading file: ' + e.message);
        console.error('Error downloading file:', e);
    }
}
