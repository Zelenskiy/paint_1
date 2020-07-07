var ongoingTouches = new Array();
let x0 = 0;
let y0 = 0;
let paintJS;

function handleStart(evt) {
    paintJS = this.a;
    evt.preventDefault();
    var el = document.getElementsByTagName("canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
    tmpImageData =  ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    x0= coordsX(touches[0].pageX);
    y0= coordsY(touches[0].pageY);
    console.log(x0,y0);

    for (var i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
    }
}


function colorForTouch(touch) {
    var r = touch.identifier % 16;
    var g = Math.floor(touch.identifier / 3) % 16;
    var b = Math.floor(touch.identifier / 7) % 16;
    r = r.toString(16); // make it a hex digit
    g = g.toString(16); // make it a hex digit
    b = b.toString(16); // make it a hex digit
    var color = "#" + r + g + b;
    log("color for touch with identifier " + touch.identifier + " = " + color);
    return color;
}

function coordsX(x) {
    return (x - $(paintJS.brushNode.parentElement).offset().left) / paintJS.zoom * 100;
}
function coordsY(y) {
    return (y - $(paintJS.brushNode.parentElement).offset().top) / paintJS.zoom * 100;
}

function handleMove(evt) {
    paintJS = this.a;
    evt.preventDefault();
    if (tool==0){   //defoultBrush
        def_brush_draw(evt, paintJS);
    } else if (tool==1){   //defoultBrush
        hand_brush_draw(evt, paintJS);
    } else if (tool==3){   //eraserBrush
        eraser_brush_draw(evt, paintJS);
    } else if (tool==5){   //lineBrush
        line_brush_draw(evt, x0, y0, paintJS);
    }



}

function handleEnd(evt) {
    paintJS = this.a;
    evt.preventDefault();
    log("touchend");
    var el = document.getElementsByTagName("canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        var color = colorForTouch(touches[i]);
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            // ctx.lineWidth = 4;
            // ctx.fillStyle = color;
            // ctx.beginPath();
            // ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            // ctx.lineTo(touches[i].pageX, touches[i].pageY);
            // ctx.closePath();
            // ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
            ongoingTouches.splice(idx, 1);  // remove it; we're done
        } else {
            console.log("can't figure out which touch to end");
        }
    }
    paintJS.canvasHistory.addStage();
}

function handleCancel(evt) {
    evt.preventDefault();
    log("touchcancel.");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        ongoingTouches.splice(i, 1);  // remove it; we're done
    }
}
function copyTouch(touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < ongoingTouches.length; i++) {
        var id = ongoingTouches[i].identifier;

        if (id == idToFind) {
            return i;
        }
    }
    return -1;    // not found
}

function log(msg) {
    // var p = document.getElementById('log');
    // p.innerHTML = msg + "\n" + p.innerHTML;
}


function onTouch(evt) {
    evt.preventDefault();
    if (evt.touches.length > 1 || (evt.type == "touchend" && evt.touches.length > 0))
        return;

    // var newEvt = document.createEvent("MouseEvents");
    var type = null;
    var touch = null;

    switch (evt.type) {
        case "touchstart":
            type = "mousedown";
            touch = evt.changedTouches[0];
            break;
        case "touchmove":
            type = "mousemove";
            touch = evt.changedTouches[0];
            break;
        case "touchend":
            type = "mouseup";
            touch = evt.changedTouches[0];
            break;
    }

    newEvt.initMouseEvent(type, true, true, evt.originalTarget.ownerDocument.defaultView, 0,
        touch.screenX, touch.screenY, touch.clientX, touch.clientY,
        evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 0, null);
    evt.originalTarget.dispatchEvent(newEvt);
}

