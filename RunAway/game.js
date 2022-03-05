const canvas = document.querySelector('.canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth - 4;
canvas.height = innerHeight - 4;

const bullets = [];
const enemies = [];
const particles = [];
const enemiesSpawnPos = [
    {x : Math.floor(Math.random() * ((canvas.width - 20) - canvas.width / 2) + canvas.width/2), y : Math.floor(Math.random() * (canvas.height - 20))},  
    {x : Math.floor(Math.random() * ((canvas.width - 20) - canvas.width / 2) + canvas.width/2), y : Math.floor(Math.random() * (canvas.height - 20))},  
    {x : Math.floor(Math.random() * ((canvas.width - 20) - canvas.width / 2) + canvas.width/2), y : Math.floor(Math.random() * (canvas.height - 20))},  
    {x : Math.floor(Math.random() * ((canvas.width - 20) - canvas.width / 2) + canvas.width/2), y : Math.floor(Math.random() * (canvas.height - 20))}  
]

let score = 0;
let bulNum = 10;
let multiColor = "";
let hue = 0;
let enemySpawnNum = 2;
let pSpeed = 8;
let eSpeed = 6;

class Particle{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = Math.random() * (3 - 1) + 1;
        this.color = `hsl(${Math.random() * 361}, 100%, 50%)`;
        this.velocity = {
            x : Math.random() * (5 - (-5)) +(-5), 
            y : Math.random() * (5 - (-5)) +(-5), 
        }
        this.speed = Math.random() * 2;
        this.decreaseValue = 0.02;
    }
    draw(){
        c.beginPath()
        c.fillStyle = this.color;
        c.fillRect(this.x,this.y,this.size,this.size);
        c.closePath();
    }
    update(){
        this.draw()
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.size -= this.decreaseValue;
    }
}

class Rect{
    constructor(x,y,size,color,velocity, speed){
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
        this.speed = speed;
        this.id = Math.random() < 0.5 ? 1 : 0;
    }
    draw(){
        c.beginPath();
        c.fillStyle = this.color;
        c.fillRect(this.x,this.y,this.size,this.size);
        c.closePath();
    }
    update(){
        this.draw();
        this.x += this.velocity.x * this.speed;
        this.y += this.velocity.y * this.speed;
        this.centerX = this.x + (this.size / 2);
        this.centerY = this.y + (this.size / 2);
    }
}

const player = new Rect(40,canvas.height-40,20,"green",{x : 0, y : 0}, pSpeed);
const diamond = new Rect(Math.random() * (canvas.width - 10), Math.random() * (canvas.height - 10), 14, "azure", {}, 0)
function handleEvent(e){
    switch(e.keyCode){
        case 37:
            player.velocity.x = -1;
            player.velocity.y = 0;
            break;
        case 38:
            player.velocity.x = 0;
            player.velocity.y = -1;
            break;
        case 39:
            player.velocity.x = 1;
            player.velocity.y = 0;
            break;
        case 40:
            player.velocity.x = 0;
            player.velocity.y = 1;
            break;
    }
    switch(e.keyCode){
        case 65:
            player.velocity.x = -1;
            player.velocity.y = 0;
            break;
        case 87:
            player.velocity.x = 0;
            player.velocity.y = -1;
            break;
        case 68:
            player.velocity.x = 1;
            player.velocity.y = 0;
            break;
        case 83:
            player.velocity.x = 0;
            player.velocity.y = 1;
            break;
    }
}

function algo1(enemy){
    const xDif = Math.abs(enemy.x - player.x);
    const yDif = Math.abs(enemy.y - player.y);
    if (xDif > yDif) {
        if (player.x < enemy.x) {
            enemy.velocity.x = -1;
            enemy.velocity.y = 0;
        } else {
            enemy.velocity.x = 1;
            enemy.velocity.y = 0;
        }
    }
    else if(yDif > xDif){
        if (player.y < enemy.y) {
            enemy.velocity.y = -1;
            enemy.velocity.x = 0;
        } else {
            enemy.velocity.y = 1;
            enemy.velocity.x = 0;
        }
    }
    return enemy;
}

function algo2(enemy){
    const xDif = Math.abs(enemy.x - player.x);
    const yDif = Math.abs(enemy.y - player.y);
    if (xDif < yDif) {
        if (player.x < enemy.x) {
            enemy.velocity.x = -1;
            enemy.velocity.y = 0;
        } else {
            enemy.velocity.x = 1;
            enemy.velocity.y = 0;
        }
        if(player.x == enemy.x){
            if (player.y < enemy.y) {
                enemy.velocity.y = -1;
                enemy.velocity.x = 0;
            } else {
                enemy.velocity.y = 1;
                enemy.velocity.x = 0;
            }
        }
    }
    else if(yDif < xDif){
        if (player.y < enemy.y) {
            enemy.velocity.y = -1;
            enemy.velocity.x = 0;
        } else {
            enemy.velocity.y = 1;
            enemy.velocity.x = 0;
        }
        if(player.y == enemy.y){
            if (player.x < enemy.x) {
                enemy.velocity.x = -1;
                enemy.velocity.y = 0;
            } else {
                enemy.velocity.x = 1;
                enemy.velocity.y = 0;
            }
        }
    }
    return enemy;
}

function explodeParticles(x,y,n){
    for(let i = 0; i < n; i ++){
        particles.push(new Particle(x,y));
    }
}

function diamondCollision(){
    if(isColliding(diamond,player)) { 
       diamond.x = Math.random() * (canvas.width - 10);
       diamond.y = Math.random() * (canvas.height - 10)
       spawnEnemies(enemySpawnNum);
       bulNum < 5 ? bulNum = 5 : bulNum *= 2;
       score += 250;
     }
}

