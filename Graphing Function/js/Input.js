// Mouse Input
var mouseX;
var mouseY;
var mouseDown = false;
var mouseInA = false;
var mouseInB = false;

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
}

document.addEventListener('mousemove', updateMousePos);
document.addEventListener('mousedown', setMouseDown);
document.addEventListener('mouseup', setMouseUp);

function handleMouseInput(){
  if(circlePointColision((a / zoom) * canvas.width,0,10, mouseX,mouseY) && mouseDown && mouseInB == false){
    mouseInA  = true;
  }

  if(circlePointColision((b / zoom) * canvas.width,0,10, mouseX,mouseY) && mouseDown && mouseInA == false){
    mouseInB  = true;
  }

  if(mouseInA){
    a = (mouseX / canvas.width) * zoom;
  }
  if(mouseInB){
    b = (mouseX / canvas.width) * zoom;
  }
}

function circlePointColision(x1,y1,r, x2,y2){
  let dist = distanceOfTwoPoints(x1, y1, x2, y2);

  return dist < r;
}