// VPAID 2.0 Creative Implementation
var VPAIDCreative = function() {
  this.eventsCallbacks = {};
  this.attributes = {
    adWidth: 0,
    adHeight: 0,
    adExpanded: false,
    adSkippableState: false,
    adRemainingTime: 0,
    adDuration: 0,
    adVolume: 1.0,
    adIcons: null // Initialize adIcons attribute
  };
  this.videoElement = null;
};

VPAIDCreative.prototype.handshakeVersion = function(version, callback) {
  callback('2.0');
};

VPAIDCreative.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars, callback) {
  this.attributes.adWidth = width;
  this.attributes.adHeight = height;
  this.attributes.adDuration = 30; // Example duration

  // Create video element
  this.videoElement = document.createElement('video');
  this.videoElement.width = width;
  this.videoElement.src = 'https://rasheedsulaiman.github.io/vast/test-ad.mp4'; // Replace with your ad video URL
  this.videoElement.controls = true;

  // Append video element to the body
  document.body.appendChild(this.videoElement);

  this.dispatchEvent('AdLoaded');
  callback();
};

VPAIDCreative.prototype.startAd = function(callback) {
  if (this.videoElement) {
    this.videoElement.play();
  }
  this.dispatchEvent('AdStarted');
  callback();
};

VPAIDCreative.prototype.stopAd = function(callback) {
  if (this.videoElement) {
    this.videoElement.pause();
    this.videoElement.remove();
  }
  this.dispatchEvent('AdStopped');
  callback();
};

VPAIDCreative.prototype.skipAd = function(callback) {
  this.dispatchEvent('AdSkipped');
  callback();
};

VPAIDCreative.prototype.resizeAd = function(width, height, viewMode, callback) {
  this.attributes.adWidth = width;
  this.attributes.adHeight = height;
  if (this.videoElement) {
    this.videoElement.width = width;
    this.videoElement.height = height;
  }
  this.dispatchEvent('AdSizeChange');
  callback();
};

VPAIDCreative.prototype.pauseAd = function(callback) {
  if (this.videoElement) {
    this.videoElement.pause();
  }
  this.dispatchEvent('AdPaused');
  callback();
};

VPAIDCreative.prototype.resumeAd = function(callback) {
  if (this.videoElement) {
    this.videoElement.play();
  }
  this.dispatchEvent('AdPlaying');
  callback();
};

VPAIDCreative.prototype.expandAd = function(callback) {
  this.attributes.adExpanded = true;
  this.dispatchEvent('AdExpandedChange');
  callback();
};

VPAIDCreative.prototype.collapseAd = function(callback) {
  this.attributes.adExpanded = false;
  this.dispatchEvent('AdExpandedChange');
  callback();
};

VPAIDCreative.prototype.subscribe = function(callback, eventName, context) {
  this.eventsCallbacks[eventName] = callback.bind(context);
};

VPAIDCreative.prototype.unsubscribe = function(eventName) {
  delete this.eventsCallbacks[eventName];
};

VPAIDCreative.prototype.dispatchEvent = function(eventName) {
  if (this.eventsCallbacks[eventName]) {
    this.eventsCallbacks[eventName]();
  }
};

// Implement the getAdIcons method
VPAIDCreative.prototype.getAdIcons = function() {
  return this.attributes.adIcons;
};

// Expose the VPAID creative to the global scope
window.getVPAIDAd = function() {
  return new VPAIDCreative();
};