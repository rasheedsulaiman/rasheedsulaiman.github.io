var getVPAIDAd = function () {
  var adProperties = {};
  var adEvents = {};
  var eventListeners = {};
  var adPaused = false;

  // Define VPAID events
  var VPAID_EVENTS = {
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

  // Register event callbacks
  var triggerEvent = function (eventName) {
    if (eventName in eventListeners) {
      for (var i = 0; i < eventListeners[eventName].length; i++) {
        eventListeners[eventName][i]();
      }
    }
  };

  // Init Ad function
  adEvents.initAd = function (width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    adProperties = {
      slot: environmentVars.slot,
      videoSlot: environmentVars.videoSlot,
      width: width,
      height: height,
      viewMode: viewMode,
      desiredBitrate: desiredBitrate,
      duration: 30,
      volume: 1,
      skippableState: false,
      expanded: false,
      currentTime: 0,
      remainingTime: 30,
      linear: true
    };

    if (!adProperties.videoSlot) {
      adProperties.videoSlot = document.createElement('video');
      adProperties.slot.appendChild(adProperties.videoSlot);
    }

    adProperties.videoSlot.setAttribute('id', 'dynamic-video');
    adProperties.videoSlot.setAttribute('src', 'https://cdn1.decide.co/uploads/36ea573d1eb6efdd8d03fb2ce4b08ac6153e44bf09bda98e404418b54b2c7c97_video_large');
    adProperties.videoSlot.addEventListener('timeupdate', adEvents.onTimeUpdate.bind(this), false);
    adProperties.videoSlot.addEventListener('loadedmetadata', adEvents.onLoadedMetadata.bind(this), false);
    adProperties.videoSlot.addEventListener('ended', adEvents.stopAd.bind(this), false);

    adProperties.slot.addEventListener('click', function () {
      adEvents.onAdClickThru('', '0');
    }, false);

    triggerEvent(VPAID_EVENTS.AdLoaded);
  };

  adEvents.onLoadedMetadata = function(event) {
    adProperties.duration = event.target.duration;
    adProperties.remainingTime = event.target.duration;
    adEvents.onAdDurationChange();
  };

  adEvents.onTimeUpdate = function () {
    var percentPlayed = adProperties.videoSlot.currentTime * 100.0 / adProperties.videoSlot.duration;
    adProperties.remainingTime = adProperties.videoSlot.duration - adProperties.videoSlot.currentTime;
  };

  adEvents.startAd = function () {
    adProperties.videoSlot.play();
    triggerEvent(VPAID_EVENTS.AdStarted);
  };

  adEvents.stopAd = function () {
    adProperties.ready = false;
    setTimeout(function () {
      triggerEvent(VPAID_EVENTS.AdStopped);
    }, 75);
  };

  adEvents.onAdClickThru = function (url, id, playerHandles) {
    triggerEvent(VPAID_EVENTS.AdClickThru);
  };

  adEvents.onAdDurationChange = function () {
    triggerEvent(VPAID_EVENTS.AdDurationChange);
  };

  adEvents.resizeAd = function (width, height, viewMode) {
    adProperties.width = width;
    adProperties.height = height;
    adProperties.viewMode = viewMode;
    triggerEvent(VPAID_EVENTS.AdSizeChange);
  };

  adEvents.pauseAd = function () {
    adProperties.videoSlot.pause();
    adPaused = true;
    triggerEvent(VPAID_EVENTS.AdPaused);
  };

  adEvents.resumeAd = function () {
    adProperties.videoSlot.play();
    adPaused = false;
    triggerEvent(VPAID_EVENTS.AdPlaying);
  };

  adEvents.getAdVolume = function () {
    return adProperties.volume;
  };

  adEvents.setAdVolume = function (value) {
    adProperties.volume = value;
    adProperties.videoSlot.volume = value;
    triggerEvent(VPAID_EVENTS.AdVolumeChange);
  };

  adEvents.getAdLinear = function () {
    return adProperties.linear;
  };

  adEvents.getAdSkippableState = function () {
    return adProperties.skippableState;
  };

  adEvents.getAdRemainingTime = function () {
    return adProperties.remainingTime;
  };

  adEvents.expandAd = function () {
    adProperties.expanded = true;
    triggerEvent(VPAID_EVENTS.AdExpandedChange);
  };

  adEvents.collapseAd = function () {
    adProperties.expanded = false;
    triggerEvent(VPAID_EVENTS.AdExpandedChange);
  };

  adEvents.getAdDuration = function () {
    return adProperties.duration;
  };

  adEvents.subscribe = function (callback, eventName, context) {
    callback = callback.bind(context);
    if (!(eventName in eventListeners)) {
        eventListeners[eventName] = [];
    }
    eventListeners[eventName].push(callback);
  };

  adEvents.unsubscribe = function (eventName) {
    eventListeners[eventName] = [];
  };

  adEvents.getAdWidth = function () {
    return adProperties.width;
  };

  adEvents.getAdHeight = function () {
    return adProperties.height;
  };

  adEvents.getAdExpanded = function () {
    return adProperties.expanded;
  };

  adEvents.skipAd = function () {
    if (adProperties.skippableState) {
      triggerEvent(VPAID_EVENTS.AdSkipped);
    }
  };

  adEvents.getAdIcons = function () {
    return "";
  };

  adEvents.getAdCompanions = function () {
    return "";
  };

  return adEvents;
};

window.getVPAIDAd = getVPAIDAd;
