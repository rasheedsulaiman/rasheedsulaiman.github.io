var LinearAd = function() {
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
      duration : 10,
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
LinearAd.prototype.doContentComplete = function() {
  console.log('VP > contentEndedListener executed');
};
LinearAd.prototype.onAdLoaded = function() {
  if (this.VPAID_EVENTS.AdLoaded in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdLoaded]();
  }
};
LinearAd.prototype.onAdStarted = function() {
  if (this.VPAID_EVENTS.AdStarted in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdStarted]();
  }
};
LinearAd.prototype.onAdVideoStart = function() {
  if (this.VPAID_EVENTS.AdVideoStart in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdVideoStart]();
  }
};
LinearAd.prototype.onAdImpression = function() {
  if (this.VPAID_EVENTS.AdImpression in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdImpression]();
  }
};
LinearAd.prototype.onAdClickThru = function(url, id, playerHandles) {
  if (this.VPAID_EVENTS.AdClickThru in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdClickThru](url, id, playerHandles);
  }
};
LinearAd.prototype.onAdVideoFirstQuartile = function() {
  if (this.VPAID_EVENTS.AdVideoFirstQuartile in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdVideoFirstQuartile]();
  }
};
LinearAd.prototype.onAdVideoMidpoint = function() {
  if (this.VPAID_EVENTS.AdVideoMidpoint in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdVideoMidpoint]();
  }
};
LinearAd.prototype.onAdVideoThirdQuartile = function() {
  if (this.VPAID_EVENTS.AdVideoThirdQuartile in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdVideoThirdQuartile]();
  }
};
LinearAd.prototype.onAdVideoComplete = function() {
  console.log('VP > onAdVideoComplete');
  if (this.VPAID_EVENTS.AdVideoComplete in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdVideoComplete]();
  }
};
LinearAd.prototype.onAdPaused = function() {
  if (this.VPAID_EVENTS.AdPaused in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdPaused]();
  }
};
LinearAd.prototype.onAdPlaying = function() {
  if (this.VPAID_EVENTS.AdPlaying in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdPlaying]();
  }
};
LinearAd.prototype.onAdVolumeChange = function() {
  if (this.VPAID_EVENTS.AdVolumeChange in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdVolumeChange]();
  }
};
LinearAd.prototype.onAdStopped = function() {
  if (this.VPAID_EVENTS.AdStopped in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdStopped]();
  }
};
LinearAd.prototype.onAdSkipped = function() {
  if (this.VPAID_EVENTS.AdSkipped in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdSkipped]();
  }
};
LinearAd.prototype.onAdDurationChange = function() {
  if (this.VPAID_EVENTS.AdDurationChange in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdDurationChange]();
  }
};
LinearAd.prototype.onAdInteraction = function() {
  if (this.VPAID_EVENTS.AdInteraction in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdInteraction]();
  }
};
LinearAd.prototype.onAdLinearChange = function() {
  if (this.VPAID_EVENTS.AdLinearChange in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdLinearChange]();
  }
};
LinearAd.prototype.onAdSkippableStateChange = function() {
  if (this.VPAID_EVENTS.AdSkippableStateChange in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdSkippableStateChange]();
  }
};
LinearAd.prototype.onAdRemainingTimeChange = function() {
  if (this.VPAID_EVENTS.AdRemainingTimeChange in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdRemainingTimeChange]();
  }
}
LinearAd.prototype.onAdUserClose = function() {
  if (this.VPAID_EVENTS.AdUserClose in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdUserClose]();
  }
};
LinearAd.prototype.onAdLog = function(message) {
  if (this.VPAID_EVENTS.AdLog in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdLog](message);
  }
};
LinearAd.prototype.onAdSizeChange = function() {
  if (this.VPAID_EVENTS.AdSizeChange in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdSizeChange]();
  }
};
LinearAd.prototype.onAdExpandedChange = function() {
  if (this.VPAID_EVENTS.AdExpandedChange in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdExpandedChange]();
  }
};
LinearAd.prototype.onAdError = function(message) {
  if (this.VPAID_EVENTS.AdError in this._eventCallbacks) {
      this._eventCallbacks[this.VPAID_EVENTS.AdError](message);
  }
};
LinearAd.prototype.handshakeVersion = function(version) {
  return ('2.0');
};
LinearAd.prototype.timeUpdateHandler = function() {
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
LinearAd.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {

  console.log('initAd', width, height, viewMode, desiredBitrate, creativeData, environmentVars);

  // slot and videoSlot are passed as part of the environmentVars
  this._slot = environmentVars.slot;

  // Create an iframe element to embed the video
  var iframe = document.createElement('iframe');
  iframe.width = width;
  iframe.height = height;
  iframe.setAttribute('frameBorder', '0');
  iframe.setAttribute('allowfullscreen', 'true');
  iframe.setAttribute('loading', 'eager');

  // Insert the iframe into the slot
  this._slot.innerHTML = ''; // Clear previous content
  this._slot.appendChild(iframe);

  // Write the video player code inside the iframe
  var iframeDoc = iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(`
    <html>
      <body style="margin:0;padding:0;overflow:hidden;">
        <div id="el-0-17570198596943884">
          <div class="embed-cntnr">
            <div class="content-item">
              <div class="fi-cntnr">
                <div class="editorial fi grd-i-cntnr">
                  <div class="item-top">
                    <div class="top">
                      <div class="content-layout">
                        <div class="header-image" style="">
                          <a href="/brand" class="image-promoted-label _allow_click" style="display: none;">Ad</a>
                          <div class="image-container">
                              <div class="video-cntnr">
                              <video id="videoSlot" width="100%" autoplay playsinline height="100%" class="full-width" id="2039580" src="https://cdn1.decide.dev/uploads/0fedb9c486ee0e4aac922c26b04cc0ba141532213cd8efd114344460d72a5620_video_large" style="height: 321.1875px;" poster="https://cdn1.decide.dev/uploads/0fedb9c486ee0e4aac922c26b04cc0ba141532213cd8efd114344460d72a5620_large"></video>
                                <div class="video-controls">
                                  <svg class="icon-pause _pause _allow_click" fill="#FFFFFF" width="20px" height="20px" viewBox="-64 0 512 512" xmlns="http://www.w3.org/2000/svg"><title>pause</title><path class="_allow_click" d="M64 96L160 96 160 416 64 416 64 96ZM224 96L320 96 320 416 224 416 224 96Z"></path></svg>
                                  <svg class="icon-play _play _allow_click hidey" fill="#FFFFFF" width="20px" height="20px" viewBox="-60 0 512 512" xmlns="http://www.w3.org/2000/svg"><title>play</title><path class="_allow_click" d="M64 96L328 256 64 416 64 96Z"></path></svg>
                                  <svg class="_mute _allow_click" fill="#FFFFFF" width="20px" height="20px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><title>vol-mute</title><path class="_allow_click" d="M420 452L376 408Q354 423 329 434 303 445 280 448L280 400Q311 395 341 373L240 272 240 448 128 336 64 336 64 176 144 176 60 92 92 60 452 420 420 452ZM240 64L240 144 201 102 240 64ZM400 256Q400 203 365 162 330 120 280 112L280 64Q326 69 365 97 403 124 426 167 448 209 448 256 448 275 443 300 437 325 429 341L392 304Q400 278 400 256ZM284 164Q314 173 333 198 352 223 352 256L352 260 284 192 284 164Z"></path></svg>
                                  <svg class="hidey _unmute _allow_click" fill="#FFFFFF" width="20px" height="20px" viewBox="0 -2 516 516" xmlns="http://www.w3.org/2000/svg"><title>vol-high</title><path class="_allow_click" d="M64 176L128 176 240 64 240 448 128 336 64 336 64 176ZM280 400Q330 393 365 351 400 309 400 256 400 203 365 161 330 119 280 112L280 64Q326 69 365 97 403 124 426 167 448 209 448 256 448 303 426 346 403 388 365 416 326 443 280 448L280 400ZM284 164Q314 173 333 198 352 223 352 256 352 286 333 313 314 339 284 349L284 164Z"></path></svg>
                                </div>
                              </div>
                          </div>
                        </div>
                        <div class="body-cntnr">
                          <div class="section title-section">
                            <div class="headline-text h3 p-hover-color">Earth video</div>
                          </div>
                          <a href="/brand" class="secondary-link light-link iab-promoted-label _allow_click" style="display: none;">Sponsored Ad</a>
                            <div class="section content-action-buttons">
                              <div data-button-id="0" class="_track-event button-unit unit">
                                <div class="std-action-bttn medium-bttn std-bttn pur-bttn full-width p-background p-border p-hover">Learn More</div>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="embed-hdr single-content">
            <a href="/brand" class="secondary-link light-link promoted-label _allow_click">Sponsored Ad</a>
          </div>
        </div> 
      </body>
    </html>
  `);
  iframeDoc.close();

  // Get the video element from the iframe
  this._videoSlot = iframe.contentWindow.document.getElementById('videoSlot');

  // Set up event listeners for the video slot
  this._videoSlot.addEventListener('timeupdate', this.timeUpdateHandler.bind(this), false);
  this._videoSlot.addEventListener('loadedmetadata', function(event) {
      this._attributes.duration = event.target.duration;
      this._attributes.remainingTime = event.target.duration;
      this.onAdDurationChange();
  }.bind(this), false);

  this._videoSlot.addEventListener('ended', this.stopAd.bind(this), false);

  // Dispatch AdLoaded event
  this.onAdLoaded();
};

LinearAd.prototype.startAd = function() {
  console.log('VP > startAd');

  this._videoSlot.play();
  //this._videoSlot.load();
  this.onAdStarted();
};
LinearAd.prototype.getAdVolume = function() {
  return this._attributes.volume;
};
LinearAd.prototype.setAdVolume = function(value) {
  var isChanged = value !== this._attributes.volume;
  if(isChanged) {
      this._attributes.volume = value;
      this._videoSlot.volume = value;
      this.onAdVolumeChange();
  }
};
LinearAd.prototype.resumeAd = function() {
  this._videoSlot.play();
  this._isPaused = !1;
  this.onAdPlaying();
};
LinearAd.prototype.pauseAd = function() {
  this._videoSlot.pause();
  this._isPaused = !0;
  this.onAdPaused();
};
LinearAd.prototype.resizeAd = function(width, height, viewMode) {
  console.log('VP > resizeAd', width, height, viewMode);
  this._attributes.width = width;
  this._attributes.height = height;
  this._attributes.viewMode = viewMode;
  this.onAdSizeChange();
};
LinearAd.prototype.stopAd = function() {
  console.log('VP > stopAd');
  this.log('Stopping ad');
  var that = this;
  // Calling AdStopped immediately terminates the ad. Setting a timeout allows events to go through.
  setTimeout(function () {
      that.onAdStopped();
  }, 75);
};
LinearAd.prototype.getAdExpanded = function() {
  return this._attributes.expanded;
};
LinearAd.prototype.collapseAd = function() {
  this._attributes.expanded = false;
  this.onAdExpandedChange();
};
LinearAd.prototype.expandAd = function() {
  this._attributes.expanded = true;
  this.onAdExpandedChange();
};
LinearAd.prototype.getAdSkippableState = function() {
  return this._attributes.skippableState;
};
LinearAd.prototype.skipAd = function() {
  this.onAdSkipped();
};
LinearAd.prototype.subscribe = function(callback, eventName, context) {
  this.log('Subscribe ' + eventName);
  var givenCallback = callback.bind(context);
  this._eventCallbacks[eventName] = givenCallback;
};
LinearAd.prototype.unsubscribe = function(eventName) {
  this.log('unsubscribe ' + eventName);
  this._eventCallbacks[eventName] = null;
};
LinearAd.prototype.getAdWidth = function() {
  return this._attributes.width;
};
LinearAd.prototype.getAdHeight = function() {
  return this._attributes.height;
};
LinearAd.prototype.getAdRemainingTime = function() {
  return this._videoSlot.duration - this._videoSlot.currentTime; //this._attributes.remainingTime;
};
LinearAd.prototype.getAdDuration = function() {
  //console.log('VP > getAdDuration', this._attributes.duration);
  return this._attributes.duration;
};
LinearAd.prototype.getAdCompanions = function() {
  return [];
};
LinearAd.prototype.getAdIcons = function() {
  return this._attributes.icons;
};
LinearAd.prototype.getAdLinear = function() {
  return this._attributes.linear;
};
LinearAd.prototype.log = function(message) {
  console.log(message);
};

function getVPAIDAd() {
  //console.log('VP > getVPAIDAd');
  return new LinearAd;
}
window.getVPAIDAd = getVPAIDAd