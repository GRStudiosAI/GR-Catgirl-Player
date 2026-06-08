const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.on('open-file', (event, filePath) => {
    // In a full implementation, we would load the file from disk by path:
    // For pure HTML compatibility as requested, we would read the file natively 
    // or convert it to a format the player can use.
    
    // Quick and dirty local file loading for the electron version
    const url = 'file:///' + filePath.replace(/\\/g, '/');
    const ext = filePath.split('.').pop().toLowerCase();
    
    // Stop any existing media
    window.PlayerControls.stop();
    document.getElementById('media-viewer-container').innerHTML = '';

    // Simulate a File object to reuse our web engines without modifying them
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], filePath.split(/[\/\\]/).pop(), { type: blob.type });
        
        if (['gif'].includes(ext)) {
          window.GIFPlayer.load(file);
        } else if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)) {
          window.ImageViewer.load(file);
        } else if (['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext)) {
          window.VideoPlayer.load(file);
        } else if (['mp3', 'flac', 'wav', 'ogg', 'm4a'].includes(ext)) {
          window.MusicPlayer.load(file);
        } else {
          console.error('Unsupported file type sent via association:', ext);
        }
      }).catch(err => {
        console.error('Error loading external file via association:', err);
      });
  });
});
