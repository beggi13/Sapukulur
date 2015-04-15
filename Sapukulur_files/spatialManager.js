/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {

    // TODO: YOUR STUFF HERE!

    return ++this._nextSpatialID - 1;

},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    
    // TODO: YOUR STUFF HERE!

    this._entities[spatialID] = entity;

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // TODO: YOUR STUFF HERE!

    delete this._entities[spatialID];    

},

findEntityInRange: function(posX, posY, radius) {

    // TODO: YOUR STUFF HERE!

    for(var i in this._entities){

        var E = this._entities[i];

        var posE = E.getPos();
        var dist = util.wrappedDistSq(posX, posY,
                                      posE.posX, posE.posY,
                                      g_canvas.width, g_canvas.height);

        if(dist <= (radius + E.getRadius()) * (radius + E.getRadius())) {
            return E;
        }

    }
    return false;
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        if(e === undefined) continue;
        var ePos = e.getPos();
        util.strokeCircle(ctx, ePos.posX, ePos.posY, e.getRadius());
    }
    ctx.strokeStyle = oldStyle;
}

}
