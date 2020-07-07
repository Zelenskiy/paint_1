function line_brush_draw(evt, x0,y0, paintJS) {
    let el = document.getElementsByTagName("canvas")[0];
    let ctx = el.getContext("2d");
    let touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
        let color = colorForTouch(touches[i]);
        let idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            // let x0= coordsX(ongoingTouches[idx].pageX);
            // let y0= coordsY(ongoingTouches[idx].pageY);
            let x= coordsX(touches[i].pageX);
            let y= coordsY(touches[i].pageY);
            ctx.putImageData(tmpImageData, 0, 0);
            var brushColor = paintJS.brushColor;

            ctx.beginPath();
            ctx.lineJoin  = "round";
            ctx.lineWidth   = paintJS.brushSize;
            switch (paintJS.lineMode) {
                case "0":
                    ctx.setLineDash([0, 0]);
                    break;
                case "1":
                    ctx.setLineDash([4, 16]);
                    break;
                case "2":
                    ctx.setLineDash([12, 16]);
                    break;
                case "3":
                    ctx.setLineDash([32, 32]);
                    break;
            }
            ctx.lineDashOffset = 0;
            ctx.strokeStyle = brushColor;
            let w = Math.abs(x0 - x);
            let h = Math.abs(y0- y);

            if (paintJS.arrow ){
                canvas_arrow(ctx,x0, y0, x,y);
            } else {
                ctx.moveTo(x0, y0);
                ctx.lineTo(x,y);
            }


            ctx.stroke();
            ctx.closePath();

            // ctx.lineWidth = paintJS._brushSize;
            // ctx.strokeStyle = paintJS._brushColor;
            // ctx.setLineDash([0, 0]);
            // ctx.lineJoin    = "round";
            // ctx.beginPath();
            // ctx.moveTo(x0, y0);
            // ctx.lineTo(x, y);
            // ctx.closePath();
            // ctx.stroke();
            ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        } else {
            console.log("can't figure out which touch to continue");
        }
    }
}