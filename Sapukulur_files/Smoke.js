// ======
// Smoke
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Smoke(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // make some sound ?????????????????????????????????????????????????????????
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/


}

Smoke.prototype = new Entity();
    
// Initial, inheritable, default values
Smoke.prototype.rotation = 0;
Smoke.prototype.cx = 200;
Smoke.prototype.cy = 200;
Smoke.prototype.isSmoke = true;
Smoke.prototype.renderCount = 0;
Smoke.prototype.stillFrames = 0;

Smoke.prototype.update = function (du) {

    spatialManager.unregister(this);

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }

    // for animation
    if(5 === this.stillFrames++) {
        this.stillFrames = 0;
        ++this.renderCount; 
    }   
    if (this.renderCount === 8) this._isDeadNow = true;

    spatialManager.register(this);


};

Smoke.prototype.getRadius = function () {
    return 0;
};

Smoke.prototype.render = function (ctx) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = COLORS[this.color];

    //util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
    
    g_sprites.smoke[0][this.renderCount].drawCentredAt(ctx, this.cx, this.cy);

    ctx.fillStyle = oldStyle;
};
