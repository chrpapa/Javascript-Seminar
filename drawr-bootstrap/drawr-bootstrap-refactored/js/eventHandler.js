/**
 * Created by Nishant on 8/27/2015.
 */
function changeCursor(color) { // create cursor for new color and apply it to page
    console.log("changeCursor to : " + color);
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
    ctx.lineTo(30, 30)
    ctx.stroke(); // draw cursor
    document.body.style.cursor = 'url(' + cursor.toDataURL() + '), auto'; // change to new cursor
}

function paletteClicked(elem) {
    console.log("paletteClicked....." + elem.className);
    color = $(elem).css('background-color'); // set brush color to color selected
    $(elem).siblings().removeClass('selected');
    $(elem).addClass('selected'); // make clicked color 'selected'
    changeCursor(color); // change cursor to new color
    thickness = $('#thickness').val(); // update thickness
    $('#thickcounter').text(thickness); // change thickness counter to match new thickness
    $('#thickness').removeAttr('disabled');
    $('#eraserthickness').attr('disabled','disabled');
    $('.brushcontrol').show();
    $('.erasercontrol').hide(); // show/enable brush thickness slider, hide/disable eraser thickness slider
    $('#selectedtool').css('background', color); // update selected tool with new color
    return [color, thickness];
}

function thicknessChanged() {
    thickness = $('#thickness').val();
    $('#thickcounter').text(thickness);
    return thickness;
}

function eraserThicknessChanged() {
    thickness = $('#eraserthickness').val();
    console.log("eraser thickness : " + thickness);
    $('#thickcounter').text(thickness);
    return thickness;
}

function colorSliderChanged() {
    var r = $('#redslider').val();
    var g = $('#greenslider').val();
    var b = $('#blueslider').val();
    $('#colorpicked').css('background-color', 'rgb(' + r + ',' + g + ',' + b + ')');
}

function addColorClicked() {
    $('#colorpicker').show();
}

function removeColorClicked() {
    $('li.selected').remove();
    $('#palette li:last-child').click();
}

function attachColorClicked() {
    var newColor = $('<li></li>');
    newColor.css('background-color', $('#colorpicked').css('background-color')).css('margin', '4px 3px');
    $('#palette').append(newColor);
    addEvent(newColor[0], 'click', function() {
        var returnValues = paletteClicked(this);
        color = returnValues[0];
        thickness = returnValues[1];
    });
    $('#colorpicker').hide();
}

function cancelColorClicked() {
    $('#colorpicker').hide();
}

function clearClicked() {
    var paintSurface = $('#paintsurface');
    var ctx = paintSurface[0].getContext('2d');
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.lineWidth = 0;
    ctx.clearRect(0,0,960,540); // erase canvas
    ctx.rect(0,0,960,540);
    ctx.stroke();
    ctx.fill(); // make background white instead of tansparent
}

function saveClicked() {
    var dataURL = paintSurface[0].toDataURL('image/png');
    window.open(dataURL);
}

function eraseClicked() {
    var color = 'white'; // set eraser to white
    var thickness = $('#eraserthickness').val(); // update thickness
    $('#thickcounter').text(thickness); // change thickness counter to match new thickness
    $(this).removeClass('selected'); // don't select
    $(this).siblings().removeClass('selected'); // deselect colors
    $('#eraserthickness').removeAttr('disabled');
    $('#thickness').attr('disabled','disabled');
    $('.brushcontrol').hide();
    $('.erasercontrol').show(); // show/enable eraser thickness slider, hide/disable brush thickness slider
    $('#selectedtool').css('background', 'url("eraser26.png")'); // update selected tool with eraser icon
    document.body.style.cursor = 'url(eraser16.png), auto'; // change cursor to eraser
    return [color, thickness];
}

function mouseUpOnCanvas(canvasClicked) {
    canvasClicked = false;
    return canvasClicked;
}

function mouseLeaveOnCanvas(canvasClicked) {
    canvasClicked = false;
    return canvasClicked;
}

function mouseDownOnCanvas(e, canvasClicked, lastEvent) {
    lastEvent = e;
    canvasClicked = true;
    return [lastEvent, canvasClicked];
}

function mouseMoveOnCanvas(e, canvasClicked, lastEvent, ctx, paintSurface, color, thickness) {
    console.log("canvasClicked : " + canvasClicked);
    if (canvasClicked) {
        lastEventpositionX = lastEvent.pageX-paintSurface.offset().left;
        lastEventpositionY = lastEvent.pageY-paintSurface.offset().top;
        xposition = e.pageX-paintSurface.offset().left;
        yposition = e.pageY-paintSurface.offset().top;

        ctx.beginPath();
        ctx.moveTo(lastEventpositionX, lastEventpositionY);
        ctx.lineTo(xposition, yposition);
        ctx.lineWidth = thickness
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.stroke();
        lastEvent = e;
    }
    return lastEvent;
}

function addEvent( element, event, callback ) {
    console.log("element class : " + element.className);
    if( window.addEventListener ) {
        element.addEventListener( event, callback, false );
    } else if( document.attachEvent ) {
        element.attachEvent( 'on' + event, callback );
    } else {
        element[ 'on' + event ] = callback;
    }
}