function filText(txt, color, font, x, y) {
    c.beginPath()
    c.font = font;
    c.fillStyle = color;
    c.textAlign = "center";
    c.fillText(txt, x, y);
    c.closePath()
}

function shoot(e){
    if(bulNum > 0){
        const xdif = e.clientX - player.centerX;
        const ydif = e.clientY - player.centerY;
        const angle = Math.atan2(ydif,xdif);
        const velocity = {
            x : Math.cos(angle),
            y : Math.sin(angle)
        };
        bullets.push(new Rect(player.centerX, player.centerY, 10, "violet", velocity, 25));
        bulNum --;
    }
}

function updateParticles(){
    particles.forEach((p,i)=> {
        p.update()
        if(p.size < 0.5){
            particles.splice(i,1);
        }
    });
}

function updateBullets(){
    bullets.forEach((b,bInd) => {
        b.update();
        if(
            b.x < 0 ||
            b.y < 0 ||
            b.x > canvas.width ||
            b.y > canvas.height 
        ){
            bullets.splice(bInd,1);
        }
    });
}

function isColliding(rect1,rect2){
    if (rect1.x < rect2.x + rect2.size &&
        rect1.x + rect1.size > rect2.x &&
        rect1.y < rect2.y + rect2.size &&
        rect1.y + rect1.size > rect2.y) {
         return true;
     }else{
         return false;
     }
}

function spawnEnemies(n){
    let temp;
    for(let i = 1; i <= n; i++){
        temp = enemiesSpawnPos[i % 4];
        enemies.push(new Rect(temp.x, temp.y, 20, "red", {x : 1, y : 1}, eSpeed))
    }
}

function updateEnemies(animId){
    enemiesSpawnPos.forEach(esp => {
        c.beginPath();
        c.strokeStyle = "yellow";
        c.strokeRect(esp.x,esp.y,20,20)
    });
    enemies.forEach((e,eInd) => {
        e.update();
        if(e.id == 0){
            enemies[eInd] = algo1(enemies[eInd]);
        }else{
            enemies[eInd] = algo2(enemies[eInd]);
            e.color = "orange"
        }
        if(isColliding(e,player)){
            gameOver(animId);
        }

        bullets.forEach((b,bInd) => {
            if(isColliding(b,e)){
                enemies.splice(eInd,1);
                bullets.splice(bInd,1);
                explodeParticles(e.centerX,e.centerY,50)
                score += 100;
            }          
        });
    });
}
function changeEnemyRate(){
    if(score > 8000){
        enemySpawnNum = 10;
        pSpeed = 11;
        eSpeed = 9;
    }else if(score > 7000){
        enemySpawnNum = 8;
        pSpeed = 11;
        eSpeed = 9;
    }else if(score > 6000){
        enemySpawnNum = 7
        pSpeed = 11;
        eSpeed = 9;
    }else if(score > 5000){
        enemySpawnNum = 6
        pSpeed = 11;
        eSpeed = 9;
    }
    else if(score > 4000){
        enemySpawnNum = 5
        pSpeed = 10;
        eSpeed = 8;
    }
    else if(score > 2000){
        enemySpawnNum = 4
        pSpeed = 10;
        eSpeed = 8;
    }
    else if(score > 500 ){
        enemySpawnNum = 3;
        pSpeed = 8;
        eSpeed = 6;
    }
}


function clampPlayer(){
    if(player.x < 0){
        player.x = 0;
    }
    if(player.y < 0){
        player.y = 0;
    }
    if(player.x > canvas.width - player.size){
        player.x = canvas.width - player.size;
    }
    if(player.y > canvas.height - player.size){
        player.y = canvas.height - player.size;
    }
}

function gameOver(animId){
    cancelAnimationFrame(animId);
    let highScore = JSON.parse(localStorage.getItem("rnAway"));
    if(highScore < score){
        localStorage.setItem('rnAway', JSON.stringify(score));
        highScore = score;
    }
    c.beginPath();
    c.fillStyle = "rgba(0,0,0,0.9)";
    c.fillRect(0,0,canvas.width,canvas.height);
    c.closePath();
    filText("Game Over", "red", "50px Comic Sans MS", canvas.width / 2, canvas.height / 2 - 70);
    filText("F5 to Restart", "red", "50px Comic Sans MS", canvas.width / 2, canvas.height / 2 );
    filText(`Your Score : ${score}`, 'orange', "40px Comic Sans MS", canvas.width / 2, canvas.height / 2 + 70)
    filText(`High Score : ${highScore}`, 'orange', "40px Comic Sans MS", canvas.width / 2, canvas.height / 2 + 120)
}

let animationId;
function animate(){
    animationId = requestAnimationFrame(animate);
    c.beginPath();
    c.fillStyle = "rgba(0,0,0,0.4)";
    c.fillRect(0,0,canvas.width,canvas.height);
    c.closePath();
    multiColor = `hsl(${hue},100%,50%)`;
    player.speed = pSpeed;
    bulNum > 200 ? bulNum = 200 : null;
    
    diamond.draw();
    player.update();
    player.color = multiColor
    
    updateBullets();
    updateParticles();
    clampPlayer();
    updateEnemies(animationId);
    diamondCollision();
    changeEnemyRate();
    
    filText(`Score: ${score}`, multiColor, "30px Comic Sans MS", 80, 30)
    filText(`Bullets: ${bulNum}`, multiColor, "30px Comic Sans MS",canvas.width /2, 30)
    filText(`Enemies: ${enemies.length}`, multiColor, "30px Comic Sans MS",canvas.width - 100, 30)
    
    hue ++;
}
spawnEnemies(4);
animate();
addEventListener('keydown',handleEvent)
addEventListener('click',shoot)