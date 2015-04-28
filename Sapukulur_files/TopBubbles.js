// ==========
// SHIP STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function TopBubbles(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

};

TopBubbles.prototype = new Entity();
    
TopBubbles.prototype.update = function (du) {

    spatialManager.unregister(this);

    spatialManager.register(this);
};

TopBubbles.prototype.getRadius = function () {
    return (32/2) * 0.9;
};

TopBubbles.prototype.render = function (ctx) {
    
};
