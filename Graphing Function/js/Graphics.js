var area;
var slope;
var a = -Math.PI/2; 
var b = Math.PI/2;
var n;
var zoom;
var t = 50;

function drawGraph(){   
    colorRect(-canvas.width, -canvas.height, canvas.width*2, canvas.height*2,  'rgb(18,18,18)');
    

    if(showAreaUnderCurve){ drawAreaUnderCurve() };

    drawXYAxis();

    for (var i = 1; i < derivitiveDomains.length; i++) {
    drawDomainOutput(derivitiveDomains[i], colorList[i]);
    }

    drawDomainOutput(domain, 'blue');

    drawGraphStats();


    if(showTangent) { drawTangentLine() };
    
    t += 0.01;
    getDomain(t);  
    handleMouseInput();
}

function drawDomainOutput(domain, color){
    let temp = 0;

    for (var i = 0; i < domain.length; i++) {
        let yOfTempInRealSpace = (domain[temp] / zoom) * canvas.height;
        let yOfIInRealSpace = (domain[i] / zoom) * canvas.height;

        if(Math.abs(yOfTempInRealSpace - yOfIInRealSpace) < canvas.height/4 || 
                    (yOfTempInRealSpace > 0 && yOfIInRealSpace > 0) || (yOfTempInRealSpace < 0 && yOfIInRealSpace < 0)){
            drawLine(temp - domain.length/2,yOfTempInRealSpace,i - domain.length/2,yOfIInRealSpace,4,color);
        }

        if(i > 0){temp++;}
    }
}

function drawXYAxis(){
    drawLine(-canvas.width/2,0,canvas.width/2,0,1,'white');
    drawLine(0,-canvas.height,0,canvas.height,1,'white');

    let numMarks = 10;

    //X Markers
    for (var i = 1; i <= numMarks; i++) {
        drawLine((i * (canvas.width / numMarks) - canvas.width/2),5,
                (i * (canvas.width / numMarks) - canvas.width/2),-5,1,'white');

        let xValAfterZoom = ((i * (canvas.width / numMarks) - canvas.width/2) / canvas.width) * zoom;

        if(xValAfterZoom.toFixed(2) != 0){
            drawText('white', xValAfterZoom.toFixed(2), (i * (canvas.width / numMarks) - canvas.width/2) - 12, - 5);
        }
    }

    //Y Markers
    for (var i = 1; i <= numMarks; i++) {
        drawLine(5,(i * (canvas.height / numMarks) - canvas.height/2),
                -5,(i * (canvas.height / numMarks) - canvas.height/2),1,'white');

        let yValAfterZoom = -1 * ((i * (canvas.height / numMarks) - canvas.height/2) / canvas.height) * zoom;
        
        if(yValAfterZoom.toFixed(2) != 0){
            drawText('white', yValAfterZoom.toFixed(2), 5, (i * (canvas.height / numMarks) - canvas.height/2) - 3);
        }
    }
}

function drawGraphStats(){
    let numPointsInGraph = 0;

    for (var i = 0; i < domain.length; i++) {
        let zoomToRealSpaceY = (domain[i] / zoom) * canvas.height;
        if(zoomToRealSpaceY < canvas.height/2 && zoomToRealSpaceY > -canvas.height/2){
            numPointsInGraph++;
        }
    }

    drawText('yellow', ((mouseX / canvas.width) * zoom).toFixed(2), mouseX, mouseY);
    drawLine(mouseX,-canvas.height,mouseX,canvas.height,1,'white');

    let percentVisual = (numPointsInGraph / domain.length) * 100;

    drawText('white', "Percent of Outputs Visible: " + (percentVisual).toFixed(2) + "%", 
             canvas.width/2 - (canvas.width/2 * 0.50), -canvas.height/2 + (canvas.height * 0.07));

    drawText('white', "Time of Function: " + t.toFixed(2), 
             canvas.width/2 - (canvas.width/2 * 0.50), -canvas.height/2 + (canvas.height * 0.09));

    drawText('white', "Dertivative of at Mouse X: " + (slope * -1).toFixed(3), 
             canvas.width/2 - (canvas.width/2 * 0.50), -canvas.height/2 + (canvas.height * 0.11));

    drawText('white', "Intergral on [A, B]: " + Math.abs(area).toFixed(3), 
             canvas.width/2 - (canvas.width/2 * 0.50), -canvas.height/2 + (canvas.height * 0.13));
}

function drawTangentLine(){
    let mouseXAfterZoom = (mouseX / canvas.width) * zoom;
    let outPutAtMouseX = Func(mouseXAfterZoom);
    let dAtMouseX = FuncDerivitive(mouseX, domain);

    let fa = outPutAtMouseX;
    let linearDomain = getLinearDomain(outPutAtMouseX, dAtMouseX.d / dAtMouseX.dx, mouseX);

    let temp = 0;

    let outPutAtMouseXInRealSpace = (outPutAtMouseX / zoom) * canvas.height;

    for (var i = 0; i < linearDomain.length; i++) {
        let yOfTempInRealSpace = (linearDomain[temp] / zoom) * canvas.height;
        let yOfIInRealSpace = (linearDomain[i] / zoom) * canvas.height;

        drawLine(temp - linearDomain.length/2+mouseX, yOfTempInRealSpace, 
                i - linearDomain.length/2+mouseX, yOfIInRealSpace, 4,'red');

        if(i > 0){temp++;}
    }

    slope = dAtMouseX.d / dAtMouseX.dx;
    colorCircle(mouseX-linearDomain.length/2, (linearDomain[0] / zoom) * canvas.height, 7, 'red');
    colorCircle(mouseX+linearDomain.length/2, (linearDomain[linearDomain.length-1] / zoom) * canvas.height, 7, 'red');
    colorCircle(mouseX, (linearDomain[Math.floor(linearDomain.length/2)] / zoom) * canvas.height, 7, 'red');
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

        let indexAtC = Math.floor((c[i] / zoom) * canvas.width);
        if(indexAtC + Math.floor(canvas.width/2) > canvas.width){
            break;
        }

        outPutsAtC.push(domain[indexAtC + Math.floor(canvas.width/2)]);
    }

    for (var i = 0; i < outPutsAtC.length; i++) {
        colorRect(((c[i] - deltaX/2) / zoom) * canvas.width, 0, 
        (deltaX / zoom) * canvas.width,(outPutsAtC[i] / zoom) * canvas.height, 'green')
    }

    drawLine((a / zoom) * canvas.width,-canvas.height/2,(a / zoom) * canvas.width,canvas.height/2,1,'white');
    drawLine((b / zoom) * canvas.width,-canvas.height/2,(b / zoom) * canvas.width,canvas.height/2,1,'white');

    colorCircle((a / zoom) * canvas.width, 0, 10, 'white');
    colorCircle((b / zoom) * canvas.width, 0, 10, 'white');

    drawText('black', "A", (a / zoom) * canvas.width-3, 2);
    drawText('black', "B", (b / zoom) * canvas.width-3, 2);

    calculateAreaUnderCurve(c, deltaX);
}