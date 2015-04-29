"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function TopBubbles(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

};

TopBubbles.prototype = new Entity();

TopBubbles.prototype.cx = 0;
TopBubbles.prototype.cy = 0;

TopBubbles.prototype.rows = [];
TopBubbles.prototype.columns = Math.floor(g_canvas.width/20);

TopBubbles.prototype.findHitBubble = function(column, row){
    return spatialManager.findEntityInRange(15+column*20, 10+row*20, 10);
}

TopBubbles.prototype.generateRow = function(){
    var newRow = [];
    for(var i = 0; i < this.columns; i++){
        newRow.push(util.discreetRandRange(1,COLORS.length));
    }
    this.rows.push(newRow);
}
    
TopBubbles.prototype.update = function (du) {
    spatialManager.unregister(this);

    spatialManager.register(this);
};

TopBubbles.prototype.getRadius = function () {
    return 0;
};

TopBubbles.prototype.render = function (ctx) {
    for(var i = 0; i < this.rows.length; i++){
        for(var j = 0;j < this.columns; j++){
            var oldStyle = ctx.fillStyle;
            
            ctx.fillStyle = COLORS[this.rows[i][j]];
            util.fillCircle(ctx, 15+j*20, 10+i*20, 10);
            
            ctx.fillStyle = oldStyle;
        }
    }
};
