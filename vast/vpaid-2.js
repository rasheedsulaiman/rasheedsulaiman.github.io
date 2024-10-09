var getVPAIDAd = function () {
  var adPaused = false;
  var pausedTime = 0;
  var pauseStartTime = 0;
  function initializeAd() {
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
  function getDynamicVideoElement() {
    return document.getElementById('dynamic-video');
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
  };
  adEvents.startAd = function () {
    if (!adProperties.ready) {
        return setTimeout(adEvents.startAd, 250);
    }

    // Function to dynamically create and insert a video element above a div with id "on-c"
    function createAndRenderVideo() {

      // Define the video HTML with inline styles
      var videoElement = str_to_element('<video width="auto" height="100%" playsinline id="dynamic-video" style="position: relative;margin:0 auto;" src="https://cdn1.decide.co/uploads/0fedb9c486ee0e4aac922c26b04cc0ba141532213cd8efd114344460d72a5620_video_large"></video>');

      // Add an event listener to get the video duration when metadata is loaded
      videoElement.addEventListener('loadedmetadata', function () {
        var videoDuration = videoElement.duration;

        // Set the duration in adProperties
        if (typeof adProperties !== 'undefined') {
            adProperties.duration = videoDuration;
            adEvents.onAdDurationChange();
        }
      });

      // Ensure the video can load properly
      videoElement.addEventListener('loadeddata', function() {
        videoElement.play().catch(function(error) {});
      });

      // Handle any playback errors
      videoElement.addEventListener('error', function(e) {
        console.log('Error playing video: ' + e);
      });

      // Find the div with id "on-c"
      var referenceDiv = document.getElementById('on-c');  // Use the correct div ID

      // Check if the reference div exists in the DOM
      if (referenceDiv) {
        // Insert the video element after the reference div
        referenceDiv.parentNode.insertBefore(videoElement, referenceDiv.nextSibling);
      } else {
        console.log('Reference div not found');
      }
    }
    createAndRenderVideo();

    function str_to_element (str_elem) {
      var elem = document.createElement('div');
      elem.innerHTML = str_elem;
      return elem.firstChild;
    }

    adProperties.startTime = getCurrentTime();
    adInterval = setInterval(updateAd, 500);
    triggerEvent("AdStarted");
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
    var dynamicVideo = getDynamicVideoElement();
    if (dynamicVideo) {
        dynamicVideo.pause();
    }
    pauseStartTime = getCurrentTime();
    adPaused = true;
    triggerEvent("AdPaused");
  };
  adEvents.resumeAd = function () {
    var dynamicVideo = getDynamicVideoElement();
    if (dynamicVideo) {
        dynamicVideo.play().catch(function(error) {});
    }
    if (adPaused) {
        pausedTime += getCurrentTime() - pauseStartTime;
    } 
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
    console.log('Getting volume: ' + adVolume);
  };
  adEvents.setAdVolume = function (volume) {
    console.log('Setting volume to: ' + volume);
    var oldVolume = adVolume;
    adVolume = volume; // Set the new volume level

    if (adVolume !== oldVolume) {
      if (adProperties.videoSlot) {
          adProperties.videoSlot.volume = adVolume;
          console.log('Ad properties volume: ' + adProperties.videoSlot.volume);
      }

      var dynamicVideo = document.getElementById('dynamic-video');
      if (dynamicVideo) {
          dynamicVideo.volume = adVolume;
          console.log('Volume: ' + dynamicVideo.volume);
      }
      console.log('adVolume changed');
      triggerEvent(VPAID_EVENTS.AdVolumeChange); // Trigger the AdVolumeChange event
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
    container.style.background = "#000";
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
    initializeAd();
  }
  function getSkipButtonHtml() {
    return (
      '<div id="skip" style="user-select: none;cursor:pointer;color:#ffffff;background-color:#000000a0;padding:8px 10px;border:1px solid #ffffff4d;white-space:nowrap;position:absolute;bottom:5%;right:15px;z-index:1000;border-radius:20px;">Skip in <span id="remaining">' +
      adProperties.skipDuration
    );
  }
  function updateAd() {
    if (adPaused) {
        return;
    }
    var elapsedTime = getCurrentTime() - adProperties.startTime - pausedTime;
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