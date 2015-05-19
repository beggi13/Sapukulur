// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


var util = {


// RANGES
// ======

clampRange: function(value, lowBound, highBound) {
    if (value < lowBound) {
	value = lowBound;
    } else if (value > highBound) {
	value = highBound;
    }
    return value;
},

wrapRange: function(value, lowBound, highBound) {
    while (value < lowBound) {
	value += (highBound - lowBound);
    }
    while (value > highBound) {
	value -= (highBound - lowBound);
    }
    return value;
},

isBetween: function(value, lowBound, highBound) {
    if (value < lowBound) { return false; }
    if (value > highBound) { return false; }
    return true;
},


// RANDOMNESS
// ==========

randRange: function(min, max) {
    return (min + Math.random() * (max - min));
},

discreetRandRange: function(min, max){
    return Math.floor(this.randRange(min,max));
},

// MISC
// ====

square: function(x) {
    return x*x;
},


// DISTANCES
// =========

distSq: function(x1, y1, x2, y2) {
    return this.square(x2-x1) + this.square(y2-y1);
},

wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
    var dx = Math.abs(x2-x1),
	dy = Math.abs(y2-y1);
    if (dx > xWrap/2) {
	dx = xWrap - dx;
    };
    if (dy > yWrap/2) {
	dy = yWrap - dy;
    }
    return this.square(dx) + this.square(dy);
},


// CANVAS OPS
// ==========

clearCanvas: function (ctx) {
    var prevfillStyle = ctx.fillStyle;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevfillStyle;
},

strokeCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
},

fillCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
},

fillBox: function (ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
},

drawArrow: function (ctx, sx, sy, angle, length, angleWidth) {
    
    if(angle === undefined) angle = 0;
    if(length === undefined) length = 100;
    if(angleWidth === undefined || angleWidth > Math.PI/2) angleWidth = Math.PI/4;

    var halfWidth = angleWidth / 2;

    ctx.save();
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    
    ctx.translate(sx,sy);
    ctx.rotate(angle+Math.PI);
    ctx.translate(-sx,-sy);
    
    ctx.beginPath();
    
    ctx.arc(sx, sy, BUBBLE_RADIUS+3, Math.PI/2 + halfWidth, Math.PI/2 - halfWidth, true);
    
   // ctx.lineTo(sx+2,sy+length);
   // ctx.lineTo(sx+8,sy+length-3);
    ctx.lineTo(sx,sy+length+10);
   // ctx.lineTo(sx-8,sy+length-3);
   // ctx.lineTo(sx-2,sy+length);
    ctx.closePath();   
    ctx.fill();
    
    ctx.fillStyle = oldStyle;
    ctx.restore();
},


// Animation

preShake: function(ctx, power) { // power is the max possible movement in pixels when shaking
    
    if(power === undefined) power = 10;

    ctx.save();
    var dx = Math.random()*power;
    var dy = Math.random()*power;

    dx = Math.random() < 0.5 ? dx : -dx;
    dy = Math.random() < 0.5 ? dy : -dy;
    ctx.translate(dx, dy); 
},

postShake: function(ctx) {
    ctx.restore();
}

};
