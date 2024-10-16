class SimidAd {
  constructor() {
      this.simidProtocol = new simidProtocol.SimidProtocol();
      this.creativeMessageHandler = new simidProtocol.CreativeMessageHandler(this.simidProtocol);
      this.adParams = {};
      this.videoElement = null;
      this.skipButton = null;
      this.skipCountdown = 5;
  }

  onInit(eventData) {
      this.adParams = eventData.args;
      this.videoElement = document.createElement('video');
      this.videoElement.setAttribute('id', 'dynamic-video');
      this.videoElement.setAttribute('src', 'https://cdn1.decide.co/uploads/0fedb9c486ee0e4aac922c26b04cc0ba141532213cd8efd114344460d72a5620_video_large');
      document.body.appendChild(this.videoElement);

      this.setupSkipButton();
      this.addVideoEventListeners();

      this.creativeMessageHandler.sendMessage(CreativeMessage.ACK, {});
  }

  setupSkipButton() {
      this.skipButton = document.createElement('button');
      this.skipButton.setAttribute('id', 'skip-button');
      this.skipButton.style.position = 'absolute';
      this.skipButton.style.bottom = '10px';
      this.skipButton.style.right = '10px';
      this.skipButton.style.padding = '10px';
      this.skipButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      this.skipButton.style.color = '#fff';
      this.skipButton.style.border = 'none';
      this.skipButton.style.cursor = 'default';
      document.body.appendChild(this.skipButton);

      this.skipButton.innerHTML = 'Skip in ' + this.skipCountdown;
      const countdownInterval = setInterval(() => {
          this.skipCountdown--;
          if (this.skipCountdown > 0) {
              this.skipButton.innerHTML = 'Skip in ' + this.skipCountdown;
          } else {
              clearInterval(countdownInterval);
              this.skipButton.innerHTML = 'Skip Ad';
              this.skipButton.style.cursor = 'pointer';
              this.skipButton.addEventListener('click', () => this.skipAd());
              this.skipButton.addEventListener('touchend', () => this.skipAd());
          }
      }, 1000);
  }

  addVideoEventListeners() {
      this.videoElement.addEventListener('timeupdate', () => this.onTimeUpdate());
      this.videoElement.addEventListener('loadedmetadata', (event) => this.onLoadedMetadata(event));
      this.videoElement.addEventListener('ended', () => this.stopAd());
  }

  onTimeUpdate() {
      const percentPlayed = this.videoElement.currentTime * 100.0 / this.videoElement.duration;
      // Handle quartile events here
  }

  onLoadedMetadata(event) {
      this.adParams.duration = event.target.duration;
      this.creativeMessageHandler.sendMessage(CreativeMessage.DURATION_CHANGE, {
          duration: event.target.duration
      });
  }

  startAd() {
      this.videoElement.play();
      this.creativeMessageHandler.sendMessage(CreativeMessage.STARTED, {});
  }

  stopAd() {
      this.videoElement.pause();
      this.creativeMessageHandler.sendMessage(CreativeMessage.STOPPED, {});
  }

  pauseAd() {
      this.videoElement.pause();
      this.creativeMessageHandler.sendMessage(CreativeMessage.PAUSED, {});
  }

  resumeAd() {
      this.videoElement.play();
      this.creativeMessageHandler.sendMessage(CreativeMessage.RESUMED, {});
  }

  skipAd() {
      this.creativeMessageHandler.sendMessage(CreativeMessage.SKIPPED, {});
      this.stopAd();
  }

  onVolumeChange(volume) {
      this.videoElement.volume = volume;
      this.creativeMessageHandler.sendMessage(CreativeMessage.VOLUME_CHANGE, {
          volume: volume
      });
  }

  onSizeChange(width, height) {
      this.videoElement.width = width;
      this.videoElement.height = height;
      this.creativeMessageHandler.sendMessage(CreativeMessage.SIZE_CHANGE, {
          width: width,
          height: height
      });
  }

  onError(message) {
      this.creativeMessageHandler.sendMessage(CreativeMessage.ERROR, {
          message: message
      });
  }
}

const simidAd = new SimidAd();
simidAd.creativeMessageHandler.on(CreativeMessage.INIT, (eventData) => simidAd.onInit(eventData));
simidAd.creativeMessageHandler.on(CreativeMessage.START, () => simidAd.startAd());
simidAd.creativeMessageHandler.on(CreativeMessage.STOP, () => simidAd.stopAd());
simidAd.creativeMessageHandler.on(CreativeMessage.PAUSE, () => simidAd.pauseAd());
simidAd.creativeMessageHandler.on(CreativeMessage.RESUME, () => simidAd.resumeAd());
simidAd.creativeMessageHandler.on(CreativeMessage.VOLUME_CHANGE, (eventData) => simidAd.onVolumeChange(eventData.args.volume));
simidAd.creativeMessageHandler.on(CreativeMessage.SIZE_CHANGE, (eventData) => simidAd.onSizeChange(eventData.args.width, eventData.args.height));
simidAd.creativeMessageHandler.on(CreativeMessage.ERROR, (eventData) => simidAd.onError(eventData.args.message));