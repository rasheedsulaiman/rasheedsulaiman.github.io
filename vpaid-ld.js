var getVPAIDAd = function () {
  function r() {
      var t = setInterval(function () {
              var e = document.activeElement;
              e &&
              "IFRAME" === e.tagName &&
              (clearInterval(t),
              "on-c" ===
              (function (e) {
                  return "on-c" !== e.id ? e.closest("#on-c") : e;
              })(e.parentNode).id && n());
          }, 100),
          e = !1;
      try {
          document.querySelector("iframe").addEventListener("load", function () {
              this.blur();
          });
      } catch (e) {}
      function n() {
          e || (clearInterval(t), (e = !0), l("AdClickThru"));
      }
      document.querySelector("#on-c").addEventListener("click", function () {
          n();
      });
  }
  var a,
      e,
      c,
      s,
      n = {},
      i = {},
      t = 1,
      u = {},
      l =
          ((n.handshakeVersion = function (e) {
              return "2.0";
          }),
              (n.initAd = function (e, t, n, i, o, d) {
                  (a = { slot: d.slot, videoSlot: d.videoSlot, width: e, height: t, viewMode: n, expanded: !1, skippableState: !1, duration: 15, skipDuration: 7, startTime: 0, ready: !1 }), p();
              }),
              (n.startAd = function () {
                  if (!a.ready) return setTimeout(n.startAd, 250);
                  (a.startTime = o()), (e = setInterval(m, 500)), l("AdStarted");
              }),
              (n.stopAd = function () {
                  (a.ready = !1),
                      clearTimeout(e),
                  c.parentNode && c.parentNode.removeChild(c),
                      setTimeout(function () {
                          l("AdStopped");
                      }, 100);
              }),
              (n.resizeAd = function (e, t, n) {
                  (a.width = e), (a.height = t), (a.viewMode = n), d(), l("AdSizeChange");
              }),
              (n.pauseAd = function () {
                  l("AdPaused");
              }),
              (n.resumeAd = function () {
                  l("AdPlaying");
              }),
              (n.expandAd = function () {
                  (a.expanded = !0), l("AdExpanded");
              }),
              (n.collapseAd = function () {
                  a.expanded = !1;
              }),
              (n.skipAd = function () {
                  a.skippableState && l("AdSkipped");
              }),
              (n.getAdLinear = function () {
                  return !0;
              }),
              (n.getAdWidth = function () {
                  return a.width;
              }),
              (n.getAdHeight = function () {
                  return a.height;
              }),
              (n.getAdExpanded = function () {
                  return a.expanded;
              }),
              (n.getAdSkippableState = function () {
                  return a.skippableState;
              }),
              (n.getAdRemainingTime = function () {
                  var e = a.duration;
                  return a.startTime && (e -= Math.floor(o() - a.startTime)), e;
              }),
              (n.getAdDuration = function () {
                  return a.duration;
              }),
              (n.getAdVolume = function () {
                  return t;
              }),
              (n.setAdVolume = function (e) {
                  t = e;
              }),
              (n.getAdCompanions = function () {
                  return "";
              }),
              (n.getAdIcons = function () {
                  return "";
              }),
              (n.subscribe = function (e, t, n) {
                  e = e.bind(n);
                  t in i || (i[t] = []), i[t].push(e);
              }),
              (n.unsubscribe = function (e) {
                  i[e] = [];
              }),
              function (e) {
                  if (e in i) for (var t = 0; t < i[e].length; t++) i[e][t]();
              }),
      o = function () {
          return new Date().getTime() / 1e3;
      },
      d = function () {},
      p = function (e) {
          var n,
              i,
              t = document.createElement("div");
          (t.style.position = "relative"),
              (t.style.height = "100%"),
          240 <= (window.innerHeight || document.documentElement.clientHeight) && (t.style.display = "flex"),
              (t.style.alignItems = "center"),
              (t.style.justifyContent = "center"),
              (t.style.background = "#000"),
              (t.style.font = "normal 14px/1.15 sans-serif"),
              (t.style.paddingBottom = "50px"),
              (t.style.boxSizing = "border-box"),
          (d = window).top !== d && ((d.ldAdInit = d.ldAdInit || []), d.ldAdInit.push({ slot: 14934589701322086, size: [0, 0], id: "ld-4295-8357" })),
              (t.innerHTML = '<div id="on-c" style="box-sizing:border-box;width:100%;padding:2px"><div id="ld-4295-8357" style="width:100%"></div></div>' + f()),
              (n = t.childNodes[0].childNodes[0]),
              (i = setInterval(function () {
                  if (n.offsetHeight) {
                      setTimeout(function () {
                          l("AdImpression");
                      }, 1e3);
                      for (var e = n.querySelectorAll("a"), t = 0; t < e.length; t++)
                          e[t].onclick = function () {
                              l("AdClickThru");
                          };
                      clearInterval(i);
                  }
              }, 500)),
              (u.skip = t.querySelectorAll("#skip")[0]),
              (u.remaining = t.querySelectorAll("#remaining")[0]),
              (u.a = t.querySelectorAll("a"));
          for (var o = 0; o < u.a.length; o++)
              u.a[o].onclick = function () {
                  l("AdClickThru");
              };
          a.slot.appendChild(t), (c = t), ((s = document.createElement("script")).id = "ld-ajs"), (s.src = "//cdn2.customads.co/_js/ajs.js"), (s.async = !0), document.head.appendChild(s);
          var d = document.createElement("style");
          (d.type = "text/css"), d.appendChild(document.createTextNode("")), document.head.appendChild(d), (a.ready = !0), l("AdLoaded"), r();
      },
      f = function () {
          return (
              '<div id="skip" style="user-select: none;cursor:pointer;color:#999;padding:8px 20px;border:1px solid #aaa;white-space:nowrap;position:absolute;bottom:10px;right:0px">You can skip this ad in <span id="remaining">' +
              a.skipDuration +
              "</span> ...</div>"
          );
      },
      m = function () {
          var e = o() - a.startTime,
              t = Math.floor(a.skipDuration - e);
          0 < t
              ? (u.remaining.innerHTML = t)
              : u.remaining
                  ? (u.remaining.parentNode && u.remaining.parentNode.removeChild(u.remaining),
                      (u.remaining = null),
                      (u.skip.innerHTML = "Close Ad"),
                      (u.skip.style.color = "#FFF"),
                      (u.skip.style.borderColor = "#FFF"),
                      (u.skip.style.fontWeight = "bold"),
                      (u.skip.onclick = function () {
                          l("AdUserClose"), n.stopAd();
                      }))
                  : e > a.duration && n.stopAd();
      };
  return n;
};