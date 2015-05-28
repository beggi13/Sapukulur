/*

entityManager.js

A module which handles arbitrary entity-management


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_animations  : [],
_topBubbles  : [],
_powerUps    : [],
_freeBubbles : [],
_players     : [],

// "PRIVATE" METHODS

_findNearestPlayer : function(posX, posY) {
    var closestPlayer = null,
        closestIndex = -1,
        closestSq = 1000 * 1000;

    for (var i = 0; i < this._Players.length; ++i) {

        var thisPlayer = this._Players[i];
        var PlayerPos = thisPlayer.getPos();
        var distSq = util.wrappedDistSq(
            PlayerPos.posX, PlayerPos.posY, 
            posX, posY,
            g_canvas.width, g_canvas.height);

        if (distSq < closestSq) {
            closestPlayer = thisPlayer;
            closestIndex = i;
            closestSq = distSq;
        }
    }
    return {
        thePlayer : closestPlayer,
        theIndex: closestIndex
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,
TOP_BUBBLES_INITIAL_ROWS : 8,
NEW_ROW_TIME : 30,

newRowsSoFar : 0,
shakeTime : 0,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._animations, this._topBubbles, this._powerUps, this._freeBubbles, this._players];
},

init: function() {
    //??
},

generateSmoke : function(descr) {
    var s = new Smoke(descr);
    this._animations.push(s);
    return s;
},

generateParticle : function(descr) {
    var p = new Particle(descr);
    this._animations.push(p);
    return p;
},

generateTopBubbles : function(descr) {
    this._topBubbles[0] = new TopBubbles(descr);
    for(var i = 0; i<this.TOP_BUBBLES_INITIAL_ROWS;i++){
        this._topBubbles[0].generateRow();
    }
    return this._topBubbles[0];
},

generatePowerUp: function(descr) {
    var pu = new PowerUp(descr);
    this._powerUps.push(pu);
    return pu;
},

generateBubble : function(descr) {
    if(this._freeBubbles.length >= 1){return;}
    var b = new Bubble(descr);
    this._freeBubbles.push(b);
    return b;
},

generatePlayer : function(descr) {
    var p = new Player(descr);
    this._players.push(p);
    var dX = +Math.sin(p.rotation);
    var dY = -Math.cos(p.rotation);
    var launchDist = p.getRadius() * 1.5;
    p.bubble = entityManager.generateBubble({
        cx: p.cx + dX * launchDist,
        cy: p.cy + dY * launchDist
    });
},

killNearestPlayer : function(xPos, yPos) {
    var thePlayer = this._findNearestPlayer(xPos, yPos).thePlayer;
    if (thePlayer) {
        thePlayer.kill();
    }
},

yoinkNearestPlayer : function(xPos, yPos) {
    var thePlayer = this._findNearestPlayer(xPos, yPos).thePlayer;
    if (thePlayer) {
        thePlayer.setPos(xPos, yPos);
    }
},

resetPlayers: function() {
    this._forEachOf(this._players, Player.prototype.reset);
},

haltPlayers: function() {
    this._forEachOf(this._players, Player.prototype.halt);
},	

restart: function(){
    this.clearEverything();
    main._isGameOver = false;
    main.init();
    g_isUpdatePaused = false;
    
    this.generatePlayer({
        cx : g_canvas.width/2,
        cy : g_canvas.height - 30
    });
    this.generateTopBubbles();
    document.getElementById('gameOver').style.display = "none";
},

clearEverything : function(){
        this.newRowsSoFar = 0;
        for (var i = 0; i < this._categories.length; ++i) {
            this._categories[i].splice(0,this._categories[i].length);
            /*var aCategory = this._categories[i];
                while(aCategory.length > 0){
                    aCategory.pop();
                }*/
        }
},

shakeAllFor: function(sec) {
    this.shakeTime = sec*1000 / NOMINAL_UPDATE_INTERVAL;
},


update: function(du) {
    
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
                if(aCategory == this._freeBubbles){
                    console.log("Bubble dead")
                }
            }
            else {
                ++i;
            }
        }
    }
    
    document.getElementById('timer').innerHTML = "Time to next row: " + (this.NEW_ROW_TIME*(this.newRowsSoFar+1)-main.getTime()).toFixed(0);
    
    if(this.NEW_ROW_TIME*(this.newRowsSoFar+1)-main.getTime()<0){
        this.newRowsSoFar = this.newRowsSoFar + 1;
        this._topBubbles[0].generateRow();
    }

    this.shakeTime = this.shakeTime > 0 ? this.shakeTime-du : 0;

},

render: function(ctx) {

    if(this.shakeTime) util.preShake(ctx);

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }

    if(this.shakeTime) util.postShake(ctx);


    // For debugging, to see what entities are alive at some point in time
    if(keys['L'.charCodeAt(0)]) console.log(entityManager._categories); 
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

