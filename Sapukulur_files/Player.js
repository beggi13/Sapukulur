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
    
};

Player.prototype = new Entity();

Player.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.initialPos = this.positions; // NEW
    this.reset_rotation = this.rotation;
};

//Player.prototype.KEY_THRUST = 'W'.charCodeAt(0);
//Player.prototype.KEY_RETRO  = 'S'.charCodeAt(0);
Player.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Player.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Player.prototype.KEY_FIRE   = 'W'.charCodeAt(0);

// Initial, inheritable, default values
Player.prototype.rotation = 0;

Player.prototype.cx = g_canvas.width/2;
Player.prototype.cy = g_canvas.height;
Player.prototype.velX = 0;
Player.prototype.velY = 0;
Player.prototype.launchVel = 5;
Player.prototype.launchAngle = 0;
Player.prototype.numSubSteps = 1;
Player.prototype.b = 0;
Player.prototype.renderCount = 0;
Player.prototype.positions = [1,1,1]; 
Player.prototype.flag = "stop";
Player.prototype.spriteMode = 0;    // can only be 0, 3, 6 or 9
Player.prototype.score = 0;
Player.prototype.MULT_DETERIORATION = 250;
Player.prototype.permult = 1;
Player.prototype.multiplier = 1;
    
Player.prototype.update = function (du) {

    spatialManager.unregister(this);


    this.flag = "stop";
    this.positions = [1,1,1];
    
    this.multiplier = Math.max(1,this.multiplier - du/this.MULT_DETERIORATION);

    // for animation
    if(2 === this.b++) {
        this.b = 0;
        ++this.renderCount; 
    }   
    if (this.renderCount === 3) this.renderCount = 0;


    // update launch angle
    if(this.bubble){
        var dx = g_mouseX - this.bubble.cx;
        var dy = g_mouseY - this.bubble.cy;

        this.launchAngle = Math.atan2(dy, dx) + Math.PI/2;
    }

    // Handle firing
    this.maybeFireBubble();

    this.updateMovement(du);
    
    if(!this.bubble){
        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.5;
        this.bubble = entityManager.generateBubble({
            cx: this.cx,// + dX * launchDist,
            cy: this.cy + launchDist//dY * launchDist
        });
    }
    

    //this.isColliding() ? this.warp() : spatialManager.register(this);

    spatialManager.register(this);

};

Player.prototype.maybeFireBubble = function () {

    if(keys[this.KEY_FIRE] || !this.bubble || g_mouseFire){
        this.flag = "back";
        this.positions = [37,37,37];
    }
    if ((keys[this.KEY_FIRE] || g_mouseFire) && this.bubble) {
        
        // different shooting angles depending on mouseClick vs W key
        var angle = g_mouseFire ? this.launchAngle : 0; 

        var launchDist = this.getRadius() * 1.5;

        var dX = +Math.sin(angle);
        var dY = -Math.cos(angle);
        
        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        this.bubble.velX = relVelX;
        this.bubble.velY = relVelY;
           
        this.bubble = undefined;
    }
    
};

Player.prototype.getRadius = function () {
    return (32/2) * 0.9;
};

Player.prototype.takePowerUpHit = function (color) {
    //console.log("powerUp hit");
    if(color === 1){
        this.spriteMode = 0;
        this.permult = 1;
    }
    if(color === 2){
        this.spriteMode = 3;
        this.permult = 2;
    }
    if(color === 3){
        this.spriteMode = 6;
        this.permult = 3;
    }
    if(color === 4){
        this.spriteMode = 9;
        this.permult = 4;
    }
};

Player.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.positions = this.initialPos;
};

Player.prototype.updateMovement = function (du) {
    /*if(keys[this.KEY_RIGHT]==false && keys[this.KEY_LEFT]==false && keys[this.KEY_FIRE]==false){
        this.flag = "stop";
        this.positions = [1,1,1];
    }*/
    if (keys[this.KEY_LEFT] && this.cx > 15) {
        this.cx -= 5 * du;
        this.cx = Math.max(this.cx,15);
        this.flag = "left";
        this.positions = [12, 13, 14];
    }
    if (keys[this.KEY_RIGHT] && this.cx < g_canvas.width-15) {
        this.cx += 5 * du;
        this.cx = Math.min(this.cx,g_canvas.width-15);
        this.flag = "right";
        this.positions = [24, 25, 26];
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
    //var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    //this.sprite.scale = this._scale;
    g_sprites.cat[this.positions[this.renderCount]+this.spriteMode].drawCentredAt(ctx, this.cx, this.cy);
   /* this.b += 0.5;
    if (this.b % 1 === 0) ++this.renderCount;    
    if (this.renderCount === 3) this.renderCount = 0;*/
    document.getElementById('output').innerHTML = "Score: " + this.score;
    document.getElementById('permultiplier').innerHTML = "Permanent Multiplier: " + this.permult;
    document.getElementById('multiplier').innerHTML = "Multiplier: " + (this.multiplier*this.permult).toFixed(2);

    if(!this.bubble) return;

    util.drawArrow(ctx, this.bubble.cx, this.bubble.cy, this.launchAngle, 100);
    //this.sprite.scale = origScale; 
};
