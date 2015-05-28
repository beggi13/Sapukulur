// =========
// SÁPUKÚLUR
// =========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================

function createInitialPlayer() {

    entityManager.generatePlayer({
        cx : g_canvas.width/2,
        cy : g_canvas.height - 30
    });
    
    entityManager.generateTopBubbles({});
    
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    
    entityManager.update(du);

    // Prevent perpetual firing!
    eatKey(Player.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_RESET = keyCode('R');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_RESET)) entityManager.resetPlayers();

}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        cat    : "Sapukulur_files/cats.gif",
        bubbles : "Sapukulur_files/BubbleSpritesheet.png"
    };
    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

// function for cutting up a spritesheet
function cutSpriteSheet(spriteSheet, numRows, numCols, celWidth, celHeight, rowStart, colStart, betweenCels, scale, skipRows, skipCols) {
    
    if(skipRows === undefined) skipRows = [];
    if(skipCols === undefined) skipCols = [];

    var result = [];
    for (var row = 0; row < numRows; ++row){
        var SpriteArray = [];

        if(skipRows.indexOf(row) > -1) continue;

        for (var col = 0; col < numCols; ++col){

            if(skipCols.indexOf(col) > -1) continue;

            var sprite = new Sprite(spriteSheet, colStart + col * betweenCels, rowStart + row * betweenCels, celWidth, celHeight);
            sprite.scale = scale;
            SpriteArray.push(sprite);
        }
        result.push(SpriteArray);
    }
    return result;
}


function preloadDone() {

    var celWidth = 32;
    var celHeight = 32;
    var numCols = 12;
    var numRows = 8;
    var numCels = 96;
    g_sprites.cat = [];

    var sprite;
    for (var row = 0; row < numRows; ++row) {
        for (var col = 0; col < numCols; ++col) {
            sprite = new Sprite(g_images.cat, col * celWidth, row * celHeight, celWidth, celHeight);
            sprite.scale = 1.3;
            g_sprites.cat.push(sprite);
        }
    }
    
    g_sprites.bubbles  = cutSpriteSheet(g_images.bubbles, 13,  5, 64, 64,       7, 668, 65, 0.3,  [], []);
    g_sprites.bubbles2 = cutSpriteSheet(g_images.bubbles,  8, 17, 26, 26,       9,   6, 26, 0.8, [1], []);
    g_sprites.powerUp  = cutSpriteSheet(g_images.bubbles,  5,  8, 26, 26,  10+26*8,   6, 26, 0.7,  [], []);
    g_sprites.smoke    = cutSpriteSheet(g_images.bubbles,  2,  6, 34, 34, 9+26*13,   6, 34, 0.8,  [], []);

    // fix for smoke spritesheet
    g_sprites.smoke = [ g_sprites.smoke[0].concat(g_sprites.smoke[1]) ];

    g_sprites.bubble = new Sprite(g_images.bubbles, 5, 9+26*9, 26, 26);

    entityManager.init();
    createInitialPlayer();

    main.init();
}

// Kick it off
requestPreloads();






