const canvas = document.querySelectorAll("canvas")[0],
    pixelRat = devicePixelRatio;
canvas.height = window.innerHeight * pixelRat;
canvas.width = window.innerWidth * pixelRat;
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;
let commonH = Math.floor(canvas.height / Math.floor(canvas.height * 0.02)),
    commonW = Math.floor(canvas.width / Math.floor(canvas.width * 0.02)),
    ym = (window.innerHeight / 2), xm = (window.innerWidth / 2),
    direccion = ["up", "down", "left", "right"], lines = [],
    tailLength = 300;
let topCont = (commonH + commonW) / 2,
    val = topCont * 0.003,//***
    cont = val;

/** Estructura del punto **
 * 
    x: punto de origen-X,
    y: punto de origen-Y,
    lastX:ultimo punto de origen-X,,
    lastY: ultimo punto de origen-X,
    dir: direccion actual,
    lastDirection:direccion pasada,
    latest:lista de puntos que simulan la linea,
    tailLength:cantidad de puntos en la lista,
    id: identificador del punto con respecto a una lista conteniendolo
 *
/************************/
function DotSub(x, y, op) {
    this.x = x;
    this.y = y;
    this.opacity = op;
}
function Dot(x, y, lastX, lastY, dir, lastDirection, latest, tailLength, id) {
    this.x = x;
    this.y = y;
    this.lastX = lastX;
    this.lastY = lastY;
    this.dir = dir;
    this.lastDirection = lastDirection;
    this.latest = latest;
    this.tailLength = tailLength;

    this.id = id;
    this.directionChooser = function directionChooser(dir, obj, bounds, limit = 1, val = 1) {//start directionChooser
        /*
        *
        * metodo que se base en la direccion actual 
        * de un objeto para determinar su impacto en las coordenadas
        * 
        */
        switch (dir) {
            case "right":
                if (!(Math.floor(Math.abs(obj.x - bounds.xmax)) <= limit)) {// i.e si el valor absoluto de la coordenada del objeto
                    obj.x += val;                                          // menos el margen es menor o igual al limite entonces edite la coordenada

                } else {
                    obj.x = bounds.xmin + limit + 1;

                }
                break;
            case "left":
                if (!(Math.floor(Math.abs(obj.x - bounds.xmin)) <= limit)) {
                    obj.x -= val;

                } else {
                    obj.x = bounds.xmax - limit - 1;
                }
                break;
            case "up":
                if (!(Math.floor(Math.abs(obj.y - bounds.ymin)) <= limit)) {
                    obj.y -= val;

                } else {
                    obj.y = bounds.ymax - limit - 1;
                }
                break;
            case "down":
                if (!(Math.floor(Math.abs(obj.y - bounds.ymax)) <= limit)) {
                    obj.y += val;

                } else {
                    obj.y = bounds.ymin + limit + 1;
                }
                break;
            default:
                break;
        }
    }//end directionChooser

    let firstTry = true;
    this.makeStroke = function makeStroke(cont) {//start makeStroke
        /*
        *
        * este metodo pinta las lineas y se basa en el contador "cont" 
        * para setear la nueva direccion de la linea una vez que dicho
        * contador llegue a su limite que es "topCont"
        * 
        */
        let direct = this.dir;
        if ((Math.floor(cont)) >= topCont -2 ) {
            let hdirect = direct;
            this.dir = direccion[Math.floor(Math.random() * 3)]
            direct = this.dir;
            if ((hdirect === "right" && direct === "left") || (hdirect === "left" && direct === "right")) {
                this.dir = ["up", "down"][Math.floor(Math.random())]
            }
            if ((hdirect === "up" && direct === "down") || (hdirect === "down" && direct === "up")) {
                this.dir = ["right", "left"][Math.floor(Math.random())]
            }
            direct = this.dir;
            this.lastDirection = hdirect;
            this.lastX = this.x;
            this.lastY = this.y;
            let lt = this.latest, cx = this.x, cy = this.y;

            for (let i = 0; i < this.tailLength; i++) {//este for establece las nuevas coordenas de cada punto en la lista de un punto
                const element = lt[i];

                compareDir(hdirect, () => { element.x = cx - i; element.y = cy; },
                    () => { element.x = cx + i; element.y = cy; },
                    () => { element.x = cx; element.y = cy + i; },
                    () => { element.x = cx; element.y = cy - i; }
                )
                element.opacity = (topCont * ((i * 100 / tailLength) / 100) / (topCont / val)) / val;
            }

            firstTry = false;
        }

        this.directionChooser(this.dir, this, { xmin: 0, xmax: canvas.width, ymin: 0, ymax: canvas.height }, 1, 1);

        let l = this.latest.length,
            breakX = (firstTry) ? this.x : this.lastX,
            breakY = (firstTry) ? this.y : this.lastY;
        for (let i = 0; i < l; i++) {
            const element = this.latest[i];
            let dir = this.lastDirection;
            if (element.x === breakX) {
                dir = this.dir;
            }
            if (element.y === breakY) {
                dir = this.dir;
            }
            this.directionChooser(dir, element, { xmin: 0, xmax: canvas.width, ymin: 0, ymax: canvas.height }, 1);//***
            ctx.moveTo(element.x, element.y);
            let op = 1 - element.opacity;
            ctx.fillStyle = "rgba(255,2,2," + op + ")";
            ctx.fillRect(element.x, element.y, 5, 5);

        }



    }//end makeStroke
}
function compareDir(p1, f1 = () => { }, f2 = () => { }, f3 = () => { }, f4 = () => { }) {
    /*
    *
    * este metodo usa cualquier parametro y compara su dirección, 
    * si ella es igual a alguna de las opciones entonces se ejecuta 
    * una funcion anonima pasada por parametro de acuerdo al orden de
    * las condicionales
    *
    */
    if (p1 === "right") { f1(); }
    if (p1 === "left") { f2(); }
    if (p1 === "up") { f3(); }
    if (p1 === "down") { f4(); }
}

