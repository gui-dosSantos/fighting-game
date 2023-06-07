const canvas = document.querySelector('#game'); //setting up the main canvas
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const enter = document.getElementById('enter') //canvas for the enter button at the "start" screen
const e = enter.getContext('2d')
enter.width = 117
enter.height = 108

const backspace = document.getElementById('backspace')  //canvas for the backspace button at the "gameover" screen
const b = backspace.getContext('2d')
backspace.width = 165
backspace.height = 48

const gravity = 0.7;
const hud = document.getElementById('hud')

const floor = 500; //since the floor on the background is not on the very bottom of the canvas, this const is passing the real floor position on the y-axis

// c.fillRect(0, 0, canvas.width, canvas.height) //paints the background

//maps the keys being pressed
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    arrowLeft: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    }
}

//draws the background
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/background.png",
    context: 'c'
})

//draws the ENTER button on the "start" screen
const enterBtn = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/keycaps/ENTER.png",
    totalFrames: 3,
    scale: 3,
    offset: {
        x: 1,
        y: 0
    },
    context: 'e'
})

//draws the backspace button on the "gameover" screen
const backspaceBtn = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/keycaps/BACKSPACE.png",
    totalFrames: 2,
    scale: 3,
    offset: {
        x: 0,
        y: 0
    },
    context: 'b'
})

//draws the animated shop
const shop = new Sprite({
    position: {
        x: 670, //670
        y: 119
    },
    imageSrc: "./img/shop.png",
    scale: 2.97,
    totalFrames: 6,
    context: 'c'
})

//draws the samurai sprite at the "start" screen without creating a Fighter so that it stays in place on the y-axis without having to compensate for the gravity
const samuraiStart = new Sprite({
    position: {
        x: 158,
        y: 100
    },
    imageSrc: "./img/samurai/faceRight/Idle.png",
    scale: 2.3,
    offset: {
        x: 205,
        y: 162
    },
    totalFrames: 8,
    context: 'c'
})

//draws the kenji sprite at the "start" screen without creating a Fighter so that it stays in place on the y-axis without having to compensate for the gravity
const kenjiStart = new Sprite({
    position: {
        x: 815,
        y: 100
    },
    imageSrc: "./img/kenji/faceLeft/Idle.png",
    scale: 2.3,
    offset: {
        x: 200,
        y: 176
    },
    totalFrames: 4,
    context: 'c'
})

