// Mouse Input
var mouseX;
var mouseY;
var mouseDown = false;
var mouseInA = false;
var mouseInB = false;
var numFramesAfterClick = 0;
var lastMousePoint = {x:undefined, y:undefined};
let prevMousePoint = {x:undefined, y:undefined};

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = (evt.clientX - rect.left - root.scrollLeft) - canvas.width/2;
  mouseY = (evt.clientY - rect.top - root.scrollTop) - canvas.height/2;

}

function setMouseDown(){
  mouseDown = true;
}
function setMouseUp(){
  mouseDown = false;
  mouseInA = false;
  mouseInB = false;
  numFramesAfterClick = 0;
}

document.addEventListener('mousemove', updateMousePos);
document.addEventListener('mousedown', setMouseDown);
document.addEventListener('mouseup', setMouseUp);

function handleMouseInput(){
  if(circlePointColision((a / zoom) * canvas.width + offX * canvas.width/zoom,offY * canvas.height/zoom,10, mouseX,mouseY) && mouseDown && mouseInB == false){
    mouseInA  = true;
  }

  if(circlePointColision((b / zoom) * canvas.width + offX * canvas.width/zoom,offY * canvas.height/zoom,10, mouseX,mouseY) && mouseDown && mouseInA == false){
    mouseInB  = true;
  }

  if(mouseInA){
    a = (mouseX / canvas.width) * zoom - offX;
  }
  if(mouseInB){
    b = (mouseX / canvas.width) * zoom - offX;
  }

  if(mouseDown 
    && mouseY > -canvas.height/2 && mouseY < canvas.height 
    && mouseX > -canvas.width/2 && mouseX < canvas.width
    && mouseInA == false && mouseInB == false){

    if(numFramesAfterClick == 0){
      lastMousePoint.x = mouseX;
      lastMousePoint.y = mouseY;
      prevMousePoint.x = mouseX;
      prevMousePoint.y = mouseY;
    }else{
      if(mouseX != prevMousePoint.x){
        let dx = mouseX - prevMousePoint.x;
        offX += dx * zoom/canvas.width;
      }
      if(mouseY != prevMousePoint.y){
        let dy = mouseY - prevMousePoint.y;
        offY += dy * zoom/canvas.height;
      }

      prevMousePoint.x = mouseX;
      prevMousePoint.y = mouseY;
    }

    numFramesAfterClick++; 
  }
}

function circlePointColision(x1,y1,r, x2,y2){
  let dist = distanceOfTwoPoints(x1, y1, x2, y2);

  return dist < r;
}

