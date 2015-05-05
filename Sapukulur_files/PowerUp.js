// =======
// POWERUP
// =======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function PowerUp(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    //this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/


}

PowerUp.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
PowerUp.prototype.fireSound = new Audio(
    "sounds/bulletFire.ogg");
PowerUp.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");
    
// Initial, inheritable, default values
PowerUp.prototype.rotation = 0;
PowerUp.prototype.cx = 200;
PowerUp.prototype.cy = 200;
PowerUp.prototype.velX = 0;
PowerUp.prototype.velY = 3;
PowerUp.prototype.color = 0;

PowerUp.prototype.b = 0;
PowerUp.prototype.renderCount = 0;

// Convert times from milliseconds to "nominal" time units.
//PowerUp.prototype.lifeSpan = 4000 / NOMINAL_UPDATE_INTERVAL;

PowerUp.prototype.update = function (du) {

    spatialManager.unregister(this);

    // for animation
    if(10 === this.b++) {
        this.b = 0;
        ++this.renderCount; 
    }   
    if (this.renderCount === 8) this.renderCount = 0;

  /*  if(this.isColliding()) this._isDeadNow = true;

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }*/

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    if (this.cy > this.getRadius() + g_canvas.height){
        return entityManager.KILL_ME_NOW;
    }
    
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takePowerUpHit;
        if (canTakeHit){
            hitEntity.takePowerUpHit(this.color);
            return entityManager.KILL_ME_NOW;
        }
    }

    spatialManager.register(this);


};

PowerUp.prototype.getRadius = function () {
    return 5;
};

PowerUp.prototype.render = function (ctx) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = COLORS[this.color];

    //var fadeThresh = PowerUp.prototype.lifeSpan / 3;

/*    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    g_sprites.bullet.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );*/
   
   // util.fillCircle(ctx, this.cx, this.cy, this.getRadius());

   g_sprites.powerUp[this.color][this.renderCount].drawCentredAt(ctx, this.cx, this.cy);
   //g_sprites.bubble.drawCentredAt(ctx, this.cx, this.cy);

    ctx.fillStyle = oldStyle;
};
