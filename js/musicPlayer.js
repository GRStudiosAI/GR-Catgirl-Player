window.MusicPlayer = {
  element: null,
  visualizer: null,

  load(file) {
    const container = document.getElementById('media-viewer-container');
    const url = URL.createObjectURL(file);
    
    this.element = document.createElement('audio');
    this.element.src = url;
    this.element.autoplay = true;
    
    // Bind native events to our UI
    this.element.addEventListener('play', () => window.PlayerControls.notifyPlay());
    this.element.addEventListener('pause', () => window.PlayerControls.notifyPause());
    this.element.addEventListener('ended', () => window.PlayerControls.notifyEnded());
    
    // Create a visual indicator for music
    this.visualizer = document.createElement('div');
    this.visualizer.className = 'music-visualizer';
    this.visualizer.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 80px; margin-bottom: 20px;">🎵</div>
        <div style="color: #d4a5ff; font-family: monospace; font-size: 18px;">Now Playing</div>
        <div style="color: #fff; font-size: 24px; font-weight: bold; margin-top: 10px;">${file.name}</div>
      </div>
    `;
    
    container.appendChild(this.visualizer);
    
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
    return (this.element && !isNaN(this.element.duration)) ? this.element.duration : 0;
  },

  setVolume(vol) {
    if (this.element) this.element.volume = vol;
  },

  setPlaybackRate(rate) {
    if (this.element) this.element.playbackRate = rate;
  }
};
