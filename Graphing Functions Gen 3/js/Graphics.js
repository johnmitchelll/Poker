//graph constants
const HEIGHT_OF_MARKS = 10;
const NUM_MARKS = 10;

//graph vars
var zoom = 30;
var offX = 0;
var offY = 0;
var t = 0;
var n = 100;
var a = -10; 
var b = 10;

function drawGraph(){   
    colorRect(-canvas.width, -canvas.height, canvas.width*2, canvas.height*2,  'rgb(18,18,18)');

    handleMouseInput();

    drawXYAxis();

    if(showAreaUnderCurve){ drawAreaUnderCurve() };
    
    for (var i = 1; i < derivitiveDomains.length; i++) {
    drawDomainOutput(derivitiveDomains[i], colorList[i]);
    }

    drawDomainOutput(domain, 'blue');

    if(showTangent) { drawTangentLine() };

    drawCrosshair();

    t += 0.01;
    getDomain(t)
}

function drawDomainOutput(domain, color){
    let temp = 0;
    for (var i = 0; i < domain.length; i++) {
        let yOfTempInRealSpace = (domain[temp] / zoom) * canvas.height + offY * canvas.height/zoom;
        let yOfIInRealSpace = (domain[i] / zoom) * canvas.height + offY * canvas.height/zoom;

        if(Math.abs(yOfTempInRealSpace - yOfIInRealSpace) < canvas.height/4 || 
                    (yOfTempInRealSpace > 0 && yOfIInRealSpace > 0) || (yOfTempInRealSpace < 0 && yOfIInRealSpace < 0)){
            drawLine(temp - domain.length/2,yOfTempInRealSpace,i - domain.length/2,yOfIInRealSpace,4,color);
        }

        if(i > 0){temp++;}
    }
}

function drawXYAxis(){
    let zoom_rangeslider = document.getElementById("zoom");
    zoom = zoom_rangeslider.value;

    //X Markers
    let xMarksPos = getPosOfMarkers(zoom, canvas.width, offX);
    for (var i = 0; i < xMarksPos.length; i++) {

        //draw graph mark
        drawLine(xMarksPos[i]/zoom * canvas.width + offX * canvas.width/zoom,
                 -canvas.height,
                 xMarksPos[i]/zoom * canvas.width + offX * canvas.width/zoom,
                 canvas.height, 2, 'rgba(18,18,100,0.5)');

        //draw hash mark
        drawLine(xMarksPos[i]/zoom * canvas.width + offX * canvas.width/zoom,
                 HEIGHT_OF_MARKS + offY * canvas.height/zoom,
                 xMarksPos[i]/zoom * canvas.width + offX * canvas.width/zoom,
                 -HEIGHT_OF_MARKS + offY * canvas.height/zoom, 
                 2, 'rgba(255,255,255,0.5)');
    }

    //Y Markers
    let yMarksPos = getPosOfMarkers(zoom, canvas.height, offY);
    for (var i = 0; i < yMarksPos.length; i++) {

        //draw graph mark
        drawLine(-canvas.width/2,
                yMarksPos[i]/zoom * canvas.height+offY * canvas.height/zoom,
                canvas.width/2,
                yMarksPos[i]/zoom * canvas.height+offY * canvas.height/zoom, 
                2, 'rgba(18,18,100,0.5)');

        //draw hash mark
        drawLine(HEIGHT_OF_MARKS + offX * canvas.width/zoom,
                yMarksPos[i]/zoom * canvas.height+offY * canvas.height/zoom,
                -HEIGHT_OF_MARKS + offX * canvas.width/zoom,
                yMarksPos[i]/zoom * canvas.height+offY * canvas.height/zoom, 
                2, 'rgba(255,255,255,0.5)');

        //draw number
        let height = 6;
        let width = canvasContext.measureText(-yMarksPos[i]).width;
        drawText("white", -yMarksPos[i], -canvas.width/2+width/2, 
                 yMarksPos[i]/zoom * canvas.height+offY * canvas.height/zoom+height/2)
        drawText("white", -yMarksPos[i], canvas.width/2-width*1.5, 
                 yMarksPos[i]/zoom * canvas.height+offY * canvas.height/zoom+height/2)
    }

    //Drawing X numbers here so that the graph makrks for the Y coords dont cross out the numbers
    for (var i = 0; i < xMarksPos.length; i++) {
        // draw numbers 
        let width = canvasContext.measureText(xMarksPos[i]).width;
        drawText("white", xMarksPos[i],xMarksPos[i]/zoom * canvas.width + offX * canvas.width/zoom - width/2,
                 canvas.height/2-3)
        drawText("white", xMarksPos[i],xMarksPos[i]/zoom * canvas.width + offX * canvas.width/zoom - width/2,
                 -canvas.height/2+9)
    }

    //Axis
    drawLine(-canvas.width/2,offY * canvas.height/zoom,canvas.width/2,offY * canvas.height/zoom,2,'rgba(255,255,255,0.5)');
    drawLine(offX * canvas.width/zoom,-canvas.height/2,offX * canvas.width/zoom,canvas.height/2,2,'rgba(255,255,255,0.5)');

    //Border
    drawLine(-canvas.width/2,-canvas.height/2,canvas.width/2,-canvas.height/2,'rgba(255,255,255,0.5)');
    drawLine(canvas.width/2,-canvas.height/2,canvas.width/2,canvas.height/2,'rgba(255,255,255,0.5)');
    drawLine(canvas.width/2,canvas.height/2,-canvas.width/2,canvas.height/2,'rgba(255,255,255,0.5)');
    drawLine(-canvas.width/2,-canvas.height/2,-canvas.width/2,canvas.height/2,'rgba(255,255,255,0.5)');
}


