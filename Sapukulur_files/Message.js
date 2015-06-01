// ======
// Message
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Message(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    
}

Message.prototype = new Entity();
    
// Initial, inheritable, default values
Message.prototype.rotation = 0;
Message.prototype.cx = g_canvas.width/2;
Message.prototype.cy = g_canvas.height/2;
Message.prototype.isMessage = true;
Message.prototype.renderCount = 0;
Message.prototype.message = "Error";
Message.prototype.frameCount = 60;
Message.prototype.maxTextSize = 60;
Message.prototype.font = "Verdana";

Message.prototype.update = function (du) {

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }

    // for animation
    if (++this.renderCount === this.frameCount) this._isDeadNow = true;

};

Message.prototype.getRadius = function () {
    return 0;
};

Message.prototype.render = function (ctx) {
    ctx.save();
    ctx.fillStyle = COLORS[this.color];
    
    var textSize = 0.5+0.5*this.renderCount/this.frameCount;
    textSize = textSize*textSize;
    ctx.font = this.maxTextSize + "px " + this.font;
    ctx.translate(this.cx,this.cy);
    ctx.scale(textSize,textSize);
    
    // textAlign aligns text horizontally relative to placement
    ctx.textAlign = 'center';
    // textBaseline aligns text vertically relative to font style
    ctx.textBaseline = 'middle';
    
    //var alpha = 1-2*Math.abs(this.renderCount/this.frameCount-0.5);
    var alpha = 1-(this.renderCount/this.frameCount);
    ctx.globalAlpha = alpha*alpha;
    
    ctx.fillText(this.message,0,0);

    ctx.restore();
};