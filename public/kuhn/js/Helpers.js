function Vector(x,y){
    this.x = x;
    this.y = y;
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

function colorRectNoFill(topLeftX, topLeftY, boxWidth, boxHeight, fillColor, lineWidth) {
    canvasContext.lineWidth = lineWidth;
    canvasContext.strokeStyle = fillColor;
    canvasContext.strokeRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function colorNoFillCircle(centerX, centerY, radius, drawColor, lineWidth){
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  canvasContext.lineWidth = lineWidth;
  canvasContext.strokeStyle = drawColor;
  canvasContext.stroke();
}

function drawText(color, font, words, X, Y){
  canvasContext.fillStyle = color;
  canvasContext.font = font;
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

function drawImageFromSpriteSheetWithRotation(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, ang, antiAli){
    canvasContext.save();
    canvasContext.translate(dx, dy);
    canvasContext.rotate(ang);
     canvasContext.imageSmoothingEnabled = false; 
    if(antiAli){
        canvasContext.imageSmoothingEnabled = true; 
    }
    canvasContext.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);
    canvasContext.restore();
}

function circlePointColision(x1,y1,r, x2,y2){
  let dist = distanceOfTwoPoints(x1, y1, x2, y2);

  return dist < r;
}


function removeFromArray(array,index){
    for(i = array.length - 1; i >= 0; i--){
        if(i == index){
            array.splice(index, 1);
        }
    }
}

function swapArrayElements(arr, indexA, indexB) {
  var temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
};

function insertAt(array, index, elementsArray) {
    for(i = elementsArray.length - 1; i >= 0; i--){
        array.splice(index, 0, elementsArray[i]);
    }
}

function insertStringAt(index, string, newString) {
  if (index > 0) {
    return string.substring(0, index) + newString + string.substring(index);
  }

  return newString + string;
};

function normalize(maxOutput, minOutput, input){
    let m = 1 / (maxOutput - minOutput);

    let yInt = 1 - m*maxOutput;

    return m*input + yInt;
}

function updateTimeSteps(){
    currentTime = Date.now();

    totalTime = (currentTime - startTime)/1000;

    elaspedTime = totalTime - prevTotalTime;

    prevTotalTime = totalTime;

    if(fpsClock == undefined || totalTime - fpsClock >= 0.5){
        fps = Math.floor(1 / elaspedTime);
        fpsClock = totalTime;
    }
}


function deepCopy(arr){
  let copy = [];
  arr.forEach(elem => {
    if(Array.isArray(elem)){
      copy.push(deepCopy(elem))
    }else{
      if (typeof elem === 'object') {
        copy.push(deepCopyObject(elem))
    } else {
        copy.push(elem)
      }
    }
  })
  return copy;
}
// Helper function to deal with Objects
function deepCopyObject(obj){
  let tempObj = {};
  for (let [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      tempObj[key] = deepCopy(value);
    } else {
      if (typeof value === 'object') {
        tempObj[key] = deepCopyObject(value);
      } else {
        tempObj[key] = value
      }
    }
  }
  return tempObj;
}

// Function to compare two strings ignoring their cases
function equalIgnoreCase(str1, str2){
    return str1.toUpperCase() == str2.toUpperCase();
}


function measureText(pText, pFontSize, pStyle) {
    var lDiv = document.createElement('div');

    document.body.appendChild(lDiv);

    if (pStyle != null) {
        lDiv.style = pStyle;
    }
    lDiv.style.fontSize = "" + pFontSize + "px";
    lDiv.style.position = "absolute";
    lDiv.style.left = -1000;
    lDiv.style.top = -1000;

    lDiv.textContent = pText;

    var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
    };

    document.body.removeChild(lDiv);
    lDiv = null;

    return lResult;
}

