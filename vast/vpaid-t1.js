(function() {
  var VPAIDAd = function() {
      this.eventsCallbacks = {};
      this.adDuration = 30; // Example duration in seconds
      this.adVolume = 1.0;  // Default volume (100%)
      this.startTime = 0;
      this.isStarted = false;
  };

  // Handshake to verify VPAID version
  VPAIDAd.prototype.handshakeVersion = function(version) {
      console.log('handshakeVersion called with version: ' + version);
      return '2.0';  // Return the supported VPAID version
  };

  // Initialize the ad
  VPAIDAd.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
      console.log('Ad initialized with width: ' + width + ', height: ' + height);
      this.startTime = new Date().getTime();
      this.callEvent('AdLoaded');
  };

  // Start the ad experience
  VPAIDAd.prototype.startAd = function() {
      this.isStarted = true;
      this.callEvent('AdStarted');
      console.log('Ad started');
      // Simulate 30 second ad
      setTimeout(() => {
          this.stopAd();
      }, this.adDuration * 1000);
  };

  // Stop the ad
  VPAIDAd.prototype.stopAd = function() {
      if (this.isStarted) {
          this.isStarted = false;
          this.callEvent('AdStopped');
          console.log('Ad stopped');
      }
  };

  // Skipping the ad
  VPAIDAd.prototype.skipAd = function() {
      console.log('Ad skipped');
      this.callEvent('AdSkipped');
  };

  // Resize the ad
  VPAIDAd.prototype.resizeAd = function(width, height, viewMode) {
      console.log('Ad resized to width: ' + width + ', height: ' + height);
      // You can add more functionality to actually handle resizing if necessary
  };

  // Pause the ad
  VPAIDAd.prototype.pauseAd = function() {
      console.log('Ad paused');
      this.callEvent('AdPaused');
  };

  // Resume the ad after pause
  VPAIDAd.prototype.resumeAd = function() {
      console.log('Ad resumed');
      this.callEvent('AdResumed');
  };

  // Expand the ad
  VPAIDAd.prototype.expandAd = function() {
      console.log('Ad expanded');
      this.callEvent('AdExpanded');
  };

  // Collapse the ad
  VPAIDAd.prototype.collapseAd = function() {
      console.log('Ad collapsed');
      this.callEvent('AdCollapsed');
  };

  // Get the ad duration in seconds
  VPAIDAd.prototype.getAdDuration = function() {
      console.log('getAdDuration called');
      return this.adDuration;  // Returns the duration of the ad
  };

  // Get the current ad volume
  VPAIDAd.prototype.getAdVolume = function() {
      console.log('getAdVolume called');
      return this.adVolume;  // Return the current volume (1.0 = 100%)
  };

  // Set the ad volume
  VPAIDAd.prototype.setAdVolume = function(volume) {
      console.log('setAdVolume called with volume: ' + volume);
      this.adVolume = volume;
      this.callEvent('AdVolumeChange');
  };

  // Get ad icons (if available, return null if not using icons)
  VPAIDAd.prototype.getAdIcons = function() {
      console.log('getAdIcons called');
      return null;  // Return null if no icons are used in the ad
  };

  // Subscribe to events
  VPAIDAd.prototype.subscribe = function(event, callback) {
      this.eventsCallbacks[event] = callback;
  };

  // Call an event (notify player of ad events)
  VPAIDAd.prototype.callEvent = function(eventType) {
      var callback = this.eventsCallbacks[eventType];
      if (typeof callback === 'function') {
          callback();
      }
  };

  // Expose the VPAID ad object
  window.getVPAIDAd = function() {
      return new VPAIDAd();
  };
})();