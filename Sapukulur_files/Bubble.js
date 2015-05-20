// ======
// BUBBLE
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
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.bubbles2;

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
Bubble.prototype.renderCount = 0;
Bubble.prototype.stillFrames = 0;

Bubble.prototype.update = function (du) {

    spatialManager.unregister(this);

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }

    // for animation
    if(10 === this.stillFrames++) {
        this.stillFrames = 0;
        ++this.renderCount; 
    }   
    if (this.renderCount === 17) this.renderCount = 0;

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    if (this.cy < -this.getRadius()){
        return entityManager.KILL_ME_NOW;
    }
    if(this.cx - this.getRadius() < 0 || this.cx + this.getRadius() > g_canvas.width){
        this.velX *= -1;
    }
    if(this.cy > g_canvas.height){
        this.velY *= -1;
    }


    if( (this.velX !== 0 || this.velY !== 0) ){//&& eatKey('J'.charCodeAt(0)) ){
        entityManager.generateParticle({
            cx     : this.cx,
            cy     : this.cy,
            velX   : -this.velX/2 + util.randRange(-3,3),
            velY   : -this.velY/2 + util.randRange(-3,3),
            color  : this.color
        });
    }
    
    // Handle collisions
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
    //this.zappedSound.play();
};

Bubble.prototype.render = function (ctx) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = COLORS[this.color];

    //util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
    this.sprite[this.color-1][this.renderCount].drawCentredAt(ctx, this.cx, this.cy);
    
    //g_sprites.smoke[0][this.renderCount].drawCentredAt(ctx, this.cx, this.cy);

    ctx.fillStyle = oldStyle;
};