function createLines(array) {//start createLines

    for (let i = 0; i < 40; i++) {
        let listTemp = [],
            dir1 = direccion[Math.floor(Math.random() * 3)], dir2 = "",
            x1 = Math.random() * (canvas.width),
            y1 = Math.random() * (canvas.height), lx, ly;
        if ((dir1 === "right") || (dir1 === "left")) {
            dir2 = ["up", "down"][Math.floor(Math.random())]
        }
        if ((dir1 === "up") || (dir1 === "down")) {
            dir2 = ["right", "left"][Math.floor(Math.random())]
        }
        for (let i = 0; i < tailLength; i++) {
            let ex, ey, op;
            compareDir(dir2, () => { ex = x1 - i; ey = y1; },
                () => { ex = x1 + i; ey = y1; },
                () => { ex = x1; ey = y1 + i; },
                () => { ex = x1; ey = y1 - i; }
            );
            op = (topCont * ((i * 100 / tailLength) / 100) / (topCont / val)) / val;
            listTemp.push(new DotSub(ex, ey, op));
        }

        lx = listTemp[listTemp.length - 1].x;
        ly = listTemp[listTemp.length - 1].y;
        array.push(new Dot(
            x1,
            y1,
            lx,
            ly, dir1,
            dir2,
            listTemp,
            tailLength,
            i
        ))

    }
}//start createLines

createLines(lines);

function animateit() {
    canvas.width = canvas.width;
    canvas.height = canvas.height;
    for (let i = 0; i < lines.length; i++) {
        const element = lines[i];
        element.makeStroke(cont);
    }

    if ((Math.floor(cont)) >= topCont - 2 ) {
        cont = val;

    } else {
        cont += val;
    }

    requestAnimationFrame(animateit);
}
animateit();

