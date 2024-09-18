// VPAID 2.0 Creative Implementation
var VPAIDCreative = function() {
  this.eventsCallbacks = {};
  this.attributes = {
    adWidth: 0,
    adHeight: 0,
    adExpanded: false,
    adSkippableState: false,
    adRemainingTime: 0,
    adDuration: 30,
    adVolume: 1.0
  };
};

VPAIDCreative.prototype.handshakeVersion = function(version, callback) {
  callback('2.0');
};

VPAIDCreative.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars, callback) {
  this.attributes.adWidth = width;
  this.attributes.adHeight = height;
  this.attributes.adDuration = 30; // Example duration
  this.dispatchEvent('AdLoaded');
  callback();
};

VPAIDCreative.prototype.startAd = function(callback) {
  this.dispatchEvent('AdStarted');
  callback();
};

VPAIDCreative.prototype.stopAd = function(callback) {
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
  this.dispatchEvent('AdSizeChange');
  callback();
};

VPAIDCreative.prototype.pauseAd = function(callback) {
  this.dispatchEvent('AdPaused');
  callback();
};

VPAIDCreative.prototype.resumeAd = function(callback) {
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

// VPAID Wrapper Implementation
var VPAIDWrapper = function(VPAIDCreative) {
  this._creative = VPAIDCreative;
  if (!this.checkVPAIDInterface(VPAIDCreative)) {
    console.error('VPAIDCreative doesn\'t conform to the VPAID spec');
    return;
  }
  this.setCallbacksForCreative();
};

VPAIDWrapper.prototype.checkVPAIDInterface = function(VPAIDCreative) {
  const requiredFunctions = [
    'handshakeVersion', 'initAd', 'startAd', 'stopAd', 'skipAd', 'resizeAd',
    'pauseAd', 'resumeAd', 'expandAd', 'collapseAd', 'subscribe', 'unsubscribe'
  ];

  for (let func of requiredFunctions) {
    if (!VPAIDCreative[func] || typeof VPAIDCreative[func] !== 'function') {
      console.error(`VPAIDCreative is missing or has an invalid function: ${func}`);
      return false;
    }
  }
  return true;
};

VPAIDWrapper.prototype.setCallbacksForCreative = function() {
  var callbacks = {
    AdStarted: this.onStartAd,
    AdStopped: this.onStopAd,
    AdSkipped: this.onSkipAd,
    AdLoaded: this.onAdLoaded,
    AdLinearChange: this.onAdLinearChange,
    AdSizeChange: this.onAdSizeChange,
    AdExpandedChange: this.onAdExpandedChange,
    AdSkippableStateChange: this.onAdSkippableStateChange,
    // Add other callbacks as needed
  };

  for (let event in callbacks) {
    if (callbacks.hasOwnProperty(event) && typeof this._creative.subscribe === 'function') {
      this._creative.subscribe(callbacks[event], event, this);
    }
  }
};

// Example callback functions
VPAIDWrapper.prototype.onStartAd = function() {
  console.log('Ad started');
};

VPAIDWrapper.prototype.onStopAd = function() {
  console.log('Ad stopped');
};

VPAIDWrapper.prototype.onSkipAd = function() {
  console.log('Ad skipped');
};

VPAIDWrapper.prototype.onAdLoaded = function() {
  console.log('Ad loaded');
};

VPAIDWrapper.prototype.onAdLinearChange = function() {
  console.log('Ad linear change');
};

VPAIDWrapper.prototype.onAdSizeChange = function() {
  console.log('Ad size change');
};

VPAIDWrapper.prototype.onAdExpandedChange = function() {
  console.log('Ad expanded change');
};

VPAIDWrapper.prototype.onAdSkippableStateChange = function() {
  console.log('Ad skippable state change');
};

// Instantiate the VPAID creative and wrapper
var vpaidCreative = new VPAIDCreative();
var vpaidWrapper = new VPAIDWrapper(vpaidCreative);

// Expose the VPAID creative to the global scope
window.getVPAIDAd = function() {
  return vpaidCreative;
};