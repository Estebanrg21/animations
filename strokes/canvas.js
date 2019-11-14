//**************************//
// Code by Esteban Ramírez  //
//**************************//
function Animacion(i) {   
var canvas =i;
var pixelRat = devicePixelRatio;
canvas.width = window.innerWidth * pixelRat;
canvas.height = window.innerHeight * pixelRat;
var c = canvas.getContext("2d");
c.imageSmoothingEnabled = true;
    var circleArray = [];
    var canti = Math.round((canvas.width) / 15);
    let rand = (230 * (230 + 180) / 2) / 250;
    var rangeL = canti >= 100 && canti < 200 ? rand : (canti < 100) && (canti * 5) < 180 ? canti * 5 : canti > 60 && canti < 100 ? canti * 2.7 : canti * 0.9 > 200 ? canti * 0.35 : canti * 0.9;
    rangeL = canvas.width > 900 && pixelRat < 2 ? canvas.width > 900 && pixelRat >= 2?200:rangeL : rangeL * 4;
    var rangeM = rangeL;  
var mouse = {
    x: undefined,
    y: undefined
}
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * pixelRat;
    canvas.height = window.innerHeight * pixelRat;
    canvas.width = window.innerWidth * pixelRat;
    canvas.height = window.innerHeight * pixelRat;
    var canti = Math.round((canvas.width) / 15);
    let rand = (230 * (230 + 180) / 2) / 250;
    var rangeL = canti >= 100 && canti < 200 ? rand : (canti < 100) && (canti * 5) < 180 ? canti * 5 : canti > 60 && canti < 100 ? canti * 2.7 : canti * 0.9 > 200 ? canti * 0.35 : canti * 0.9;
    rangeL = canvas.width > 900 && pixelRat>1? rangeL*4 : rangeL ;
  
    circleArray = [];
    for (let index = 0; index < canti; index++) {
        var y = Math.random() * ((window.innerHeight - 8 * 2) + 8);
        var x = Math.random() * ((window.innerWidth - 8 * 2) + 8);
        var dx = (Math.random() - Math.random()) * pixelRat;
        var dy = (Math.random() - Math.random()) * pixelRat;
        var rad = Math.floor(Math.random() * ((3) - pixelRat)) + pixelRat;
        circleArray.push(new Circle(x, y, dx, dy, rad));
    }
});
window.addEventListener('mouseout', (event) => {
    mouse.x = undefined;
    mouse.y = undefined;
})
canvas.addEventListener('mousemove', (event) => {   
    mouse.x = event.x * pixelRat;
    mouse.y = event.y * pixelRat;
});

canvas.addEventListener('mousedown', (event) => {
    mouse.x = event.x * pixelRat;
    mouse.y = event.y * pixelRat;
    var y = mouse.y / pixelRat;
    var x = mouse.x / pixelRat;
    var dx = (Math.random() - Math.random()) * 2;
    var dy = (Math.random() - Math.random()) * 2;
    let pr = (Math.random() * 10);
    var rad = pr <= 2.5 ? pr : 1.5;
    if (circleArray.length <= Math.round(window.screen.width / 10)) {
        circleArray.push(new Circle(x, y, dx, dy, rad));
    }
});

function Circle(x, y, dx, dy, rad) {
    
    this.x = x * pixelRat;
    this.y = y * pixelRat;
    this.dx = dx * pixelRat;
    this.dy = dy * pixelRat;
    this.rad = rad * pixelRat;
    this.draw = function () {
        c.beginPath();
        c.globalAlpha = 1;
        c.arc(this.x, this.y, this.rad, pixelRat, (Math.PI * 2) * pixelRat, false);
        c.fillStyle = "white";
        c.fill();
        c.save();
        c.closePath();
    }
    this.update = function () {
        if (this.x + this.rad >= canvas.width || this.x + this.rad <= 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.rad >= canvas.height || this.y + this.rad <= 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
           
         for (let index = 0; index < circleArray.length; index++) {
             const punto2 = circleArray[index];
            if (this.x - punto2.x < rangeL && this.x - punto2.x > -rangeL &&
                this.y - punto2.y < rangeL && this.y - punto2.y > -rangeL) {
                let factor = ((Math.abs((this.x) - (punto2.x))) + (Math.abs((this.y) - (punto2.y)))) / rangeL*1.05;
                let opacidad = (1 - factor) < 0 ? 0 : 1 - factor;
                c.beginPath();
                c.strokeStyle = 'rgba(255,255,255,' + Math.abs(opacidad) + ')';
                c.moveTo(this.x, this.y);
                c.lineTo(punto2.x, punto2.y);
                c.lineWidth = opacidad*pixelRat;
                c.stroke();
                c.closePath();
            }
        }
        if (mouse.x - this.x <= rangeM && mouse.x - this.x >= -rangeM &&
            mouse.y - this.y <= rangeM && mouse.y - this.y >= -rangeM) {
            let factorM = ((Math.abs((this.x) - (mouse.x))) + (Math.abs((this.y) - (mouse.y)))) / rangeL * 0.5 ;
            let opacidadM = (1 - factorM) < 0 ? 0 : 1 - factorM;
            c.beginPath();
            c.strokeStyle = 'rgba(255,255,255,' + Math.abs(opacidadM) + ')';
            c.globalAlpha = Math.abs(opacidadM);
            c.moveTo(mouse.x, mouse.y);
            c.lineTo(this.x, this.y);
            c.lineWidth = pixelRat;
            c.stroke();
            c.save();
            c.closePath();
        }
        this.draw();
    }
}

for (let index = 0; index < canti; index++) {
    var y = Math.random() * ((window.innerHeight - 8 * 2) + 8);
    var x = Math.random() * ((window.innerWidth - 8 * 2) + 8);
    var dx = (Math.random()  - Math.random() ) * pixelRat;
    var dy = (Math.random()  - Math.random() ) * pixelRat;
    var rad = Math.floor(Math.random() * ((3) - pixelRat)) + pixelRat;
    circleArray.push(new Circle(x, y, dx, dy, rad));
}
function animateit() {
    canvas.width = canvas.width;
    canvas.height = canvas.height;
    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
     
    }
    requestAnimationFrame(animateit);
}
animateit();
}
