var domain = [];
var derivitiveDomains = [];
var derivitiveDepth = 0;
const colorList = ['rgb(255, 0, 0, 0.3)',
                   'rgb(255, 0, 0, 0.3)',
                   'rgb(150, 150, 0, 0.3)',
                   'rgb(150, 0, 150, 0.3)',];

function getDomain(t){
  //sets zoom value
  var zoom_rangeslider = document.getElementById("zoom");
  zoom = zoom_rangeslider.value;

  var n_rangeslider = document.getElementById("n");
  n = n_rangeslider.value;

  let inputs = canvas.width;

  //initailize to empty
  domain = [];
  derivitiveDomains = [];

  //gets domain for the function
  for (var i = -offX * canvas.width/zoom - inputs/2; i < -offX * canvas.width/zoom + inputs/2; i++) {

    let x = (i / canvas.width ) * zoom;
    let y = Func(x);
    
    domain.push(y);
  }

  //gets domain for a given number of detrivitives
  derivitiveDomains = getDerivites(derivitiveDepth, inputs)
}

function getDerivites(depth, inputs){
  let tempDomains = [];
  tempDomains.push(domain);

  for (var i = 1; i < depth+1; i++) {

    let tempDomain = [];

    for (var x = -offX * canvas.width/zoom - inputs/2; x < -offX * canvas.width/zoom + inputs/2; x++) {

      let m = FuncDerivitive(x, tempDomains[i-1]);

      let slopeAtI = m.d / m.dx;

      tempDomain.push(slopeAtI);
    }

    tempDomains.push(tempDomain);
  }

  return tempDomains;
}

// //////////////////////////////////////////////////////////////////////////////////////
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function Func(x){
  let y = Math.tan(Math.cos(Math.sin(x+t) * 10*Math.cos(x)))
  return y * -1// * zoom;
}

function FuncDerivitive(x, set){
    let xAfterZoom = (x / canvas.width) * zoom;

    let h = (zoom / canvas.width);
    
    let riseRight = set[(x + offX * canvas.width/zoom + set.length/2) + 1] - set[(x + offX * canvas.width/zoom + set.length/2)];
    let runRight = (xAfterZoom + h) - xAfterZoom;

    let riseLeft = set[(x + offX * canvas.width/zoom + set.length/2) - 1] - set[(x + offX * canvas.width/zoom + set.length/2)];
    let runLeft = (xAfterZoom - h) - xAfterZoom;

    let avgRise = riseRight + riseLeft / 2;
    let avgRun = runRight + runLeft / 2;

  return {d:avgRise, dx:avgRun};
}

// Math.cos(x*x*x-t)
// 2 * Math.cos(Math.sin(Math.cos(t)*Math.cos(x)*t)) - 1.5;
// Math.tan(Math.sin(x+t) * 10*Math.cos(x));
// 3 * Math.sin(t * x) / x * x * x;
// 1 / (1 + Math.pow(Math.E, -1 * x))
// Math.tan(Math.cos(Math.sin(x+t) * 10*Math.cos(x)))
// Math.sin(x) / Math.cos(t/2);
// Math.abs(Math.sin(x*x)/2 * (x*x-Math.PI/2)/Math.PI)
// Math.sin(Math.tan(Math.sin(x+t) * 10*Math.cos(x)));