// ========
// PARTICLE
// ========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Particle(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    //this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/
    this.velX   = this.velX   || util.randRange(-3,3);
    this.velY   = this.velY   || util.randRange(-3,3);
    this.radius = this.radius || util.randRange(1,4);

    this.color  = this.color  || COLORS[ util.discreetRandRange(1, COLORS.length) ];

}

Particle.prototype = new Entity();
    
// Initial, inheritable, default values
Particle.prototype.rotation = 0;
Particle.prototype.radius = 0;
Particle.prototype.cx = 200;
Particle.prototype.cy = 200;
Particle.prototype.velX = 0;
Particle.prototype.velY = 0;
Particle.prototype.lifeSpan = 1000 / NOMINAL_UPDATE_INTERVAL;

Particle.prototype.isParticle = true;
Particle.prototype.color = 0;

Particle.prototype.update = function (du) {

    spatialManager.unregister(this);

    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;
  

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    // hmm??                                                                    ----------------------------
    if(this.cx - this.radius < 0 || this.cx + this.radius > g_canvas.width){
        this.velX *= -1;
    }
    if(this.cy - this.radius < 0 || this.cy + this.radius > g_canvas.height){
        this.velY *= -1;
    }

    spatialManager.register(this);
};

Particle.prototype.getRadius = function () {
    return this.radius;
};

Particle.prototype.render = function (ctx) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = this.color;//COLORS[this.color];

    var fadeThresh = Particle.prototype.lifeSpan;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    util.fillCircle(ctx, this.cx, this.cy, this.radius);

    ctx.fillStyle = oldStyle;
    ctx.globalAlpha = 1;
};
