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

    //this.color = util.discreetRandRange(1, COLORS.length);

}

Particle.prototype = new Entity();
    
// Initial, inheritable, default values
Particle.prototype.rotation = 0;
Particle.prototype.radius = 3;
Particle.prototype.cx = 200;
Particle.prototype.cy = 200;
Particle.prototype.velX = 0;
Particle.prototype.velY = 0;
Particle.prototype.lifeSpan = 500 / NOMINAL_UPDATE_INTERVAL;

Particle.prototype.isParticle = true;
Particle.prototype.color = 0;

Particle.prototype.update = function (du) {

    spatialManager.unregister(this);

    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;
  

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    // hmm??                                                                    ----------------------------
 /*   if(this.cx - this.getRadius() < 0 || this.cx + this.getRadius() > g_canvas.width){
        this.velX *= -1;
    }
    if(this.cy > g_canvas.height){
        this.velY *= -1;
    }*/

    spatialManager.register(this);
};

Particle.prototype.getRadius = function () {
    return this.radius;
};

Particle.prototype.render = function (ctx) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = COLORS[this.color];

    var fadeThresh = Particle.prototype.lifeSpan;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
    //g_sprites.Particles2[this.color-1][this.renderCount].drawCentredAt(ctx, this.cx, this.cy);
    
    //g_sprites.smoke[0][this.renderCount].drawCentredAt(ctx, this.cx, this.cy);

    ctx.fillStyle = oldStyle;
    ctx.globalAlpha = 1;
};
