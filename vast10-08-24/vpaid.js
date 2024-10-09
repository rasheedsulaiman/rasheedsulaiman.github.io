var getVPAIDAd = function () {
  var adPaused = false;
  var pausedTime = 0;
  var pauseStartTime = 0;
  var adProperties,
      adInterval,
      adContainer,
      adEvents = {},
      eventListeners = {},
      adVolume = 1;

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

  function triggerEvent(eventName) {
    if (eventName in eventListeners) {
      eventListeners[eventName].forEach(function(callback) {
        callback();
      });
    }
  }

  function initializeAdContainer() {
    adContainer = document.createElement('div');
    adContainer.id = 'ad-container';
    adProperties.slot.appendChild(adContainer);
  }

  function createAndRenderVideo() {
    var videoElement = document.createElement('video');
    videoElement.id = 'dynamic-video';
    adContainer.appendChild(videoElement);

    videoElement.addEventListener('loadedmetadata', function() {
      adProperties.duration = videoElement.duration;
      triggerEvent(VPAID_EVENTS.AdDurationChange);
    });

    videoElement.addEventListener('timeupdate', function() {
      var remainingTime = adProperties.duration - videoElement.currentTime;
      triggerEvent(VPAID_EVENTS.AdRemainingTimeChange);
    });

    videoElement.addEventListener('ended', function() {
      triggerEvent(VPAID_EVENTS.AdVideoComplete);
    });
  }

  adEvents.handshakeVersion = function (version) {
    return "2.0";
  };

  adEvents.initAd = function (width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    adProperties = {
      slot: environmentVars.slot,
      videoSlot: environmentVars.videoSlot,
      width: width,
      height: height,
      viewMode: viewMode,
      expanded: false,
      skippableState: false,
      duration: 60,
      skipDuration: 5,
      startTime: 0,
      ready: false
    };
    initializeAdContainer();
    triggerEvent(VPAID_EVENTS.AdLoaded);
  };

  adEvents.startAd = function () {
    if (!adProperties.ready) {
      adProperties.ready = true;
    }

    createAndRenderVideo();
    adProperties.startTime = getCurrentTime();
    adInterval = setInterval(updateAd, 500);
    triggerEvent(VPAID_EVENTS.AdStarted);
  };

  adEvents.stopAd = function () {
    adProperties.ready = false;
    clearTimeout(adInterval);
    if (adContainer.parentNode) {
      adContainer.parentNode.removeChild(adContainer);
    }
    setTimeout(function () {
      triggerEvent(VPAID_EVENTS.AdStopped);
    }, 100);
  };

  adEvents.resizeAd = function (width, height, viewMode) {
    adProperties.width = width;
    adProperties.height = height;
    triggerEvent(VPAID_EVENTS.AdSizeChange);
  };

  adEvents.pauseAd = function () {
    adPaused = true;
    pauseStartTime = getCurrentTime();
    triggerEvent(VPAID_EVENTS.AdPaused);
  };

  adEvents.resumeAd = function () {
    adPaused = false;
    pausedTime += getCurrentTime() - pauseStartTime;
    triggerEvent(VPAID_EVENTS.AdPlaying);
  };

  adEvents.getAdVolume = function () {
    return adVolume;
  };

  adEvents.setAdVolume = function (volume) {
    adVolume = volume;
    triggerEvent(VPAID_EVENTS.AdVolumeChange);
  };

  adEvents.subscribe = function (callback, eventName) {
    if (!(eventName in eventListeners)) {
      eventListeners[eventName] = [];
    }
    eventListeners[eventName].push(callback);
  };

  adEvents.unsubscribe = function (eventName) {
    if (eventName in eventListeners) {
      delete eventListeners[eventName];
    }
  };

  function getCurrentTime() {
    return new Date().getTime();
  }

  function updateAd() {
    // Update ad state
  }

  return adEvents;
};

window.getVPAIDAd = getVPAIDAd;