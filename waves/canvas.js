const canvas = document.querySelectorAll("canvas")[0],
pixelRat = devicePixelRatio;
canvas.width = window.innerWidth * pixelRat;
canvas.height = window.innerHeight * pixelRat;
const ctx = canvas.getContext("2d");

let A=10,//amplitude of wave
k=-0.1,//wave number
w=4,//angular frequency
lambda=(2*(Math.PI/180))/k,//wavelength
T = (2 * (Math.PI / 180)) / w,//wave period
v = lambda/T,//wave velocity
d= canvas.width,//wave distancy
t=d/v,//time
f = 1/T;//freq



// 0 equals to phase shift
function calcWave(x, posicion) { // somewhat equivalent to this y(x,t) = A*sin(k*x -/+ w*t + 0)
    if(posicion)
        return A * Math.sin(k * x - w * t)
    else
        return A * Math.sin(k * x + w * t)
}

function calcY(x, positivity = true) {// function to calculate the image of an x following the formula y(x)=A*sin(2*PI/wavelength*x)
    if(positivity)
        return A*Math.sin(k*x);
    else
        return A * Math.sin(-k * x);
}

function makeWave() {//create the animation using calcY to create a point
    let ym = (canvas.height / 2);
    for (let i = 0; i < canvas.width; i++) {
        ctx.strokeStyle = "white";
        ctx.moveTo(i, ym + calcY(i));
        ctx.lineTo(i + 1, ym + calcY(i) + 1);
    }
}

let flag = true;
function animateit() {
    canvas.width = canvas.width;
    canvas.height = canvas.height;
    let valor=0.2;
    
    if(flag){
        A += valor;
    }
    if(!flag){
        A -= valor;
        
    }
    if (Math.floor(A + valor) === 35){
        flag=false;
    }

    if (Math.floor(A - valor) === -35) {
        flag = true;
    }
    //All above is intended to simulate the oscillation up and down of a simple harmonic motion wave
    makeWave();
    ctx.stroke();
    requestAnimationFrame(animateit);
}
animateit();
