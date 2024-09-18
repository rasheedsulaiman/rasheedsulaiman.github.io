// https://gist.github.com/afuggini/3afe51168ab0c416c97876e2e15909b0
// This class is meant to be part of the video player that interacts with the Ad.
// It takes the VPAID creative as a parameter in its contructor.
var VPAIDWrapper = function (VPAIDCreative) {
  this._creative = VPAIDCreative
  if (!this.checkVPAIDInterface(VPAIDCreative)) {
    //The VPAIDCreative doesn't conform to the VPAID spec
    console.error('VPAIDCreative doesn\'t conform to the VPAID spec')
    return
  }
  this.setCallbacksForCreative()
}

VPAIDWrapper.prototype.checkVPAIDInterface = function (VPAIDCreative) {
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
}

VPAIDWrapper.prototype.setCallbacksForCreative = function () {
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
}

// Example callback functions
VPAIDWrapper.prototype.onStartAd = function () {
  console.log('Ad started');
}

VPAIDWrapper.prototype.onStopAd = function () {
  console.log('Ad stopped');
}

VPAIDWrapper.prototype.onSkipAd = function () {
  console.log('Ad skipped');
}

VPAIDWrapper.prototype.onAdLoaded = function () {
  console.log('Ad loaded');
}

VPAIDWrapper.prototype.onAdLinearChange = function () {
  console.log('Ad linear change');
}

VPAIDWrapper.prototype.onAdSizeChange = function () {
  console.log('Ad size change');
}

VPAIDWrapper.prototype.onAdExpandedChange = function () {
  console.log('Ad expanded change');
}

VPAIDWrapper.prototype.onAdSkippableStateChange = function () {
  console.log('Ad skippable state change');
}