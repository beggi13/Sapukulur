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
function Player(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;
    
};

Player.prototype = new Entity();

Player.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

//Player.prototype.KEY_THRUST = 'W'.charCodeAt(0);
//Player.prototype.KEY_RETRO  = 'S'.charCodeAt(0);
Player.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Player.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Player.prototype.KEY_FIRE   = ' '.charCodeAt(0);

// Initial, inheritable, default values
Player.prototype.rotation = 0;
Player.prototype.cx = g_canvas.width/2;
Player.prototype.cy = g_canvas.height;
Player.prototype.velX = 0;
Player.prototype.velY = 0;
Player.prototype.launchVel = 5;
Player.prototype.numSubSteps = 1;
    
Player.prototype.update = function (du) {

    spatialManager.unregister(this);

    // Handle firing
    this.maybeFireBubble();

    this.updateMovement(du);

    //this.isColliding() ? this.warp() : spatialManager.register(this);

    spatialManager.register(this);

};

Player.prototype.maybeFireBubble = function () {

    if (keys[this.KEY_FIRE]) {
    
        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.5;
        
        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBubble(
           this.cx + dX * launchDist, this.cy + dY * launchDist,
           this.velX + relVelX, this.velY + relVelY,
           this.rotation);
           
    }
    
};

Player.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Player.prototype.takeBulletHit = function () {
    
};

Player.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
};

var NOMINAL_ROTATE_RATE = 0.1;

Player.prototype.updateMovement = function (du) {
    if (keys[this.KEY_LEFT] && this.cx > 25) {
        this.cx -= 5 * du;
    }
    if (keys[this.KEY_RIGHT] && this.cx < g_canvas.width-25) {
        this.cx += 5 * du;
    }
    if(this.bubble){
        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.5;
        this.bubble.cx = this.cx + dX * launchDist;
        this.bubble.cy = this.cy + dY * launchDist;
    }
};

Player.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
	   ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};
