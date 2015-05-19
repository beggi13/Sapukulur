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

TopBubbles.prototype.stillFrames = 0;
TopBubbles.prototype.renderCount = 0;

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
    //console.log(this.columns[col]);
}

TopBubbles.prototype.generateDeathAnimation = function(i,j) {
    entityManager.generateSmoke({
        cx: this.offset+i*(2*BUBBLE_RADIUS),
        cy: this.offset+j*(2*BUBBLE_RADIUS)
    });
};

TopBubbles.prototype.findBubblesToEliminate = function(color,i,j){
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
/*    var up      = this.columns[i][j-1];
    var down    = this.columns[i][j+1];


    var left    = this.columns[i-1] ? this.columns[i-1][j] : false;
    var right   = this.columns[i+1] ? this.columns[i+1][j] : false;

    var leftUp      = left && j % 2 === 0 ? false                   : this.columns[i-1][j-1];
    var leftDown    = left && j % 2 === 0 ? this.columns[i-1][j+1]  : false;

    var rightUp     = right && j % 2 === 0 ? false                  : this.columns[i+1][j-1];
    var rightDown   = right && j % 2 === 0 ? this.columns[i+1][j+1] : false;

    //// LEFT /////////////////////////////////////
    if(    leftUp
        && leftUp > 0
        && leftUp === color){
        this.findBubblesToEliminate(color, i-1, j-1);
    }
    if(    left
        && left > 0
        && left === color){
        this.findBubblesToEliminate(color, i-1, j);
    }
    if(    leftDown
        && leftDown > 0
        && leftDown === color){
        this.findBubblesToEliminate(color, i-1, j+1);
    }
    //// RIGHT ////////////////////////////////////
    if(    rightUp
        && rightUp > 0
        && rightUp === color){
        this.findBubblesToEliminate(color, i+1, j-1);
    }
    if(    right
        && right > 0
        && right === color){
        this.findBubblesToEliminate(color, i+1, j);
    }
    if(    rightDown
        && rightDown > 0
        && rightDown === color){
        this.findBubblesToEliminate(color, i+1, j+1);
    }
    //// UP ///////////////////////////////////////
    if(    up
        && up > 0
        && up === color){
        this.findBubblesToEliminate(color, i, j-1);
    }
    //// SOWN /////////////////////////////////////
    if(    down
        && down > 0
        && down === color){
        this.findBubblesToEliminate(color, i, j+1);
    }*/
    
}

TopBubbles.prototype.absorbBubble = function(bubble,column,row){
    this.columns[column][row] = bubble.color;
    bubble.kill();
    this.findBubblesToEliminate(bubble.color,column,row);

    //get the player
    var player = entityManager._players[0];
    //console.log(player);
    var eliminate = this.bubsToElim.length >= 3;
    for(var i = 0; i < this.bubsToElim.length; i++){
        if(eliminate){
            this.columns[this.bubsToElim[i][0]][this.bubsToElim[i][1]] = 0;
            this.colsToClean[this.bubsToElim[i][0]] = true;
            //the score for the player increase
            player.score = player.score+Math.floor(this.bubsToElim.length*player.multiplier*player.permult);

            console.log(this.bubsToElim);
            this.generateDeathAnimation(this.bubsToElim[i][0], this.bubsToElim[i][1]);
        } else {
            this.columns[this.bubsToElim[i][0]][this.bubsToElim[i][1]] *= -1;
        }
    }
    if(eliminate){
        player.multiplier += this.bubsToElim.length - 1;
        if(util.randRange(0,100)<30){
            entityManager.generatePowerUp({
                cx: bubble.cx,
                cy: bubble.cy,
                color: Math.floor((util.discreetRandRange(1, COLORS.length) + util.discreetRandRange(1,COLORS.length))/2)
            });
        }
    }
    //document.getElementById('output').innerHTML = "Score: " + player.score;
}
    
TopBubbles.prototype.distance = function(bubble, i, j){
    var a = (bubble.cx - this.offset-i*(2*BUBBLE_RADIUS));
    var b = (bubble.cy - this.offset-j*(2*BUBBLE_RADIUS));
    //console.log(a*a+b*b);
    return (a*a + b*b);
}

TopBubbles.prototype.update = function (du) {
    spatialManager.unregister(this);

    // for animation
    if(10 === this.stillFrames++) {
        this.stillFrames = 0;
        ++this.renderCount; 
    }   
    if (this.renderCount === 17) this.renderCount = 0;


    this.colsToClean = [];
    this.bubsToElim = [];
    
    for(var i = 0; i < this.columnCount; i++){
        for(var j = 0;j <= this.columns[i].length; j++){
            var c = this.columns[i][j];
            //console.log(c);
            if(c){
                var bub = this.findHitBubble(i,j);
                if(bub && bub.color){
                    var bestEmptyBub = [0,0];// Bad, stupid default to avoid crashes
                    var minDist = Number.MAX_VALUE;
                    for(var di = -1; di <= 1; di++){
                        if(!this.columns[i+di]){
                            continue;
                        }
                        for(var dj = -1; dj <=1; dj++){
                            if(!this.columns[i+di][j+dj]){
                                var dist = this.distance(bub, i+di, j+dj)
                                if(dist < minDist){
                                    minDist = dist;
                                    bestEmptyBub = [di,dj];
                                }
                            }
                        }
                    }
                    this.absorbBubble(bub,i + bestEmptyBub[0],j + bestEmptyBub[1]);
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
            
            var oddOffset = j % 2 === 0 ? 0 : BUBBLE_RADIUS;


            if(this.columns[i][j] === 0 || !g_sprites.bubbles2[this.columns[i][j]-1]) continue;
           /* 
            var oldStyle = ctx.fillStyle;
            ctx.fillStyle = COLORS[this.columns[i][j]];
            util.fillCircle(ctx,this.offset+i*(2*BUBBLE_RADIUS),
                                this.offset+j*(2*BUBBLE_RADIUS),
                                BUBBLE_RADIUS);
            
            ctx.fillStyle = oldStyle;

            g_sprites.bubbles[this.columns[i][j]][0].drawCentredAt(
                ctx,
                this.offset+i*(2*BUBBLE_RADIUS),
                this.offset+j*(2*BUBBLE_RADIUS)
            );*/
         /*  nje  
            var bubble = entityManager._freeBubbles ? entityManager._freeBubbles[0] : false;
            
            if(bubble && bubble.color !== this.columns[i][j]) { 
                ctx.globalAlpha = 0.8;
            }*/
            
            g_sprites.bubbles2[this.columns[i][j]-1][this.renderCount].drawCentredAt(
                ctx,
                this.offset+i*(2*BUBBLE_RADIUS),// + oddOffset,
                this.offset+j*(2*BUBBLE_RADIUS)// + oddOffset//2
            );

          //  ctx.globalAlpha = 1;
            
        }
        
    }
    
};
