"use strict";
// array.splice(0,0,element)
// array.shift()
// array.push(element)
// array.pop()

// A generic contructor which accepts an arbitrary descriptor object
function TopBubbles(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    
    for(var i = 0; i < this.columnCount; i++){
        this.columns.push([]);
    }

};

TopBubbles.prototype = new Entity();

TopBubbles.prototype.cx = 0;
TopBubbles.prototype.cy = 0;

TopBubbles.prototype.columns = [];
TopBubbles.prototype.columnCount = Math.floor(g_canvas.width/(2*BUBBLE_RADIUS));
TopBubbles.prototype.offset = (g_canvas.width%(2*BUBBLE_RADIUS))/2 + BUBBLE_RADIUS;

TopBubbles.prototype.findHitBubble = function(column, row){

    var E = spatialManager.findEntityInRange(this.offset+column*(2*BUBBLE_RADIUS),
                                            this.offset+row*(2*BUBBLE_RADIUS),
                                            BUBBLE_RADIUS);
    if(E.isBubble) return E;
}

TopBubbles.prototype.generateRow = function(){
    for(var i = 0; i < this.columnCount; i++){
        this.columns[i].splice(0,0,util.discreetRandRange(1,COLORS.length));
    }
}

TopBubbles.prototype.cleanColumn = function(col){
    var count = 0;
    while(count <= this.columns[col].length &&
        !this.columns[col][this.columns[col].length-count-1]){
        count++;
    }
    if(count){
        this.columns[col].splice(this.columns[col].length-count, count);
    }
    console.log(this.columns[col]);
}

TopBubbles.prototype.findBubblesToEliminate= function(color,i,j){
    this.columns[i][j] = -this.columns[i][j];
    this.bubsToElim.push([i,j]);
    if(this.columns[i-1]
        && this.columns[i-1][j]
        && this.columns[i-1][j] > 0
        && this.columns[i-1][j] == color){
        this.findBubblesToEliminate(color, i-1,j);
    }
    if(this.columns[i+1]
        && this.columns[i+1][j]
        && this.columns[i+1][j] > 0
        && this.columns[i+1][j] == color){
        this.findBubblesToEliminate(color, i+1,j);
    }
    if(this.columns[i][j-1]
        && this.columns[i][j-1] > 0
        && this.columns[i][j-1] == color){
        this.findBubblesToEliminate(color, i,j-1);
    }
    if(this.columns[i][j+1]
        && this.columns[i][j+1] > 0
        && this.columns[i][j+1] == color){
        this.findBubblesToEliminate(color, i,j+1);
    }
}

TopBubbles.prototype.absorbBubble = function(bubble,column,row){
    this.columns[column][row] = bubble.color;
    bubble.kill();
    this.findBubblesToEliminate(bubble.color,column,row);
    var eliminate = this.bubsToElim.length >= 3;
    for(var i = 0; i < this.bubsToElim.length; i++){
        if(eliminate){
            this.columns[this.bubsToElim[i][0]][this.bubsToElim[i][1]] = 0;
            this.colsToClean[this.bubsToElim[i][0]] = true;
        } else {
            this.columns[this.bubsToElim[i][0]][this.bubsToElim[i][1]] *= -1;
        }
    }
}
    
TopBubbles.prototype.update = function (du) {
    spatialManager.unregister(this);

    this.colsToClean = [];
    this.bubsToElim = [];
    
    for(var i = 0; i < this.columnCount; i++){
        for(var j = 0;j <= this.columns[i].length; j++){
            var c = this.columns[i][j];
            if(!c){
                var bub = this.findHitBubble(i,j);
                if(bub && bub.color){
                    this.absorbBubble(bub,i,j);
                    var that = this;
                    var cleanFunc = function(value, index, array){
                        that.cleanColumn(index);
                    }
                    this.colsToClean.forEach(cleanFunc);
                    spatialManager.register(this);
                    return;
                }
            }
        }
    }
    
    
    spatialManager.register(this);
};

TopBubbles.prototype.getRadius = function () {
    return 0;
};

TopBubbles.prototype.render = function (ctx) {
    for(var i = 0; i < this.columnCount; i++){
        for(var j = 0;j < this.columns[i].length; j++){
            var oldStyle = ctx.fillStyle;
            
            ctx.fillStyle = COLORS[this.columns[i][j]];
            util.fillCircle(ctx,this.offset+i*(2*BUBBLE_RADIUS),
                                this.offset+j*(2*BUBBLE_RADIUS),
                                BUBBLE_RADIUS);
            
            ctx.fillStyle = oldStyle;
        }
    }
};
