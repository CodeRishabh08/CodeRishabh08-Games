const htmlScore = document.querySelector('.score');
const highScore = JSON.parse(localStorage.getItem('snk'))
const htmlLevel = document.querySelector('.level');
document.querySelector('.highscr').innerText = highScore ? highScore : 0;
const cvs = document.getElementById('canvas');


cvs.width = 600;
cvs.height = 600;

const c = cvs.getContext('2d');

let x = 2;
let dir = 0;
const unitSize = 20
let hue = 0
let varColor = `hsl(${hue},100,50)`
let speed = 4
let snakeVelocity = { x: 0, y: 0 }
let snkLength = 5;
let particles = []
let colors = ['red', 'yellow', 'green', 'violet', 'indigo', 'blue', 'orange']
let snkArray = []
let frame = 0;
let score = 0;
let level = 1;


class Particle{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3;
        this.color = 'red';
        this.xv = Math.random() * (2 - (-2)) +(-2);
        this.yv = Math.random() * (2 - (-2)) +(-2);
        this.speed = 2;
        this.decVal = 0.06;
        this.dieVal = 0.5;
    }
    draw(){
        c.beginPath()
        c.fillStyle = this.color;
        c.arc(this.x,this.y,this.size,0,Math.PI * 2,false);
        c.fill();
        c.closePath()
    }
    update(){
        this.draw();
        this.x += this.xv;
        this.y += this.yv;
        this.size -= this.decVal;
    }
}

class Square {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    draw() {
        c.beginPath()
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.size, this.size)
        c.closePath()
    }
}

let rndX = Math.random() * 580
let rndY = Math.random() * 580
rndX -= rndX % 20
rndY -= rndY % 20

const snake = new Square(20, 20, unitSize, 'black')
const apple = new Square(rndX, rndY, unitSize, 'red')

function updateParticles(){
    particles.forEach((e,i) => {
        e.update()
        if(e.size < e.dieVal){
            particles.splice(i,1);
        }
    });
}

function explodeParticles(x,y,n){
    for(let i = 0; i < n; i++){
        particles.push(new Particle(x,y))
    }
}

function controlSnake(e) {
    switch (e.keyCode) {
        case 37:
            if(dir !== 3){
                snakeVelocity = { x: -1, y: 0 };
                dir = 1
            }
            break;
        case 38:
            if(dir!== 4){
                snakeVelocity = { x: 0, y: -1 };
                dir = 2
            }
            break;
        case 39:
            if(dir !== 1){
                snakeVelocity = { x: 1, y: 0 };
                dir = 3
            }
            break;
        case 40:
            if(dir !== 2){
                snakeVelocity = { x: 0, y: 1 };
                dir = 4;
            }
            break;
    }
}

function drawSnkTail(){
    for(let i = 0; i < snkArray.length; i++){
        snkArray[i].draw()
    }
}

function colliding(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.size &&
        rect1.x + rect1.size > rect2.x &&
        rect1.y < rect2.y + rect2.size &&
        rect1.y + rect1.size > rect2.y) {
        return true;
    } else {
        return false;
    }
}

function restartAppleXY() {
    let rndX = Math.random() * 580
    let rndY = Math.random() * 580
    rndX -= rndX % 20
    rndY -= rndY % 20

    apple.x = rndX;
    apple.y = rndY;
}

function updateSnake() {
    snake.draw();
    snake.x += snakeVelocity.x * speed;
    snake.y += snakeVelocity.y * speed;

    if ((snake.x < -20)) {
        snake.x = cvs.width - 20;
    }
    else if (snake.x + snake.size > cvs.width) {
        snake.x = 0;
    }

    if ((snake.y < -20)) {
        snake.y = cvs.height - 20;
    }
    else if (snake.y + snake.size > cvs.height) {
        snake.y = 0;
    }
}

function checkGameOver(){
    let a = false;
    for(let i = 0; i < snkArray.length - 10; i++){
        e = snkArray[i]
        if(colliding(snake,e)){
            a = true;
        }
    }
    return a;
}

function write(x,y,text,font,color){
    c.font = font;
    c.fillStyle = color;
    c.textAlign = 'center';
    c.fillText(text,x,y);
}

function gameOver(animationFrame){
    cancelAnimationFrame(animationFrame)


    c.beginPath()
    c.fillStyle = 'rgba(0,0,0,0.9)'
    c.fillRect(0, 0, cvs.width, cvs.height)
    c.closePath()

    if (highScore < score){
        localStorage.setItem('snk',JSON.stringify(score))
    }

    write(cvs.width/2,(cvs.height / 2) - 50, 'Game Over', '30px Comic Sans MS', 'red')
    write(cvs.width/2,(cvs.height / 2) + 50, 'F5 to Restart', '30px Comic Sans MS', 'red')
}

function animate() {
    let animationFrame = requestAnimationFrame(animate);
    c.beginPath()
    c.fillStyle = 'rgba(0,0,0,0.6)'
    c.fillRect(0, 0, cvs.width, cvs.height)
    c.closePath()
    apple.draw()
    updateParticles()
    drawSnkTail()
    updateSnake()

    if(colliding(snake,apple)){
        explodeParticles(apple.x + (apple.size / 2), apple.y + (apple.size / 2), 50)
        restartAppleXY();
        snkLength += x;
        score += 100;
        htmlScore.innerText = score;

        if(score >= 1000){
            // speed = 6;
            level = 2;
        }
        if(score >= 2000){
            // speed = 8;
            level = 3;
        }
        if(score >= 3000){
            // speed = 10;
            level = 4;
        }
        if(score >= 4000){
            level = 5;
        }
        if(score >= 5000){
            level = 6;
        }
        if (speed < 8){
            speed += 0.10
        }
        htmlLevel.innerText = level
    }
    
    snkArray.push(new Square(snake.x,snake.y,unitSize,snake.color))
    
    if(snkArray.length > snkLength){
        snkArray.splice(0,1)
    }
    
    varColor = `hsl(${hue},100%,50%)`
    snake.color = varColor;
    
    hue += 2;
    frame ++;

    if(checkGameOver() == true){
        console.log("game over");
        gameOver(animationFrame)
    }
}

addEventListener('keydown', controlSnake)
animate()