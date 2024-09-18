// VPAID 2.0 Creative Implementation
var VPAIDCreative = function() {
  this.eventsCallbacks = {};
  this.attributes = {
    adWidth: 640,
    adHeight: 360,
    adExpanded: false,
    adSkippableState: false,
    adRemainingTime: 0,
    adDuration: 30, // Example duration
    adVolume: 1.0,
    adIcons: null, // Initialize adIcons attribute
    adLinear: true // Initialize adLinear attribute
  };
  this.videoElement = null;
};

VPAIDCreative.prototype.handshakeVersion = function(version) {
  console.log("handshakeVersion called with version:", version);
  return "2.0"; // Return the version as a string, not through a callback
};

VPAIDCreative.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars, callback) {
  console.log("initAd called with width:", width, "height:", height, "viewMode:", viewMode);
  this.attributes.adWidth = width;
  this.attributes.adHeight = height;
  // Create and append video element
  this.videoElement = document.createElement("video");
  this.videoElement.width = width;
  this.videoElement.height = height;
  this.videoElement.src = "https://rasheedsulaiman.github.io/vast/test-ad.mp4";
  this.videoElement.controls = true;
  document.body.appendChild(this.videoElement);
  this.dispatchEvent("AdLoaded");
  // Safely check if callback is a function
  if (typeof callback === "function") {
    callback();
  } else {
    console.warn("initAd callback is not a function");
  }
};

VPAIDCreative.prototype.startAd = function(callback) {
  console.log("startAd called");
  if (this.videoElement) {
    this.videoElement.play();
  }
  this.dispatchEvent("AdStarted");
  // Safely check if callback is a function
  if (typeof callback === "function") {
    callback();
  } else {
    console.warn("startAd callback is not a function");
  }
};

VPAIDCreative.prototype.stopAd = function(callback) {
  console.log("stopAd called");
  if (this.videoElement) {
    this.videoElement.pause();
    this.videoElement.remove();
  }
  this.dispatchEvent("AdStopped");
  if (typeof callback === "function") {
    console.log("stopAd callback is a function");
    callback();
  } else {
    console.error("stopAd callback is not a function");
  }
};

VPAIDCreative.prototype.skipAd = function(callback) {
  console.log("skipAd called");
  this.dispatchEvent("AdSkipped");
  if (typeof callback === "function") {
    console.log("skipAd callback is a function");
    callback();
  } else {
    console.error("skipAd callback is not a function");
  }
};

VPAIDCreative.prototype.resizeAd = function(width, height, viewMode, callback) {
  console.log("resizeAd called with width:", width, "height:", height, "viewMode:", viewMode);
  
  // Update ad dimensions
  this.attributes.adWidth = width;
  this.attributes.adHeight = height;

  // Update the video element dimensions if it exists
  if (this.videoElement) {
    this.videoElement.width = width;
    this.videoElement.height = height;
  }

  // Dispatch the AdSizeChange event
  this.dispatchEvent("AdSizeChange");

  // Safely check if callback is a function before calling it
  if (typeof callback === "function") {
    callback();
  } else {
    console.error("resizeAd callback is not a function");
  }
};

VPAIDCreative.prototype.pauseAd = function(callback) {
  console.log("pauseAd called");

  // Pause the video element if it exists
  if (this.videoElement) {
    this.videoElement.pause();
  }

  // Dispatch the AdPaused event
  this.dispatchEvent("AdPaused");

  // Safely check if callback is a function before calling it
  if (typeof callback === "function") {
    callback();
  } else {
    console.error("pauseAd callback is not a function");
  }
};

VPAIDCreative.prototype.resumeAd = function(callback) {
  console.log("resumeAd called");
  if (this.videoElement) {
    this.videoElement.play();
  }
  this.dispatchEvent("AdPlaying");
  if (typeof callback === "function") {
    console.log("resumeAd callback is a function");
    callback();
  } else {
    console.error("resumeAd callback is not a function");
  }
};

VPAIDCreative.prototype.expandAd = function(callback) {
  console.log("expandAd called");
  this.attributes.adExpanded = true;
  this.dispatchEvent("AdExpandedChange");
  if (typeof callback === "function") {
    console.log("expandAd callback is a function");
    callback();
  } else {
    console.error("expandAd callback is not a function");
  }
};

VPAIDCreative.prototype.collapseAd = function(callback) {
  console.log("collapseAd called");
  this.attributes.adExpanded = false;
  this.dispatchEvent("AdExpandedChange");
  if (typeof callback === "function") {
    console.log("collapseAd callback is a function");
    callback();
  } else {
    console.error("collapseAd callback is not a function");
  }
};

VPAIDCreative.prototype.subscribe = function(callback, eventName, context) {
  console.log("subscribe called for event:", eventName);
  this.eventsCallbacks[eventName] = callback.bind(context);
};

VPAIDCreative.prototype.unsubscribe = function(eventName) {
  console.log("unsubscribe called for event:", eventName);
  delete this.eventsCallbacks[eventName];
};

VPAIDCreative.prototype.dispatchEvent = function(eventName) {
  console.log("dispatchEvent called for event:", eventName);
  if (this.eventsCallbacks[eventName]) {
    this.eventsCallbacks[eventName]();
  } else {
    console.log("No callback registered for event:", eventName);
  }
};

// Implement the getAdIcons method
VPAIDCreative.prototype.getAdIcons = function() {
  console.log("getAdIcons called");
  return this.attributes.adIcons;
};

// Implement the getAdDuration method
VPAIDCreative.prototype.getAdDuration = function() {
  console.log("getAdDuration called");
  return this.attributes.adDuration;
};

// Implement the getAdExpanded method
VPAIDCreative.prototype.getAdExpanded = function() {
  console.log("getAdExpanded called");
  return this.attributes.adExpanded;
};

// Implement the getAdSkippableState method
VPAIDCreative.prototype.getAdSkippableState = function() {
  console.log("getAdSkippableState called");
  return this.attributes.adSkippableState;
};

// Implement the getAdRemainingTime method
VPAIDCreative.prototype.getAdRemainingTime = function() {
  return this.attributes.adRemainingTime;
};

// Implement the getAdVolume method
VPAIDCreative.prototype.getAdVolume = function() {
  console.log("getAdVolume called");
  return this.attributes.adVolume;
};

// Implement the setAdVolume method
VPAIDCreative.prototype.setAdVolume = function(volume) {
  console.log("setAdVolume called with volume:", volume);
  this.attributes.adVolume = volume;
  this.dispatchEvent("AdVolumeChange");
};

// Implement the getAdWidth method
VPAIDCreative.prototype.getAdWidth = function() {
  console.log("getAdWidth called");
  return this.attributes.adWidth;
};

// Implement the getAdHeight method
VPAIDCreative.prototype.getAdHeight = function() {
  console.log("getAdHeight called");
  return this.attributes.adHeight;
};

// Implement the getAdLinear method
VPAIDCreative.prototype.getAdLinear = function() {
  console.log("getAdLinear called");
  return this.attributes.adLinear;
};

// Expose the VPAID creative to the global scope
window.getVPAIDAd = function() {
  return new VPAIDCreative();
};

// Example usage of handshakeVersion
var creative = new VPAIDCreative();
creative.handshakeVersion("2.0", function(version) {
  console.log("Handshake completed with version:", version);
});