//creates the player
const player = new Fighter({
    position: {
        x: 158,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/samurai/faceRight/Idle.png",
    scale: 2.3,
    offset: {
        x: 205,
        y: 162
    },
    sprites: {
        right: {
            idle: {
                imageSrc: "./img/samurai/faceRight/Idle.png",
                totalFrames: 8
            },
            run: {
                imageSrc: "./img/samurai/faceRight/Run.png",
                totalFrames: 8
            },
            jump: {
                imageSrc: "./img/samurai/faceRight/Jump.png",
                totalFrames: 2
            },
            fall: {
                imageSrc: "./img/samurai/faceRight/Fall.png",
                totalFrames: 2
            },
            attack1: {
                imageSrc: "./img/samurai/faceRight/Attack1.png",
                totalFrames: 6
            },
            takeHit: {
                imageSrc: "./img/samurai/faceRight/Take Hit.png",
                totalFrames: 4
            },
            death: {
                imageSrc: "./img/samurai/faceRight/Death.png",
                totalFrames: 6
            }
        }, 
        left: {
            idle: {
                imageSrc: "./img/samurai/faceLeft/Idle.png",
                totalFrames: 8
            },
            run: {
                imageSrc: "./img/samurai/faceLeft/Run.png",
                totalFrames: 8
            },
            jump: {
                imageSrc: "./img/samurai/faceLeft/Jump.png",
                totalFrames: 2
            },
            fall: {
                imageSrc: "./img/samurai/faceLeft/Fall.png",
                totalFrames: 2
            },
            attack1: {
                imageSrc: "./img/samurai/faceLeft/Attack1.png",
                totalFrames: 6
            },
            takeHit: {
                imageSrc: "./img/samurai/faceLeft/Take Hit.png",
                totalFrames: 4
            },
            death: {
                imageSrc: "./img/samurai/faceLeft/Death.png",
                totalFrames: 6
            }
        }
    },
    context: 'c'
});

//creates the enemy
const enemy = new Fighter({
    position: {
        x: 815,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/kenji/faceRight/Idle.png",
    scale: 2.3,
    offset: {
        x: 200,
        y: 176
    },
    sprites: {
        right: {  
            idle: {
                imageSrc: "./img/kenji/faceRight/Idle.png",
                totalFrames: 4
            },
            run: {
                imageSrc: "./img/kenji/faceRight/Run.png",
                totalFrames: 8
            },
            jump: {
                imageSrc: "./img/kenji/faceRight/Jump.png",
                totalFrames: 2
            },
            fall: {
                imageSrc: "./img/kenji/faceRight/Fall.png",
                totalFrames: 2
            },
            attack1: {
                imageSrc: "./img/kenji/faceRight/Attack1.png",
                totalFrames: 4
            },
            takeHit: {
                imageSrc: "./img/kenji/faceRight/Take hit.png",
                totalFrames: 3
            },
            death: {
                imageSrc: "./img/kenji/faceRight/Death.png",
                totalFrames: 7
            }
        },
        left: {  
            idle: {
                imageSrc: "./img/kenji/faceLeft/Idle.png",
                totalFrames: 4
            },
            run: {
                imageSrc: "./img/kenji/faceLeft/Run.png",
                totalFrames: 8
            },
            jump: {
                imageSrc: "./img/kenji/faceLeft/Jump.png",
                totalFrames: 2
            },
            fall: {
                imageSrc: "./img/kenji/faceLeft/Fall.png",
                totalFrames: 2
            },
            attack1: {
                imageSrc: "./img/kenji/faceLeft/Attack1.png",
                totalFrames: 4
            },
            takeHit: {
                imageSrc: "./img/kenji/faceLeft/Take hit.png",
                totalFrames: 3
            },
            death: {
                imageSrc: "./img/kenji/faceLeft/Death.png",
                totalFrames: 7
            }
        }
    },
    context: 'c'
});

let animationFrame;
//makes the game run
function animate() {
    animationFrame = window.requestAnimationFrame(animate);//makes the function call itself and stores the animation id on a global variable so that it can be killed when the game restarts
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height); //re-renders the canvas background
    background.update(); //renders the background
    shop.update(); //renders the shop
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update(); //renders the player
    enemy.update(); //renders the enemy

    //player movement
    if((keys.a.pressed && keys.d.pressed) || (!keys.a.pressed && !keys.d.pressed)){
        player.velocity.x = 0;
    } else if(keys.d.pressed){
        player.velocity.x = 5;
    } else if(keys.a.pressed) {
        player.velocity.x = -5;
    }
    if(player.isAlive){ //avoids having a dead player changing the sprite orientation
        determineSprite(player)
    }

    //enemy movement
    if((keys.arrowLeft.pressed && keys.arrowRight.pressed) || (!keys.arrowLeft.pressed && !keys.arrowRight.pressed)){
        enemy.velocity.x = 0;
    } else if(keys.arrowRight.pressed){
        enemy.velocity.x = 5;
    } else if(keys.arrowLeft.pressed) {
        enemy.velocity.x = -5;
    }
    if(enemy.isAlive){ //avoids having a dead player changing the sprite orientation
        determineSprite(enemy);
    }

    //player attack collision
    if(
        rectangularCollision({rectangle1: player, rectangle2: enemy}) && 
        player.isAttacking && 
        player.canHit && 
        gameRunning && 
        player.frame === 4
    ) {  
            player.canHit = false //adds a cooldown between attacks
            enemy.takeHit()
            gsap.to('#enemyHealth', {
                width: `${enemy.health}%`
            })
    }

    //enemy attack collision
    if(
        rectangularCollision({rectangle1: enemy, rectangle2: player}) && 
        enemy.isAttacking && 
        enemy.canHit && 
        gameRunning && 
        enemy.frame === 2
    ) {
            enemy.canHit = false //adds a cooldown between attacks
            player.takeHit()
            gsap.to('#playerHealth', {
                width: `${player.health}%`
            })
    }

    //decides whether the players can jump or not
    if((verticalPlayerCollision() && player.position.y + player.height <= enemy.position.y) || player.position.y + player.height >= floor) {
        player.canJump = true
    } else if(player.velocity.y < 0) {
        player.canJump = false
    }
    if((verticalPlayerCollision() && enemy.position.y + enemy.height <= player.position.y) || enemy.position.y + enemy.height >= floor) {
        enemy.canJump = true
    } else if(enemy.velocity.y < 0) {
        enemy.canJump = false
    }

    //decides the direction that the player is facing depending on the opponent's location
    if(player.position.x > enemy.position.x) {
        player.attackBox.offset.x = -160;
        enemy.attackBox.offset.x = 0;
        player.faceRight = false;
        enemy.faceRight = true;
    } else {
        player.attackBox.offset.x = 0;
        enemy.attackBox.offset.x = -160;
        player.faceRight = true;
        enemy.faceRight = false;
    }

    //game over by health reaching 0
    if(player.health <= 0 || enemy.health <= 0){
        if(gameRunning){
            gameOver({player, enemy, timerId});
        }
    }
}

window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = true;
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case 'w':
            player.jump()
            break;
        case ' ':
            player.attack();
            break;
        case 'ArrowRight':
            keys.arrowRight.pressed = true;
            break;
        case 'ArrowLeft':
            keys.arrowLeft.pressed = true;
            break;
        case 'ArrowUp':
            enemy.jump()
            break;
        case 'Enter':
            if(gameRunning || gameState === 'end'){
                enemy.attack();
            } else {
                gameRunning = true;//start the game
            }
            break;
        case 'Backspace':
            if(gameState === 'end'){
                gameState = 'start'
                cancelAnimationFrame(animationFrame)
                restart();
            }
            break;
    }
})
window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'ArrowRight':
            keys.arrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.arrowLeft.pressed = false;
            break;
    }
})

function runGame() {
    if(gameRunning){
        clearInterval(buttonAnimations)
        document.getElementById('start').style.display = 'none'
        hud.style.display = 'flex'
        decreaseTimer();
        animate();
    } else {
        requestAnimationFrame(runGame)
        background.update();
        shop.update();
        c.fillStyle = 'rgba(0, 0, 0, 0.5)'
        c.fillRect(0, 0, canvas.width, canvas.height)
        samuraiStart.update();
        kenjiStart.update()
    }
}


let buttonAnimations;
function start() {
    clearInterval(buttonAnimations)
    buttonAnimations = setInterval(() => {
        e.clearRect(0, 0, enter.width, enter.height)
        enterBtn.update();
    }, 50)
    runGame()
}


function restart(){
    document.getElementById('gameOver').style.display = 'none'
    timer = 60
    document.getElementById('hud').style.display = 'none'
    document.getElementById('start').style.display = 'inline'
    document.getElementById('playerHealth').style.width = '100%'
    document.getElementById('enemyHealth').style.width = '100%'
    clearInterval(buttonAnimations)
    player.restart();
    enemy.restart();
    start();
}

start()