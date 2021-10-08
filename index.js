import { ready } from "./functions";

(function (window) {
  "use strict";
  // Expose `ready`
  window.ready = ready;

  // if (!localStorage.getItem('segmentCheckoutStarted')) {
  // 	  localStorage.setItem('segmentCheckoutStarted', 0);
  // }

  // if (!localStorage.getItem('segmentCheckoutStepCompleted')) {
  //    localStorage.setItem('segmentCheckoutStepCompleted', 0);
  // }
})(this);



