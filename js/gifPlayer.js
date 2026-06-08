window.GIFPlayer = {
  element: null,

  load(file) {
    const container = document.getElementById('media-viewer-container');
    const url = URL.createObjectURL(file);
    
    this.element = document.createElement('img');
    this.element.src = url;
    
    container.appendChild(this.element);
    
    window.PlayerControls.setEngine(this);
    window.PlayerControls.notifyPlay();
  },

  play() {
    // Basic gif play: reassign src to restart if needed, 
    // but typically it just continues
  },

  pause() {
    // Native GIFs cannot be easily paused without Canvas manipulation.
  },

  stop() {
    if (this.element) {
      this.element.src = '';
    }
  },

  seek(time) {},
  getCurrentTime() { return 0; },
  getDuration() { return 0; },
  setVolume(vol) {},
  setPlaybackRate(rate) {}
};
