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