function drawTangentLine(){
    let mouseXAfterOffset = mouseX - offX * canvas.width/zoom
    let mouseXAfterZoom = (mouseXAfterOffset / canvas.width) * zoom;
    let outPutAtMouseX = Func(mouseXAfterZoom);
    let dAtMouseX = FuncDerivitive(mouseXAfterOffset, domain);

    let fa = outPutAtMouseX;
    let linearDomain = getLinearDomain(outPutAtMouseX, dAtMouseX.d / dAtMouseX.dx, mouseXAfterZoom);

    let temp = 0;

    for (var i = 0; i < linearDomain.length; i++) {
        let yOfTempInRealSpace = (linearDomain[temp] / zoom) * canvas.height + offY * canvas.height/zoom;
        let yOfIInRealSpace = (linearDomain[i] / zoom) * canvas.height + offY * canvas.height/zoom;

        drawLine(temp - linearDomain.length/2+mouseX, yOfTempInRealSpace, 
                i - linearDomain.length/2+mouseX, yOfIInRealSpace, 4,'red');

        if(i > 0){temp++;}
    }

    slope = dAtMouseX.d / dAtMouseX.dx;
    colorCircle(mouseX-linearDomain.length/2, (linearDomain[0] / zoom) * canvas.height + offY * canvas.height/zoom, 7, 'red');
    colorCircle(mouseX+linearDomain.length/2, (linearDomain[linearDomain.length-1] / zoom) * canvas.height + offY * canvas.height/zoom, 7, 'red');
    colorCircle(mouseX, (linearDomain[Math.floor(linearDomain.length/2)] / zoom) * canvas.height + offY * canvas.height/zoom, 7, 'red');
}


function drawAreaUnderCurve(){
    let c = [];
    let deltaX = (b - a) / n;

    for (var i = 1; i <= n; i++) {
        let xVal = a + (i - 1/2) * deltaX;
        c.push(xVal);
    }

    let outPutsAtC = [];

    for (var i = 0; i < c.length; i++) {

        let indexAtC = Math.floor((c[i] / zoom) * canvas.width + offX * canvas.width/zoom);
        if(indexAtC + Math.floor(canvas.width/2) > canvas.width + offX){
            break;
        }

        outPutsAtC.push(domain[indexAtC + Math.floor(canvas.width/2)]);
    }

    for (var i = 0; i < outPutsAtC.length; i++) {
        if((outPutsAtC[i] / zoom) * canvas.height < 0){
            colorRect(((c[i] - deltaX/2) / zoom) * canvas.width + offX * canvas.width/zoom, offY * canvas.height/zoom, 
            (deltaX / zoom) * canvas.width,(outPutsAtC[i] / zoom) * canvas.height, 'green');
        }
        if((outPutsAtC[i] / zoom) * canvas.height > 0){
            colorRect(((c[i] - deltaX/2) / zoom) * canvas.width + offX * canvas.width/zoom, offY * canvas.height/zoom, 
            (deltaX / zoom) * canvas.width,(outPutsAtC[i] / zoom) * canvas.height, 'red');
        }
    }

    drawLine((a / zoom) * canvas.width + offX * canvas.width/zoom,-canvas.height/2,
             (a / zoom) * canvas.width + offX * canvas.width/zoom,canvas.height/2,1,'white');
    drawLine((b / zoom) * canvas.width + offX * canvas.width/zoom,-canvas.height/2,
             (b / zoom) * canvas.width + offX * canvas.width/zoom,canvas.height/2,1,'white');

    colorCircle((a / zoom) * canvas.width + offX * canvas.width/zoom, offY * canvas.height/zoom, 10, 'white');
    colorCircle((b / zoom) * canvas.width + offX * canvas.width/zoom, offY * canvas.height/zoom, 10, 'white');

    drawText('black', "A", (a / zoom) * canvas.width-3 + offX * canvas.width/zoom, 2 + offY * canvas.height/zoom);
    drawText('black', "B", (b / zoom) * canvas.width-3 + offX * canvas.width/zoom, 2 + offY * canvas.height/zoom);

}

function drawCrosshair(){
    drawLine(-HEIGHT_OF_MARKS/2,0,HEIGHT_OF_MARKS/2,0,2,'rgba(255,255,255,0.75)');
    drawLine(0,-HEIGHT_OF_MARKS/2,0,HEIGHT_OF_MARKS/2,2,'rgba(255,255,255,0.75)');
    drawText('yellow', (-offX).toFixed(2) + ", " + (offY).toFixed(2), 3, -4)
}

