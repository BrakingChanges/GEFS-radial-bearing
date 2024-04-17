/* jshint browser:true, jquery:true, varstmt: false */
/* global geofs */

"use strict";

window.addEventListener('deferredload', () => {
    // Loads FMC
    $('<script src="build/out.js"></script>').appendTo('head');
});