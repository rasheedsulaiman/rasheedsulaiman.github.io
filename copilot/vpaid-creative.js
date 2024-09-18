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
  this.videoElement.height = height;
  this.videoElement.src = 'https://rasheedsulaiman.github.io/vast/test-ad.mp4'; // Replace with your ad video URL
  this.videoElement.controls = true;

  // Append video element to the body
  document.body.appendChild(this.videoElement);

  this.dispatchEvent('AdLoaded');
  if (typeof callback === 'function') {
    callback();
  }
};

VPAIDCreative.prototype.startAd = function(callback) {
  if (this.videoElement) {
    this.videoElement.play();
  }
  this.dispatchEvent('AdStarted');
  if (typeof callback === 'function') {
    callback();
  }
};

VPAIDCreative.prototype.stopAd = function(callback) {
  if (this.videoElement) {
    this.videoElement.pause();
    this.videoElement.remove();
  }
  this.dispatchEvent('AdStopped');
  if (typeof callback === 'function') {
    callback();
  }
};

VPAIDCreative.prototype.skipAd = function(callback) {
  this.dispatchEvent('AdSkipped');
  if (typeof callback === 'function') {
    callback();
  }
};

VPAIDCreative.prototype.resizeAd = function(width, height, viewMode, callback) {
  this.attributes.adWidth = width;
  this.attributes.adHeight = height;
  if (this.videoElement) {
    this.videoElement.width = width;
    this.videoElement.height = height;
  }
  this.dispatchEvent('AdSizeChange');
  if (typeof callback === 'function') {
    callback();
  }
};

VPAIDCreative.prototype.pauseAd = function(callback) {
  if (this.videoElement) {
    this.videoElement.pause();
  }
  this.dispatchEvent('AdPaused');
  if (typeof callback === 'function') {
    callback();
  }
};

VPAIDCreative.prototype.resumeAd = function(callback) {
  if (this.videoElement) {
    this.videoElement.play();
  }
  this.dispatchEvent('AdPlaying');
  if (typeof callback === 'function') {
    callback();
  }
};

VPAIDCreative.prototype.expandAd = function(callback) {
  this.attributes.adExpanded = true;
  this.dispatchEvent('AdExpandedChange');
  if (typeof callback === 'function') {
    callback();
  }
};

VPAIDCreative.prototype.collapseAd = function(callback) {
  this.attributes.adExpanded = false;
  this.dispatchEvent('AdExpandedChange');
  if (typeof callback === 'function') {
    callback();
  }
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

// Implement the getAdDuration method
VPAIDCreative.prototype.getAdDuration = function() {
  return this.attributes.adDuration;
};

// Implement the getAdExpanded method
VPAIDCreative.prototype.getAdExpanded = function() {
  return this.attributes.adExpanded;
};

// Implement the getAdSkippableState method
VPAIDCreative.prototype.getAdSkippableState = function() {
  return this.attributes.adSkippableState;
};

// Implement the getAdRemainingTime method
VPAIDCreative.prototype.getAdRemainingTime = function() {
  return this.attributes.adRemainingTime;
};

// Implement the getAdVolume method
VPAIDCreative.prototype.getAdVolume = function() {
  return this.attributes.adVolume;
};

// Implement the setAdVolume method
VPAIDCreative.prototype.setAdVolume = function(volume) {
  this.attributes.adVolume = volume;
  this.dispatchEvent('AdVolumeChange');
};

// Implement the getAdWidth method
VPAIDCreative.prototype.getAdWidth = function() {
  return this.attributes.adWidth;
};

// Implement the getAdHeight method
VPAIDCreative.prototype.getAdHeight = function() {
  return this.attributes.adHeight;
};

// Implement the getAdLinear method
VPAIDCreative.prototype.getAdLinear = function() {
  return this.attributes.adLinear;
};

// Expose the VPAID creative to the global scope
window.getVPAIDAd = function() {
  return new VPAIDCreative();
};