// ==============
// MOUSE HANDLING
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var g_mouseX = 0,
    g_mouseY = 0,
    g_mouseFire = false;

function handleMouse(evt) {
    
    g_mouseX = (evt.clientX - g_canvas.offsetLeft)*g_canvas.width/g_canvas.offsetWidth;
    g_mouseY = (evt.clientY - g_canvas.offsetTop)*g_canvas.height/g_canvas.offsetHeight;
    
    // If no button is being pressed, then bail
    var button = evt.buttons === undefined ? evt.which : evt.buttons;
    if (!button) return;
    
    g_mouseFire = true;
    


}

function handleMouseUp(evt) {

	g_mouseFire = false;

}

// Handle "down" and "move" events the same way.
window.addEventListener("mousedown", handleMouse);
window.addEventListener("mousemove", handleMouse);
window.addEventListener("mouseup", handleMouseUp);
