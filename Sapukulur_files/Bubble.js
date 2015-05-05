// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bubble(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    //this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

    this.color = util.discreetRandRange(1, COLORS.length);

}

Bubble.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Bubble.prototype.fireSound = new Audio(
    "sounds/bulletFire.ogg");
Bubble.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");
    
// Initial, inheritable, default values
Bubble.prototype.rotation = 0;
Bubble.prototype.cx = 200;
Bubble.prototype.cy = 200;
Bubble.prototype.velX = 0;
Bubble.prototype.velY = 0;
Bubble.prototype.isBubble = true;
Bubble.prototype.launchVel = 5;

// Convert times from milliseconds to "nominal" time units.
//Bubble.prototype.lifeSpan = 4000 / NOMINAL_UPDATE_INTERVAL;

Bubble.prototype.update = function (du) {

    spatialManager.unregister(this);

    //if(this.isColliding()) this._isDeadNow = true;

    if(this._isDeadNow){
        console.log("isDead");
        return entityManager.KILL_ME_NOW;
    }


    //this.lifeSpan -= du;
    //if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    //this.rotation += 1 * du;
    //this.rotation = util.wrapRange(this.rotation,
    //                               0, consts.FULL_CIRCLE);

    //this.wrapPosition();
    //console.log(this.cy);
    if (this.cy < -this.getRadius()){
        //console.log("offscreen");
        return entityManager.KILL_ME_NOW;
    }
    if(this.cx < 0 || this.cx > g_canvas.width){
        this.velX *= -1;
    }
    if(this.cy > g_canvas.height){
        this.velY *= -1;
    }
    
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBubbleHit;
        if (canTakeHit){
            canTakeHit.call(hitEntity); 
            return entityManager.KILL_ME_NOW;
        }
    }

    spatialManager.register(this);


};

Bubble.prototype.getRadius = function () {
    return BUBBLE_RADIUS;
};

Bubble.prototype.takeBubbleHit = function () {
    this.kill();
    
    // Make a noise when I am zapped by another bullet
    //this.zappedSound.play();
};

Bubble.prototype.render = function (ctx) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = COLORS[this.color];

    util.fillCircle(ctx, this.cx, this.cy, this.getRadius());

    ctx.globalAlpha = 1;
    ctx.fillStyle = oldStyle;
};
