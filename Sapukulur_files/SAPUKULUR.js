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

function createInitialShips() {

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
            g_sprites.cat.push(sprite);
        }
    }

    numRows = 13;
    numCols = 5;
    celWidth = 64;
    celHeight = 64;
    var betweenCels = 65;
    var colStart = 668;
    var rowStart = 7;
    g_sprites.bubbles = [];

    for (var row = 0; row < numRows; ++row){
        var SpriteArray = [];
        for (var col = 0; col < numCols; ++col){
            sprite = new Sprite(g_images.bubbles, colStart + col * betweenCels, rowStart + row * betweenCels, celWidth, celHeight);
            sprite.scale = 0.3;
            SpriteArray.push(sprite);
        }
        g_sprites.bubbles.push(SpriteArray);
    }

    numRows = 8;
    numCols = 17;
    celWidth = 26;
    celHeight = 26;
    var betweenCels = 26;
    var colStart = 5;
    var rowStart = 9;
    g_sprites.bubbles2 = []; //0,2,4,5

    for (var row = 0; row < numRows; ++row){
        var SpriteArray = [];
        if(row === 1) continue;

        for (var col = 0; col < numCols; ++col){

            sprite = new Sprite(g_images.bubbles, colStart + col * betweenCels, rowStart + row * betweenCels, celWidth, celHeight);
            sprite.scale = 0.8;
            SpriteArray.push(sprite);
        }
        g_sprites.bubbles2.push(SpriteArray);
    }

    numRows = 5;
    numCols = 8;
    celWidth = 26;
    celHeight = 26;
    var betweenCels = 26;
    var colStart = 5;
    var rowStart = 9+26*8;
    g_sprites.powerUp = []; //0,2,4,5

    for (var row = 0; row < numRows; ++row){
        var SpriteArray = [];

        for (var col = 0; col < numCols; ++col){

            sprite = new Sprite(g_images.bubbles, colStart + col * betweenCels, rowStart + row * betweenCels, celWidth, celHeight);
            sprite.scale = 0.7;
            SpriteArray.push(sprite);
        }
        g_sprites.powerUp.push(SpriteArray);
    }
    
    //g_sprites.ship2 = new Sprite(g_images.ship2);
    //g_sprites.rock  = new Sprite(g_images.rock, 0, 0, g_images.rock.width, g_images.rock.height);

    g_sprites.bubble = new Sprite(g_images.bubbles, 5, 9+26*9, 26, 26);
    //g_sprites.bubble = new Sprite(g_images.bubbles, 668 + 130, 7, 64, 64);
    //g_sprites.bubble.scale = 0.4;

    entityManager.init();
    createInitialShips();

    main.init();
}

// Kick it off
requestPreloads();






