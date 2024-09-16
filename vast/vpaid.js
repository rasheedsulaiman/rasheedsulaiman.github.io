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

  // Inject the entire HTML + script code as-is
  VPAIDAd.prototype.injectAdHtml = function() {
      var container = document.createElement('div');

      // Insert the HTML as-is, keeping it intact
      container.innerHTML = `<div id="ld-7573-2519"></div>
          <script>
              (function(w,d,s,i){
                  w.ldAdInit=w.ldAdInit||[];
                  w.ldAdInit.push({slot:13217938886688870,size:[0, 0],id:"ld-7573-2519"});
                  if(!d.getElementById(i)){
                      var j=d.createElement(s),p=d.getElementsByTagName(s)[0];
                      j.async=true;
                      j.src="https://testing.test.decide.co/_js/ajs.js";
                      j.id=i;
                      p.parentNode.insertBefore(j,p);
                  }
              })(window,document,"script","ld-ajs");
          </script>`;

      // Append the container to the document body
      document.body.appendChild(container);
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