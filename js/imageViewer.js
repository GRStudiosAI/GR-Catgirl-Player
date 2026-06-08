window.ImageViewer = {
  element: null,

  load(file) {
    const container = document.getElementById('media-viewer-container');
    const url = URL.createObjectURL(file);
    
    this.element = document.createElement('img');
    this.element.src = url;
    
    container.appendChild(this.element);
    
    window.PlayerControls.setEngine(this);
    window.PlayerControls.notifyPlay(); // Images just "play" constantly
  },

  play() {},
  pause() {},
  stop() {},
  seek(time) {},
  getCurrentTime() { return 0; },
  getDuration() { return 0; },
  setVolume(vol) {},
  setPlaybackRate(rate) {}
};
