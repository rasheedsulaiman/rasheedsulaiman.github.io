(function() {
  var VPAIDAd = function() {
      this.eventsCallbacks = {};
      this.adDuration = 30; // Example duration in seconds
      this.startTime = 0;
      this.isStarted = false;
  };

  VPAIDAd.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
      // Initialize the ad with the given parameters
      console.log('Ad initialized with width: ' + width + ', height: ' + height);
      this.startTime = new Date().getTime();
      this.callEvent('AdLoaded');
  };

  VPAIDAd.prototype.startAd = function() {
      // Start the ad experience
      this.isStarted = true;
      this.callEvent('AdStarted');
      console.log('Ad started');
      // Simulate 30 second ad
      setTimeout(() => {
          this.stopAd();
      }, this.adDuration * 1000);
  };

  VPAIDAd.prototype.stopAd = function() {
      // End the ad
      if (this.isStarted) {
          this.isStarted = false;
          this.callEvent('AdStopped');
          console.log('Ad stopped');
      }
  };

  VPAIDAd.prototype.expandAd = function() {
    // Logic to expand the ad, e.g., increasing the size of the ad container
    console.log('expandAd called');
    // Notify the player that the ad has been expanded
    this.callEvent('AdExpanded');
  };

  VPAIDAd.prototype.collapseAd = function() {
    // Logic to collapse the ad, if necessary, or a placeholder function
    console.log('collapseAd called');
  };

  VPAIDAd.prototype.subscribe = function(event, callback) {
      this.eventsCallbacks[event] = callback;
  };

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