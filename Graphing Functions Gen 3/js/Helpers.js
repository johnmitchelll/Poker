function calculateAreaUnderCurve(c, dx){
  let outPutsAtC = [];

    for (var i = 0; i < c.length; i++) {

        let outputAtC = Func(c[i]);

        outPutsAtC.push(outputAtC);
    }

    area = 0;
    for (var i = 0; i < outPutsAtC.length; i++) {
      let a = dx * outPutsAtC[i];
      area += a;
    }
}

function getLinearDomain(fa, fpa, a){
    let linearDomain = [];
    let len = 250;

    let aAfterZoom =(a / canvas.width) * zoom;

    for (var x = a - len/2; x < a + len/2; x++) {
        let xAfterZoom = (x / canvas.width) * zoom;
        let outPutAtTanLineX = fa + fpa * (xAfterZoom - aAfterZoom);

        linearDomain.push(outPutAtTanLineX)
    }

    linearDomain = getTrunkcatedDomainBasedOnLen(linearDomain, len, a)

    return linearDomain;
}

function getTrunkcatedDomainBasedOnLen(domain, len, a){
    let i = Math.floor(len/2 - 1);
    let j = Math.floor(len/2);

    let startingPoint = a - len/2;
    let trunkcatedDomain = [];

    while(i > 0 && j < len){
        let yOfIInRealSpace = (domain[i] / zoom) * canvas.height;
        let yOfJInRealSpace = (domain[j] / zoom) * canvas.height;

        if(distanceOfTwoPoints(i, yOfIInRealSpace, j, yOfJInRealSpace) > len){
            break;
        }

        i--; j++;
    }

    for(u = i; u < j; u++){
        trunkcatedDomain.push(domain[u]);
    }

    return trunkcatedDomain;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//this is for setting the buttons so that i will show a graph element or not :)

var showTangent = false;
var showAreaUnderCurve = false;

function tangentLineShow(){
    if(showTangent){
        showTangent = false;
    }else{
        showTangent = true;
    }
}

function areaUnderCurveShow(){
    if(showAreaUnderCurve){
        showAreaUnderCurve = false;
    }else{
        showAreaUnderCurve = true;
    }
}

function addDerivitive(){
    if(derivitiveDepth < colorList.length-1){  derivitiveDepth++;  }
}
function subtractDerivitive(){
    if(derivitiveDepth > 0){  derivitiveDepth--;  }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPosOfMarkers(len, real_len, off){
    let posMarkers = [];

    let a = -off - len/2 + 0.0001;
    let b = -off + len/2 + 0.0001;

    let deltaX = 2;

    let numMarks = 0;
    for (var i = 0; i < zoom; i += deltaX) {
        numMarks++;
    }

    while(numMarks < NUM_MARKS){
        deltaX -= deltaX/2;

        numMarks = 0;
        for (var i = 0; i < zoom; i += deltaX) {
            numMarks++;
        }
    }

    while(numMarks > NUM_MARKS){
        deltaX += deltaX;

        numMarks = 0;
        for (var i = 0; i < zoom; i += deltaX) {
            numMarks++;
        }
    }

    let firstX = undefined;
    let j = 0;

    if(a < 0){
        while(j > a){
            j -= deltaX;
        }
        firstX = j + deltaX;
    }

    if(a > 0){
        j = 0;
        while(j < a){
            j += deltaX;
        }
        firstX = j;
    }

    j = 1;
    posMarkers.push(firstX);
    while(firstX + j * deltaX < b){
        posMarkers.push(firstX + j * deltaX);
        j++;
    }

    return posMarkers;

}

function distanceOfTwoPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}


function randomIntFromInterval(min, max) { // min and max included 
  return Math.random() * (max - min + 1) + min;
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function drawText(color, words, X, Y){
    canvasContext.fillStyle = color;
    canvasContext.fillText(words, X, Y);
}

function drawLine(x1,y1,x2,y2,width,color){
    canvasContext.lineWidth = width;
    canvasContext.strokeStyle = color;
    canvasContext.beginPath()
    canvasContext.moveTo(x1, y1);
    canvasContext.lineTo(x2, y2);
    canvasContext.stroke();
}

function removeFromArray(array,index){
    for(i = array.length - 1; i >= 0; i--){
        if(array[i] == index){
            array.splice(i, 1);
        }
    }
}