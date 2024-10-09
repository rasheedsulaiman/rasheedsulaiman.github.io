var getVPAIDAd = function() {
  // The slot is the div element on the main page that the ad is supposed to
  // occupy.
  this._slot = null;
  // The video slot is the video object that the creative can use to render the
  // video element it might have.
  this._videoSlot = null;
  // VPAID events
  this.VPAID_EVENTS = {
      AdStarted: "AdStarted",
      AdStopped: "AdStopped",
      AdSkipped: "AdSkipped",
      AdLoaded: "AdLoaded",
      AdLinearChange: "AdLinearChange",
      AdSizeChange: "AdSizeChange",
      AdExpandedChange: "AdExpandedChange",
      AdSkippableStateChange: "AdSkippableStateChange",
      AdDurationChange: "AdDurationChange",
      AdRemainingTimeChange: "AdRemainingTimeChange",
      AdVolumeChange: "AdVolumeChange",
      AdImpression: "AdImpression",
      AdClickThru: "AdClickThru",
      AdInteraction: "AdInteraction",
      AdVideoStart: "AdVideoStart",
      AdVideoFirstQuartile: "AdVideoFirstQuartile",
      AdVideoMidpoint: "AdVideoMidpoint",
      AdVideoThirdQuartile: "AdVideoThirdQuartile",
      AdVideoComplete: "AdVideoComplete",
      AdUserAcceptInvitation: "AdUserAcceptInvitation",
      AdUserMinimize: "AdUserMinimize",
      AdUserClose: "AdUserClose",
      AdPaused: "AdPaused",
      AdPlaying: "AdPlaying",
      AdError: "AdError",
      AdLog: "AdLog"
  };
  // An object containing all registered events.  These events are all
  // callbacks from the vpaid ad.
  this._eventCallbacks = {};
  // A list of attributes getable and setable.
  this._attributes = {
      companions : "",
      desiredBitrate : 256,
      duration : 30,
      expanded : false,
      width : 0,
      height : 0,
      nonLinearSlotHeight : 150,
      viewMode : "normal",
      icons : "",
      linear : true,
      currentTime : 0,
      remainingTime : 30,
      skippableState : false,
      volume : 1
  };

  this._quartileEvents = [
      { event: 'AdImpression', value: 0 }, { event: 'AdVideoStart', value: 0 },
      { event: 'AdVideoFirstQuartile', value: 25 },
      { event: 'AdVideoMidpoint', value: 50 },
      { event: 'AdVideoThirdQuartile', value: 75 },
      { event: 'AdVideoComplete', value: 100 }
  ];
  this._nextQuartileIndex = 0;

  this._currentAd = null;

  this._isStarted = false;
  this._isPaused = false;
};
adEvents.doContentComplete = function() {
  console.log('VP > contentEndedListener executed');
};
adEvents.onAdLoaded = function() {
  if (this.VPAID_EVENTS.AdLoaded in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdLoaded]();
  }
};
adEvents.onAdStarted = function() {
  if (this.VPAID_EVENTS.AdStarted in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdStarted]();
  }
};
adEvents.onAdVideoStart = function() {
  if (this.VPAID_EVENTS.AdVideoStart in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdVideoStart]();
  }
};
adEvents.onAdImpression = function() {
  if (this.VPAID_EVENTS.AdImpression in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdImpression]();
  }
};
adEvents.onAdClickThru = function(url, id, playerHandles) {
  if (this.VPAID_EVENTS.AdClickThru in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdClickThru](url, id, playerHandles);
  }
};
adEvents.onAdVideoFirstQuartile = function() {
  if (this.VPAID_EVENTS.AdVideoFirstQuartile in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdVideoFirstQuartile]();
  }
};
adEvents.onAdVideoMidpoint = function() {
  if (this.VPAID_EVENTS.AdVideoMidpoint in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdVideoMidpoint]();
  }
};
adEvents.onAdVideoThirdQuartile = function() {
  if (this.VPAID_EVENTS.AdVideoThirdQuartile in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdVideoThirdQuartile]();
  }
};
adEvents.onAdVideoComplete = function() {
  console.log('VP > onAdVideoComplete');
  if (this.VPAID_EVENTS.AdVideoComplete in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdVideoComplete]();
  }
};
adEvents.onAdPaused = function() {
  if (this.VPAID_EVENTS.AdPaused in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdPaused]();
  }
};
adEvents.onAdPlaying = function() {
  if (this.VPAID_EVENTS.AdPlaying in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdPlaying]();
  }
};
adEvents.onAdVolumeChange = function() {
  if (this.VPAID_EVENTS.AdVolumeChange in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdVolumeChange]();
  }
};
adEvents.onAdStopped = function() {
  if (this.VPAID_EVENTS.AdStopped in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdStopped]();
  }
};
adEvents.onAdSkipped = function() {
  if (this.VPAID_EVENTS.AdSkipped in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdSkipped]();
  }
};
adEvents.onAdDurationChange = function() {
  if (this.VPAID_EVENTS.AdDurationChange in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdDurationChange]();
  }
};
adEvents.onAdInteraction = function() {
  if (this.VPAID_EVENTS.AdInteraction in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdInteraction]();
  }
};
adEvents.onAdLinearChange = function() {
  if (this.VPAID_EVENTS.AdLinearChange in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdLinearChange]();
  }
};
adEvents.onAdSkippableStateChange = function() {
  if (this.VPAID_EVENTS.AdSkippableStateChange in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdSkippableStateChange]();
  }
};
adEvents.onAdRemainingTimeChange = function() {
  if (this.VPAID_EVENTS.AdRemainingTimeChange in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdRemainingTimeChange]();
  }
}
adEvents.onAdUserClose = function() {
  if (this.VPAID_EVENTS.AdUserClose in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdUserClose]();
  }
};
adEvents.onAdLog = function(message) {
  if (this.VPAID_EVENTS.AdLog in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdLog](message);
  }
};
adEvents.onAdSizeChange = function() {
  if (this.VPAID_EVENTS.AdSizeChange in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdSizeChange]();
  }
};
adEvents.onAdExpandedChange = function() {
  if (this.VPAID_EVENTS.AdExpandedChange in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdExpandedChange]();
  }
};
adEvents.onAdError = function(message) {
  if (this.VPAID_EVENTS.AdError in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdError](message);
  }
};
adEvents.handshakeVersion = function(version) {
  return ('2.0');
};
adEvents.timeUpdateHandler = function() {
  if (this._nextQuartileIndex >= this._quartileEvents.length) {
      return;
  }
  var percentPlayed = this._videoSlot.currentTime * 100.0 / this._videoSlot.duration;
  if (percentPlayed >= this._quartileEvents[this._nextQuartileIndex].value) {
      var lastQuartileEvent = this._quartileEvents[this._nextQuartileIndex].event;
      console.log('VP >', lastQuartileEvent);
      this._eventCallbacks[lastQuartileEvent]();
      this._nextQuartileIndex += 1;
  }
  if (this._videoSlot.duration > 0) {
      this._attributes.remainingTime = this._videoSlot.duration - this._videoSlot.currentTime;
  }
};
adEvents.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {

  console.log('initAd', width, height, viewMode, desiredBitrate, creativeData, environmentVars);

  // slot and videoSlot are passed as part of the environmentVars
  this._slot = environmentVars.slot;
  this._videoSlot = environmentVars.videoSlot;

  // Fix for Safari mobile browser
  //this._videoSlot.setAttribute('muted','');
  //this._videoSlot.muted = true;

  this._attributes.width = width;
  this._attributes.height = height;
  this._attributes.viewMode = viewMode;
  this._attributes.desiredBitrate = desiredBitrate;

  this.log('initAd ' + width + 'x' + height + ' ' + viewMode + ' ' + desiredBitrate);

  //console.log('VP > ', creativeData);
  //console.log('VP > environmentVars', environmentVars);
  //console.log('VP > VIDEO SLOT', this._videoSlot);

  var that = this;
  if(this._videoSlot == null) {
      this._videoSlot = document.createElement('video');
      this._slot.appendChild(this._videoSlot);
  }

  this._videoSlot.setAttribute('id', 'dynamic-video');

  this._videoSlot.setAttribute('src', 'https://cdn1.decide.co/uploads/36ea573d1eb6efdd8d03fb2ce4b08ac6153e44bf09bda98e404418b54b2c7c97_video_large');

  this._videoSlot.addEventListener('timeupdate', this.timeUpdateHandler.bind(this), false);
  this._videoSlot.addEventListener('loadedmetadata', function(event) {
      // The ad duration is not known until the media metadata is loaded.
      // Then, update the player with the duration change.
      that._attributes.duration = event.target.duration;
      that._attributes.remainingTime = event.target.duration;
      that.onAdDurationChange();
  }, false);

  this._videoSlot.addEventListener('ended', this.stopAd.bind(this), false);

  // AdClickThru
  /*
  this._slot.addEventListener('click', function(event) {
      //var targetUrl = 'http://192.168.1.111/';
      //var opener = window.open(targetUrl, "_blank");
      //void 0 !== opener ? opener.focus() : window.location.href = targetUrl
      if(!that._isPaused) {
          that.pauseAd();
      } else {
          that.resumeAd();
      }
  }, false);
  */
  this._slot.addEventListener('click', function() {
      that.onAdClickThru('', '0');
  }, false);

  this.onAdLoaded();
};
adEvents.startAd = function() {
  console.log('VP > startAd');

  this._videoSlot.play();
  //this._videoSlot.load();
  this.onAdStarted();
};
adEvents.getAdVolume = function() {
  return this._attributes.volume;
};
adEvents.setAdVolume = function(value) {
  var isChanged = value !== this._attributes.volume;
  if(isChanged) {
      this._attributes.volume = value;
      this._videoSlot.volume = value;
      this.onAdVolumeChange();
  }
};
adEvents.resumeAd = function() {
  this._videoSlot.play();
  this._isPaused = !1;
  this.onAdPlaying();
};
adEvents.pauseAd = function() {
  this._videoSlot.pause();
  this._isPaused = !0;
  this.onAdPaused();
};
adEvents.resizeAd = function(width, height, viewMode) {
  console.log('VP > resizeAd', width, height, viewMode);
  this._attributes.width = width;
  this._attributes.height = height;
  this._attributes.viewMode = viewMode;
  this.onAdSizeChange();
};
adEvents.stopAd = function() {
  console.log('VP > stopAd');
  this.log('Stopping ad');
  var that = this;
  // Calling AdStopped immediately terminates the ad. Setting a timeout allows events to go through.
  setTimeout(function () {
      that.onAdStopped();
  }, 75);
};
adEvents.getAdExpanded = function() {
  return this._attributes.expanded;
};
adEvents.collapseAd = function() {
  this._attributes.expanded = false;
  this.onAdExpandedChange();
};
adEvents.expandAd = function() {
  this._attributes.expanded = true;
  this.onAdExpandedChange();
};
adEvents.getAdSkippableState = function() {
  return this._attributes.skippableState;
};
adEvents.skipAd = function() {
  this.onAdSkipped();
};
adEvents.subscribe = function(callback, eventName, context) {
  this.log('Subscribe ' + eventName);
  var givenCallback = callback.bind(context);
  this._eventCallbacks[eventName] = givenCallback;
};
adEvents.unsubscribe = function(eventName) {
  this.log('unsubscribe ' + eventName);
  this._eventCallbacks[eventName] = null;
};
adEvents.getAdWidth = function() {
  return this._attributes.width;
};
adEvents.getAdHeight = function() {
  return this._attributes.height;
};
adEvents.getAdRemainingTime = function() {
  return this._videoSlot.duration - this._videoSlot.currentTime; //this._attributes.remainingTime;
};
adEvents.getAdDuration = function() {
  //console.log('VP > getAdDuration', this._attributes.duration);
  return this._attributes.duration;
};
adEvents.getAdCompanions = function() {
  return [];
};
adEvents.getAdIcons = function() {
  return this._attributes.icons;
};
adEvents.getAdLinear = function() {
  return this._attributes.linear;
};
adEvents.log = function(message) {
  console.log(message);
};

function getVPAIDAd() {
  //console.log('VP > getVPAIDAd');
  return new LinearAd;
}
window.getVPAIDAd = getVPAIDAd