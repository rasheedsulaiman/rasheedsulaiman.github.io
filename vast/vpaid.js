(function() {
  var VPAIDAd = function() {
      this.eventsCallbacks = {};
      this.isStarted = false;
  };

  // Initialize the ad with the given parameters
  VPAIDAd.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
      console.log('Ad initialized with width: ' + width + ', height: ' + height);
      this.injectAdHtml();
      this.callEvent('AdLoaded');
  };

  // Inject the HTML and script into the video player
  VPAIDAd.prototype.injectAdHtml = function() {
      // Create a container for the HTML
      var container = document.createElement('div');
      container.innerHTML = '<div id="ld-7573-2519"></div>';

      // Append the container to the body or video player
      document.body.appendChild(container);

      // Load the external JavaScript
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://testing.test.decide.co/_js/ajs.js';

      // Append the script to the body
      document.body.appendChild(script);

      // Trigger the ad display (optional)
      window.ldAdInit = window.ldAdInit || [];
      window.ldAdInit.push({
          slot: 13217938886688870,
          size: [0, 0],
          id: "ld-7573-2519"
      });
  };

  VPAIDAd.prototype.startAd = function() {
      this.isStarted = true;
      this.callEvent('AdStarted');
      console.log('Ad started');
  };

  VPAIDAd.prototype.stopAd = function() {
      this.isStarted = false;
      this.callEvent('AdStopped');
      console.log('Ad stopped');
  };

  // Callbacks for event subscription and triggering
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