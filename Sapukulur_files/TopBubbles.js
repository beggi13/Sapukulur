"use strict";
// array.splice(0,0,element) 
// array.shift()
// array.push(element)
// array.pop()

// A generic contructor which accepts an arbitrary descriptor object
function TopBubbles(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    this.columns = [];
    
    for(var i = 0; i < this.columnCount; i++){
        this.columns.push([]);
    }

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.bubbles2;

};

TopBubbles.prototype = new Entity();

TopBubbles.prototype.cx = 0;
TopBubbles.prototype.cy = 0;

TopBubbles.prototype.stillFrames = 0;
TopBubbles.prototype.renderCount = 0;

TopBubbles.prototype.columnCount = Math.floor(g_canvas.width/(2*BUBBLE_RADIUS));
TopBubbles.prototype.offset = (g_canvas.width%(2*BUBBLE_RADIUS))/2 + BUBBLE_RADIUS;

TopBubbles.prototype.maxColumnLength = function(){
    var maxLen = 0;
    for(var i = 0; i< this.columns.length; i++){
        if(maxLen < this.columns[i].length){
            maxLen = this.columns[i].length;
        }
    }
    return maxLen;
}

TopBubbles.prototype.findHitBubble = function(column, row){

    var E = spatialManager.findEntityInRange(this.offset+column*(2*BUBBLE_RADIUS),
                                            this.offset+row*(2*BUBBLE_RADIUS),
                                            BUBBLE_RADIUS);
    if(E.isBubble) return E;
};

TopBubbles.prototype.generateRow = function(){
    for(var i = 0; i < this.columnCount; i++){
        this.columns[i].splice(0,0,util.discreetRandRange(1,COLORS.length));
    }
};

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
};

TopBubbles.prototype.generateDeathAnimation = function(i,j) {

    var sx = this.offset+i*(2*BUBBLE_RADIUS);
    var sy = this.offset+j*(2*BUBBLE_RADIUS);

    entityManager.generateSmoke({
        cx : sx,
        cy : sy
    });

    var limit = util.discreetRandRange(10,20);
    for(var p = 0; p < limit; ++p){

        entityManager.generateParticle({
            cx     : sx,
            cy     : sy,
            color  : COLORS[ -this.columns[i][j] ]
        });
    }
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
    
};

TopBubbles.prototype.findBubblesToBomb = function(i, j, radius) {

    if(radius < 0) return;
    this.columns[i][j] = -this.columns[i][j];
    this.bubsToElim.push([i,j]);

    if(this.columns[i-1]
        && this.columns[i-1][j]
        && this.columns[i-1][j] > 0){
        this.findBubblesToBomb(i-1,j,radius-1);
    }
    if(this.columns[i+1]
        && this.columns[i+1][j]
        && this.columns[i+1][j] > 0){
        this.findBubblesToBomb(i+1,j,radius-1);
    }
    if(this.columns[i][j-1]
        && this.columns[i][j-1] > 0){
        this.findBubblesToBomb(i,j-1,radius-1);
    }
    if(this.columns[i][j+1]
        && this.columns[i][j+1] > 0){
        this.findBubblesToBomb(i,j+1,radius-1);
    }

};


TopBubbles.prototype.absorbBubble = function(bubble,column,row){
    this.columns[column][row] = bubble.color;
    bubble.kill();
    if(bubble.color === COLORS.length)  this.findBubblesToBomb(column, row, bubble.blowRadius);
    this.findBubblesToEliminate(bubble.color,column,row);

    //get the player
    var player = entityManager._players[0];
    //console.log(player);
    var eliminate = this.bubsToElim.length >= 3;
    for(var i = 0; i < this.bubsToElim.length; i++){
        if(eliminate){
            // Death animation
            this.generateDeathAnimation(this.bubsToElim[i][0], this.bubsToElim[i][1]);

            this.columns[this.bubsToElim[i][0]][this.bubsToElim[i][1]] = 0;
            this.colsToClean[this.bubsToElim[i][0]] = true;
            //the score for the player increases
            player.score = player.score+Math.floor(this.bubsToElim.length*player.multiplier*player.permult);
            
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
};
    
TopBubbles.prototype.distance = function(bubble, i, j){
    var a = (bubble.cx - this.offset-i*(2*BUBBLE_RADIUS));
    var b = (bubble.cy - this.offset-j*(2*BUBBLE_RADIUS));
    //console.log(a*a+b*b);
    return (a*a + b*b);
};

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
        for(var j = 0; j <= this.columns[i].length; j++){
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
    
    if(!util.isBetween(this.maxColumnLength(), 1, 20)){
        main.gameOver();
    }

};

TopBubbles.prototype.getRadius = function () {
    return 0;
};

TopBubbles.prototype.render = function (ctx) {

    

    for(var i = 0; i < this.columnCount; i++){
        for(var j = 0;j < this.columns[i].length; j++){  


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
            
            this.sprite[this.columns[i][j]-1][this.renderCount].drawCentredAt(
                ctx,
                this.offset+i*(2*BUBBLE_RADIUS),
                this.offset+j*(2*BUBBLE_RADIUS)
            );

          //  ctx.globalAlpha = 1;
            
        }
        
    }
    
};

/* //used to check if game becomes too slow when many bubbles die at once (copy into console)
var tb = entityManager._topBubbles[0];
for(var i = 0; i < tb.columnCount; i++){
    for(var j = 0;j < tb.columns[i].length; j++){  
        tb.columns[i][j] = 1;
    }
}
*/
