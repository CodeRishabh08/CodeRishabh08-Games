const canvas = document.querySelector('.canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const projectiles = [];
const enemies = [];
const particles = [];
const projectileSpeed = 20;
const damage = 15;
const deathRange = 14

let frame = 0;
let hue = 0;
let ESValue = 40
let score = 0;
let hp = 100;

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.speed = projectileSpeed;
    }
    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        c.fill();
        c.closePath();
    }
    update() {
        this.draw()
        this.x += this.velocity.x * this.speed;
        this.y += this.velocity.y * this.speed;
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3;
        this.color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
        this.velocity = {
            x: Math.random() * (5 - (-5)) + (-5),
            y: Math.random() * (5 - (-5)) + (-5)
        };
        this.speed = Math.random() * 3;
        this.dcreaseVal = 0.05;
    }
    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        c.fill();
        c.closePath();
    }
    update() {
        this.draw();
        this.x += this.velocity.x * this.speed;
        this.y += this.velocity.y * this.speed;
        this.radius -= this.dcreaseVal;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.speed = 8;
    }
    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        c.fill();
        c.closePath();
    }
    update() {
        this.draw();
        this.x += this.velocity.x * this.speed;
        this.y += this.velocity.y * this.speed;
    }
}


class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        c.fill();
        c.closePath();
    }
}

function explodeParticles(x, y, n) {
    for (let i = 0; i < n; i++) {
        particles.push(new Particle(x, y))
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

function updateParticles() {
    particles.forEach((pr, prInd) => {
        pr.update();
        if (pr.radius < 0.6) {
            particles.splice(prInd, 1);
        }
    });
}

function gameOver(animID){
    cancelAnimationFrame(animID);
    let highScore = JSON.parse(localStorage.getItem("CDF"));
    if(highScore < score){
        localStorage.setItem("CDF", JSON.stringify(score));
        highScore = score;
    }
    c.beginPath();
    c.fillStyle = "rgba(0,0,0,0.8)";
    c.fillRect(0,0,canvas.width,canvas.height);
    c.closePath();
    filText("Game Over, F5 to Restart", "red", "50px Comic Sans MS", centerX, centerY - 60);
    filText(`Your Score : ${score}`, "red", "50px Comic Sans MS", centerX, centerY);
    filText(`Your High Score : ${highScore}`, "red", "50px Comic Sans MS", centerX, centerY + 60);
}

function spawnEnemy() {
    const rad = Math.random() * (45 - 15) + 15;
    let x, y;
    if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - rad : canvas.width + rad;
        y = Math.random() * canvas.height;
    } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - rad : canvas.height + rad;
    }
    const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
    const xdif = centerX - x;
    const ydif = centerY - y;
    const angle = Math.atan2(ydif, xdif);
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    enemies.push(new Enemy(x, y, rad, color, velocity));
}
function updateEnemies() {
    enemies.forEach((e, ind) => {
        e.update()
        projectiles.forEach((p, pInd) => {
            if (Math.hypot(Math.abs(e.x - p.x), Math.abs(e.y - p.y)) < e.radius + p.radius) {
                e.radius -= damage;
                projectiles.splice(pInd, 1);
                explodeParticles(e.x, e.y, 150);
                score += 250;
            }
        });
        if (e.radius < deathRange) {
            enemies.splice(ind, 1);
            score += 250;
        }
        else if(Math.hypot(Math.abs(e.x - player.x), Math.abs(e.y - player.y)) < e.radius + player.radius){
            hp -= e.radius;
            hp = Math.floor(hp)
            enemies.splice(ind,1);
        }
    });
}

function shoot(e) {
    const xdif = e.clientX - centerX;
    const ydif = e.clientY - centerY;
    const angle = Math.atan2(ydif, xdif);
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    projectiles.push(new Projectile(centerX, centerY, 5, "white", velocity));
}

function updateProjectiles() {
    projectiles.forEach((p,ind) => {
        p.update();
        if(
            p.x < 0 ||
            p.x > canvas.width ||
            p.y < 0 || 
            p.y > canvas.height
        ){
            projectiles.splice(ind,1);
        }
    });
}

const player = new Player(centerX, centerY, 15, 'purple');



function animate() {
    let animID = requestAnimationFrame(animate);
    c.beginPath();
    c.fillStyle = "rgba(0,0,0,0.3)";
    c.rect(0, 0, canvas.width, canvas.height);
    c.fill();
    c.closePath();
    player.color = `hsl(${hue}, 100%, 50%)`
    player.draw();
    filText(`Score : ${score}`,`hsl(${hue}, 50%, 50%)`,"30px Comic Sans MS", 100, 100);
    filText(`Health : ${hp}`,`hsl(${hue}, 50%, 50%)`,"30px Comic Sans MS", 100, 70);
    if (frame % 40 == 0) {
        spawnEnemy()
    }
    updateEnemies();
    updateProjectiles();
    updateParticles();
    frame++;
    hue++;
    if(hp <= 0){
        gameOver(animID );
    }
}

animate()

addEventListener("click", shoot);