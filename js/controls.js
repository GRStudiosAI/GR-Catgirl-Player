window.PlayerControls = {
  currentEngine: null,
  isPlaying: false,
  isMuted: false,

  init() {
    this.btnPlayPause = document.getElementById('btn-play-pause');
    this.btnStop = document.getElementById('btn-stop');
    this.btnPrev = document.getElementById('btn-prev');
    this.btnNext = document.getElementById('btn-next');
    this.btnRewind = document.getElementById('btn-rewind');
    this.btnFastForward = document.getElementById('btn-fast-forward');
    this.btnReplay = document.getElementById('btn-replay');
    
    this.btnVolumeMute = document.getElementById('btn-volume-mute');
    this.volumeSlider = document.getElementById('volume-slider');
    this.speedSelect = document.getElementById('speed-select');
    this.btnFullscreen = document.getElementById('btn-fullscreen');
    
    this.timeline = document.getElementById('timeline');
    this.currentTimeDisplay = document.getElementById('current-time');
    this.durationDisplay = document.getElementById('duration');

    this.bindEvents();
    
    // Refresh loop for timeline matching requestAnimationFrame
    this.updateLoop = () => {
      this.updateUI();
      requestAnimationFrame(this.updateLoop);
    };
    requestAnimationFrame(this.updateLoop);
  },

  bindEvents() {
    this.btnPlayPause.addEventListener('click', () => {
      if (this.currentEngine) {
        if (this.isPlaying) {
          this.currentEngine.pause();
        } else {
          this.currentEngine.play();
        }
      }
    });

    this.btnStop.addEventListener('click', () => this.stop());

    this.btnRewind.addEventListener('click', () => {
      if (this.currentEngine && this.currentEngine.seek) {
        this.currentEngine.seek(Math.max(0, this.currentEngine.getCurrentTime() - 10));
      }
    });

    this.btnFastForward.addEventListener('click', () => {
      if (this.currentEngine && this.currentEngine.seek) {
        this.currentEngine.seek(Math.min(this.currentEngine.getDuration(), this.currentEngine.getCurrentTime() + 10));
      }
    });

    this.btnReplay.addEventListener('click', () => {
      if (this.currentEngine && this.currentEngine.seek) {
        this.currentEngine.seek(0);
        this.currentEngine.play();
      }
    });

    this.timeline.addEventListener('input', (e) => {
      if (this.currentEngine && this.currentEngine.seek) {
        const val = parseFloat(e.target.value);
        this.currentEngine.seek(val);
      }
    });

    this.volumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      this.setVolume(vol);
      if (vol > 0 && this.isMuted) {
        this.isMuted = false;
        this.btnVolumeMute.textContent = '🔊';
      }
    });

    this.btnVolumeMute.addEventListener('click', () => {
      if (this.isMuted) {
        this.isMuted = false;
        this.setVolume(this.volumeSlider.value);
        this.btnVolumeMute.textContent = '🔊';
      } else {
        this.isMuted = true;
        this.setVolume(0);
        this.btnVolumeMute.textContent = '🔇';
      }
    });

    this.speedSelect.addEventListener('change', (e) => {
      if (this.currentEngine && this.currentEngine.setPlaybackRate) {
        this.currentEngine.setPlaybackRate(parseFloat(e.target.value));
      }
    });

    this.btnFullscreen.addEventListener('click', () => {
      const container = document.getElementById('media-viewer-container');
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    });
  },

  setVolume(vol) {
    if (this.currentEngine && this.currentEngine.setVolume) {
      this.currentEngine.setVolume(vol);
    }
  },

  stop() {
    if (this.currentEngine) {
      this.currentEngine.stop();
      this.isPlaying = false;
      this.btnPlayPause.textContent = '▶';
    }
  },

  setEngine(engine) {
    this.currentEngine = engine;
    this.isPlaying = true;
    this.btnPlayPause.textContent = '⏸';
    
    // reset UI
    this.speedSelect.value = '1';
    
    // Apply current volume
    if (this.isMuted) {
      this.setVolume(0);
    } else {
      this.setVolume(this.volumeSlider.value);
    }
  },

  notifyPlay() {
    this.isPlaying = true;
    this.btnPlayPause.textContent = '⏸';
  },

  notifyPause() {
    this.isPlaying = false;
    this.btnPlayPause.textContent = '▶';
  },

  notifyEnded() {
    this.isPlaying = false;
    this.btnPlayPause.textContent = '▶';
  },

  updateUI() {
    if (this.currentEngine) {
      const current = this.currentEngine.getCurrentTime ? this.currentEngine.getCurrentTime() : 0;
      const total = this.currentEngine.getDuration ? this.currentEngine.getDuration() : 0;
      
      this.timeline.max = total || 100;
      
      // Only update timeline thumb if not actively dragging
      if (document.activeElement !== this.timeline) {
        this.timeline.value = current;
      }
      
      this.currentTimeDisplay.textContent = this.formatTime(current);
      this.durationDisplay.textContent = this.formatTime(total);
    }
  },

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
};

window.addEventListener('DOMContentLoaded', () => {
  window.PlayerControls.init();
});
