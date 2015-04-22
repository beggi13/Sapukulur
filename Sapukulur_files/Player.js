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
    this.sprite = this.sprite || g_sprites.cat;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this.initialPos = this.positions;
};

Player.prototype = new Entity();

Player.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.initialPos = this.positions;
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
Player.prototype.b = 0;
Player.prototype.renderCount = 0;
Player.prototype.positions = [1,2,3]; 
Player.prototype.flag = "";
    
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
        this.flag = "back";
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
    return (32/2) * 0.9;
};

Player.prototype.takeBulletHit = function () {
    
};

Player.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.positions = this.initialPos;
};

var NOMINAL_ROTATE_RATE = 0.1;

Player.prototype.updateMovement = function (du) {
    if (keys[this.KEY_LEFT] && this.cx > 25) {
        this.cx -= 5 * du;
        this.flag = "left";

    }
    if (keys[this.KEY_RIGHT] && this.cx < g_canvas.width-25) {
        this.cx += 5 * du;
        this.flag = "right";
    }
};

Player.prototype.render = function (ctx) {
    //var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    //this.sprite.scale = this._scale;
     if (this.flag == "left") this.positions = [12, 13, 14];
    // going right
    else if (this.flag == "right") this.positions = [24, 25, 26];
    else if(this.flag == "back") this.position = [36,37,38]
    else this.positions = [1,1,1];
    g_sprites[this.positions[this.renderCount]].drawAt(ctx, this.cx, this.cy);
    this.b += 0.8;
    if (this.b % 1 === 0) ++this.renderCount;    
    if (this.renderCount === 3) this.renderCount = 0;

    
    //this.sprite.scale = origScale;
};
