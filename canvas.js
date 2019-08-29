  //**************************//
 // Code by Esteban Ramírez  //
//**************************//
var canvas = document.querySelector('canvas');
 pixelRat=devicePixelRatio;
canvas.width = window.innerWidth * pixelRat;
canvas.height = window.innerHeight * pixelRat;
var c = canvas.getContext("2d");
c.imageSmoothingEnabled=true;

var mouse = {
    x: undefined,
    y: undefined
}
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * pixelRat;
    canvas.height = window.innerHeight * pixelRat;
});
window.addEventListener('mouseout',(event)=>{
    mouse.x=undefined;
    mouse.y=undefined;
})
window.addEventListener('mousemove', (event) => {   //Esta función es para interactuar con los circulos por la posicion en la que se encuentre el mouse
    mouse.x = event.x * pixelRat;
    mouse.y = event.y * pixelRat;
});

window.addEventListener('mousedown', (event) => {
    mouse.x = event.x * pixelRat;
    mouse.y = event.y *pixelRat;
    var y = mouse.y/pixelRat;
    var x = mouse.x/pixelRat;
    var dx = (Math.random() - Math.random()) * 2;
    var dy = (Math.random() - Math.random()) * 2;
    let pr = (Math.random() * 10);
    var rad = pr <= 2.5 ? pr : 1.5;
    if (circleArray.length<=Math.round(screen.width/10)) {
        circleArray.push(new Circle(x, y, dx, dy, rad)); 
    }
});
var canti = Math.round(screen.width/15);//cantidad de puntos
function Circle(x, y, dx, dy, rad) {
    this.x = x * pixelRat;
    this.y = y * pixelRat;
    this.dx = dx * pixelRat;
    this.dy = dy * pixelRat;
    this.rad = rad * pixelRat;
    this.draw = function () {
        c.beginPath();
        c.globalAlpha = 1;
        c.arc(this.x, this.y, this.rad, pixelRat, (Math.PI * 2)*pixelRat, false);
        c.fillStyle = "rgba(250,250,250,1)";
        c.fill();  
        c.save();
        c.closePath();
    }
    
    
    this.update = function () {
        let punto=this;
        
        
        if (punto.x + punto.rad >= canvas.width  || punto.x + punto.rad  <= 0) {
            punto.dx = -punto.dx;
        }
        if (punto.y + punto.rad >= canvas.height || punto.y + punto.rad  <= 0) {
            punto.dy = -punto.dy;
        }
        punto.x += punto.dx;
        punto.y += punto.dy;
        var rangeL= Math.sqrt(Math.pow((this.x - (this.x+100)),2)+Math.pow((this.y-(this.y+100)),2));
       
        
        var rangeM =250 * pixelRat;
        for (let index = 0; index < circleArray.length; index++) {
           
            if (punto.x - circleArray[index].x < rangeL && punto.x - circleArray[index].x > -rangeL &&
                punto.y - circleArray[index].y < rangeL && punto.y - circleArray[index].y > -rangeL) {
                var op = Math.abs(punto.x - circleArray[index].x);
                var opy = Math.abs(punto.y - circleArray[index].y);   
                let plusOne=(op+opy)/100;
                let opacidad =1;
                opacidad -=plusOne/2;
                c.beginPath();
                c.strokeStyle = 'rgba(255,255,255,' + Math.abs(opacidad)+')';
                c.globalAlpha = Math.abs(opacidad) ;  
                c.moveTo(circleArray[index].x, circleArray[index].y);
                c.lineTo(punto.x, punto.y);
                c.lineWidth=pixelRat;
                
                c.stroke();
                c.save();
                c.closePath();
            }
        }
        if (mouse.x - punto.x <= rangeM && mouse.x - punto.x >= -rangeM &&
            mouse.y - punto.y <= rangeM && mouse.y - punto.y >= -rangeM) {
            var opx = Math.abs(mouse.x - punto.x);
            var opy1 = Math.abs(mouse.y -punto.y);
            let plusOneM=(op+opy)/100;
            let opacidadM =1;
            opacidadM -=plusOneM/2;
            c.beginPath();
            c.strokeStyle = 'rgba(255,255,255,' + Math.abs(opacidadM) + ')';
            c.globalAlpha = Math.abs(opacidadM) ;  
            c.moveTo(punto.x, punto.y);
            c.lineTo(mouse.x, mouse.y);
            c.lineWidth =pixelRat;
            c.stroke();
            c.save();
            c.closePath();
        }
        punto.draw();
    }
}
var circleArray = [];
for (let index = 0; index < canti; index++) {
    var y = Math.random() * ((innerHeight - 8 * 2) + 8);
    var x = Math.random() * ((innerWidth - 8 * 2) + 8);
    var dx = (Math.random() * pixelRat - Math.random() * pixelRat) * pixelRat ;
    var dy = (Math.random() * pixelRat - Math.random() * pixelRat) * pixelRat ;
    let pr = (Math.random() * 10);
    var rad =  pr<= 2.5 ? pr : 1.5;
    circleArray.push(new Circle(x, y, dx, dy, rad));
}
function animateit() {
        canvas.width = canvas.width;
        canvas.height = canvas.height; 
       for (let index = 0; index < circleArray.length; index++) {
        circleArray[index].update(); 
    }
    requestAnimationFrame(animateit);
}
animateit();
