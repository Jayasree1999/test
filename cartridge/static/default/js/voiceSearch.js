!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=7)}({7:function(e,t,n){"use strict";try{var r=new(window.SpeechRecognition||window.webkitSpeechRecognition)}catch(e){console.error(e),$(".no-browser-support").show(),$(".app").hide()}var o,i=$("#note-textarea"),c=$("#recording-instructions"),u="";r.continuous=!1,r.onresult=function(e){var t=e.resultIndex,n=e.results[t][0].transcript;1==t&&n==e.results[0][0].transcript||(u+=n,i.val(u),window.location.href=o+"?q="+u)},r.onstart=function(){c.text("Voice recognition activated. Try speaking into the microphone.")},r.onspeechend=function(){c.text("You were quite for a while so voice recognition turned itself off.")},r.onerror=function(e){"no-speech"==e.error&&c.text("No speech was detected. Try again.")},$("#start-record-btn").on("click",(function(e){e.preventDefault(),o=$(this).data("url"),r.start()}))}});