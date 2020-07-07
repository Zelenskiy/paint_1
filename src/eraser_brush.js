function eraser_brush_draw(evt, paintJS) {
    let el = document.getElementsByTagName("canvas")[0];
    let ctx = el.getContext("2d");
    let touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
        let color = colorForTouch(touches[i]);
        let idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            let x0= coordsX(ongoingTouches[idx].pageX);
            let y0= coordsY(ongoingTouches[idx].pageY);
            let x= coordsX(touches[i].pageX);
            let y= coordsY(touches[i].pageY);

            ctx.lineWidth = paintJS._brushSize*er_masshtab;
            ctx.strokeStyle = bg_Color;
            ctx.setLineDash([0, 0]);
            ctx.lineJoin    = "round";
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
            ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        } else {
            console.log("can't figure out which touch to continue");
        }
    }
}