var color = $('.selected').css('background-color');
var paintSurface = $('#paintsurface');
var ctx = paintSurface[0].getContext('2d');
var lastEvent;
var canvasClicked = false;
var thickness = $('#thickness').val();

function initializeCanvas() { // ensure canvas starts with selected default settings
    var paintSurface = $('#paintsurface');
    var ctx = paintSurface[0].getContext('2d');
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.lineWidth = 0;
    ctx.rect(0,0,960,540);
    ctx.stroke();
    ctx.fill(); // make background white instead of transparent

    var cursor = document.createElement('canvas'); // create cursor canvas
    var ctx = cursor.getContext('2d');
    cursor.width = 16;
    cursor.height = 16;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.moveTo(2, 10);
    ctx.lineTo(2, 2);
    ctx.lineTo(10, 2);
    ctx.moveTo(2, 2);
    ctx.lineTo(30, 30);
    ctx.stroke(); // draw cursor
    document.body.style.cursor = 'url(' + cursor.toDataURL() + '), auto'; // change to new cursor

    $('#thickcounter').text(thickness); // initialize counter
    $('.erasercontrol').hide(); // initialize size slider to brush slider
    $('#colorpicker').hide(); // hide color picker
}

addEvent($('#addcolor'), 'click', function() {
    addColorClicked();
});
addEvent($('#removecolor'), 'click', function() {
    removeColorClicked();
});
addEvent($('#attachcolor'), 'click', function() {
    attachColorClicked();
});
addEvent($('#cancelcolor'), 'click', function() {
    cancelColorClicked();
});
addEvent($('#clear'), 'click', function() {
    clearClicked();
});
addEvent($('#save'), 'click', function() {
    saveClicked();
});
addEvent($('#eraserthickness'), 'change', function() {
    thickness = eraserThicknessChanged();
});
addEvent($('#thickness'), 'change', function() {
    thickness = thicknessChanged();
});
addEvent($('#paintsurface'), 'mouseup', function(){
    canvasClicked = mouseUpOnCanvas(canvasClicked);
});
addEvent($('#paintsurface'), 'mouseleave', function(){
    canvasClicked = mouseLeaveOnCanvas(canvasClicked);
});
addEvent($('#paintsurface'), 'mousemove', function(e){
    lastEvent = mouseMoveOnCanvas(e, canvasClicked, lastEvent, ctx, paintSurface, color, thickness);
});
addEvent($('#paintsurface'), 'mousedown', function(e){
    var returnValues = mouseDownOnCanvas(e, canvasClicked, lastEvent);
    lastEvent = returnValues[0];
    canvasClicked = returnValues[1];
});
addEvent($('#erase'), 'click', function() {
    var returnValues = eraseClicked();
    color = returnValues[0];
    thickness = returnValues[1];
});
addEvent($('#palette'), 'click', function(){
    var returnValues = paletteClicked(this);
    color = returnValues[0];
    thickness = returnValues[1];
});
addEvent($('.colorslider'), 'change', function() {
    colorSliderChanged(this);
});

// a simple facade that masks the various browser-specific methods
function addEvent( element, event, callback ) {
    console.log("element : " + element);
    if(element.nodeName == "UL") {
        console.log("List ...");
        for(var i = 0; i < element.children.length; i++) {
            console.log("count : " + i);
            if(element.children[i].nodeName == 'LI')
            addEvent(element.children[i], event, callback);
        }
    } else if(element.length > 0) {
        console.log("multiple elements ..");
        for(var i = 0; i < element.length; i++) {
            addEvent(element[i], event, callback);
        }
    }
    else {
        console.log("element class : " + element.className);
        if( window.addEventListener ) {
            element.addEventListener( event, callback, false );
        } else if( document.attachEvent ) {
            element.attachEvent( 'on' + event, callback );
        } else {
            element[ 'on' + event ] = callback;
        }
    }
}