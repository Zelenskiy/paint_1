function hand_brush_draw(evt, paintJS) {
    var el = document.getElementsByTagName("canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        let color = colorForTouch(touches[i]);
        let idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            let x0= coordsX(ongoingTouches[idx].pageX);
            let y0= coordsY(ongoingTouches[idx].pageY);
            let x= coordsX(touches[i].pageX);
            let y= coordsY(touches[i].pageY);
            let targetDiv = $("#canvas-container-id");
            targetDiv.scrollTop(-y + y0);
            targetDiv.scrollLeft(-x + x0);


            ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        } else {
            console.log("can't figure out which touch to continue");
        }
    }
}