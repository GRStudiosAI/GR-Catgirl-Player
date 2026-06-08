window.VideoPlayer = {
  element: null,

  load(file) {
    const container = document.getElementById('media-viewer-container');
    const url = URL.createObjectURL(file);
    
    this.element = document.createElement('video');
    this.element.src = url;
    this.element.autoplay = true;
    
    // Bind native events to our UI
    this.element.addEventListener('play', () => window.PlayerControls.notifyPlay());
    this.element.addEventListener('pause', () => window.PlayerControls.notifyPause());
    this.element.addEventListener('ended', () => window.PlayerControls.notifyEnded());
    
    container.appendChild(this.element);
    
    window.PlayerControls.setEngine(this);
  },

  play() {
    if (this.element) this.element.play();
  },

  pause() {
    if (this.element) this.element.pause();
  },

  stop() {
    if (this.element) {
      this.element.pause();
      this.element.currentTime = 0;
    }
  },

  seek(time) {
    if (this.element) this.element.currentTime = time;
  },

  getCurrentTime() {
    return this.element ? this.element.currentTime : 0;
  },

  getDuration() {
    return (this.element && this.element.duration) ? this.element.duration : 0;
  },

  setVolume(vol) {
    if (this.element) this.element.volume = vol;
  },

  setPlaybackRate(rate) {
    if (this.element) this.element.playbackRate = rate;
  }
};
