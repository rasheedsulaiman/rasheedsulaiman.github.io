var getVPAIDAd = function () {
  var adPaused = false;
  function setupClickTracking() {
      var intervalId = setInterval(function () {
          var activeElement = document.activeElement;
          if (activeElement && activeElement.tagName === "IFRAME") {
              clearInterval(intervalId);
              if (getClosestParentWithId(activeElement.parentNode).id === "on-c") {
                  handleAdClickThru();
              }
          }
      }, 100);

      var adClicked = false;

      try {
          document.querySelector("iframe").addEventListener("load", function () {
              this.blur();
          });
      } catch (e) {}

      function handleAdClickThru() {
          if (!adClicked) {
              clearInterval(intervalId);
              adClicked = true;
              triggerEvent("AdClickThru");
          }
      }

      document.querySelector("#on-c").addEventListener("click", function () {
          handleAdClickThru();
      });
  }
  function getClosestParentWithId(element) {
      return element.id !== "on-c" ? element.closest("#on-c") : element;
  }

  var adProperties,
      adInterval,
      adContainer,
      adEvents = {},
      eventListeners = {},
      adVolume = 1,
      adElements = {},
      triggerEvent = function (eventName) {
          if (eventName in eventListeners) {
              for (var i = 0; i < eventListeners[eventName].length; i++) {
                  eventListeners[eventName][i]();
              }
          }
      };

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
  adEvents.handshakeVersion = function (version) {
      return "2.0";
  };
  adEvents.initAd = function (width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    console.log('environmentVars: ', environmentVars);
    adProperties = {
        slot: environmentVars.slot,
        videoSlot: environmentVars.videoSlot || null,
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
    console.log('Ad properties.slot: ', adProperties.slot);
    console.log('Ad properties.videoSlot: ', adProperties.videoSlot);

    // Initialize the video slot if available
    if (adProperties.videoSlot) {
      console.log('Using video slot for playback');
      adProperties.videoSlot.setAttribute('src', 'https://cdn1.decide.co/uploads/0fedb9c486ee0e4aac922c26b04cc0ba141532213cd8efd114344460d72a5620_video_large');
      adProperties.videoSlot.setAttribute('id', 'dynamic-video');

      // Set up video event listeners
      adProperties.videoSlot.addEventListener('loadedmetadata', function () {
        var videoDuration = adProperties.videoSlot.duration;
        if (typeof adProperties !== 'undefined') {
          adProperties.duration = videoDuration;
          adEvents.onAdDurationChange();
        }
      });

      adProperties.videoSlot.addEventListener('error', function (e) {
        console.log('Error playing video: ', e);
      });

      console.log('Video slot initialized');
    }

    initializeAdContainer(); // Initialize the ad container
    // adProperties.ready = true;  Set the ad as ready
    triggerEvent("AdLoaded");  // Dispatch the AdLoaded event
  };
  adEvents.startAd = function () {
    if (!adProperties.ready) {
        return setTimeout(adEvents.startAd, 250);
    }

    // Play the video slot if available
    if (adProperties.videoSlot) {
      adProperties.videoSlot.play().catch(function (error) {
        console.log('Error playing video: ', error);
      });
      console.log('Video slot playing');
    } else {
      console.log('No video slot available');
    }

    adProperties.startTime = getCurrentTime(); // Set the start time
    adInterval = setInterval(updateAd, 500); // Update the ad
    triggerEvent("AdStarted");  // Dispatch the AdStarted event
  };
  adEvents.stopAd = function () {
      adProperties.ready = false;
      clearTimeout(adInterval);
      if (adContainer.parentNode) {
          adContainer.parentNode.removeChild(adContainer);
      }
      setTimeout(function () {
          triggerEvent("AdStopped");
      }, 100);
  };
  adEvents.resizeAd = function (width, height, viewMode) {
      adProperties.width = width;
      adProperties.height = height;
      adProperties.viewMode = viewMode;
      updateAdContainer();
      triggerEvent("AdSizeChange");
  };
  adEvents.pauseAd = function () {
    adProperties.videoSlot.pause();
    adPaused = true;
    triggerEvent("AdPaused");
  };
  adEvents.resumeAd = function () {
    adProperties.videoSlot.play();
    adPaused = false;
    triggerEvent("AdPlaying");
  };
  adEvents.onAdImpression = function () {
    triggerEvent(VPAID_EVENTS.AdImpression);
  };
  adEvents.onAdVolumeChange = function () {
      console.log('On Ad Volume changed');
      triggerEvent(VPAID_EVENTS.AdVolumeChange); // Dispatch the volume change event
  };
  adEvents.onAdVideoStart = function () {
    triggerEvent(VPAID_EVENTS.AdVideoStart);
  };
  adEvents.expandAd = function () {
      adProperties.expanded = true;
      triggerEvent("AdExpanded");
  };
  adEvents.collapseAd = function () {
      adProperties.expanded = false;
  };
  adEvents.skipAd = function () {
      if (adProperties.skippableState) {
          triggerEvent("AdSkipped");
      }
  };
  adEvents.getAdLinear = function () {
      return true;
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
  adEvents.getAdSkippableState = function () {
      return adProperties.skippableState;
  };
  adEvents.getAdRemainingTime = function () {
      var remainingTime = adProperties.duration;
      if (adProperties.startTime) {
          remainingTime -= Math.floor(getCurrentTime() - adProperties.startTime);
      }
      return remainingTime;
  };
  adEvents.getAdDuration = function () {
    return adProperties.duration;
  };
  adEvents.onAdDurationChange = function () {
	  triggerEvent(VPAID_EVENTS.AdDurationChange);
  };
  adEvents.getAdVolume = function () {
    return adVolume;
  };
  adEvents.setAdVolume = function (value) {
    var isChanged = adVolume !== adProperties.adVolume;
    console.log('isChanged: ', isChanged);
    if (isChanged) {
      adProperties.adVolume = value;
      adProperties.videoSlot.volume = value;
      console.log('Ad volume set to: ', value);
      triggerEvent(VPAID_EVENTS.AdVolumeChange);
    }
  };
  adEvents.getAdCompanions = function () {
      return "";
  };
  adEvents.getAdIcons = function () {
      return "";
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
  function getCurrentTime() {
      return new Date().getTime() / 1000;
  }
  function updateAdContainer() {}

  function initializeAdContainer() {
    var container = document.createElement("div");
    container.style.position = "relative";
    container.style.height = "100%";
    if ((window.innerHeight || document.documentElement.clientHeight) >= 240) {
        container.style.display = "flex";
    }
    container.style.font = "normal 14px/1.15 sans-serif";
    container.style.boxSizing = "border-box";

    if (window.top !== window) {
        window.ldAdInit = window.ldAdInit || [];
        window.ldAdInit.push({ size: [0, 0], id: "ld-3701-3915" });
    }

    container.innerHTML = '<div id="on-c" style="box-sizing:border-box;width:100%;padding:0px;height:100%;position:absolute;opacity:0;z-index:999"><div id="ld-3701-3915" data-ld-vpaid="1" style="width:100%"></div></div>' + getSkipButtonHtml();

    var adSlot = container.childNodes[0].childNodes[0];
    var adImpressionInterval = setInterval(function () {
        if (adSlot.offsetHeight) {
            setTimeout(function () {
                triggerEvent("AdImpression");
            }, 1000);
            var adLinks = adSlot.querySelectorAll("a");
            for (var i = 0; i < adLinks.length; i++) {
                adLinks[i].onclick = function () {
                    triggerEvent("AdClickThru");
                };
            }
            clearInterval(adImpressionInterval);
        }
    }, 500);

    adElements.skip = container.querySelectorAll("#skip")[0];
    adElements.remaining = container.querySelectorAll("#remaining")[0];
    adElements.links = container.querySelectorAll("a");

    for (var i = 0; i < adElements.links.length; i++) {
        adElements.links[i].onclick = function () {
            triggerEvent("AdClickThru");
        };
    }

    adProperties.slot.appendChild(container);
    adContainer = container;

    var styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.appendChild(document.createTextNode(""));
    document.head.appendChild(styleElement);

    adProperties.ready = true;
    triggerEvent("AdLoaded");
    setupClickTracking();
  }
  function getSkipButtonHtml() {
    return (
      '<div id="skip" style="user-select: none;cursor:pointer;color:#ffffff;background-color:#000000a0;padding:8px 10px;border:1px solid #ffffff4d;white-space:nowrap;position:absolute;bottom:5%;right:15px;z-index:1000;border-radius:20px;">Skip in <span id="remaining">' +
      adProperties.skipDuration + '</span> ...</div>'
    );
  }
  function updateAd() {
    var elapsedTime = getCurrentTime() - adProperties.startTime;
    var remainingTime = Math.floor(adProperties.skipDuration - elapsedTime);

    if (remainingTime > 0) {
        adElements.remaining.innerHTML = remainingTime;
    } else if (adElements.remaining) {
        if (adElements.remaining.parentNode) {
            adElements.remaining.parentNode.removeChild(adElements.remaining);
        }
        adElements.remaining = null;
        adElements.skip.innerHTML = "Close Ad";
        adElements.skip.style.color = "#FFF";
        adElements.skip.style.backgroundColor = "#000000cc";
        adElements.skip.style.borderColor = "#FFF";
        adElements.skip.style.fontWeight = "bold";
        adElements.skip.onclick = function () {
            triggerEvent("AdUserClose");
            adEvents.stopAd();
        };
    } else if (elapsedTime > adProperties.duration) {
        adEvents.stopAd();
    }
  }
  return adEvents;
};