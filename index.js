const canvas = document.querySelector('canvas'); 
const c = canvas.getContext('2d');
const gravity = 0.7;

canvas.width = 1024;
canvas.height = 576;

const floor = 500;

c.fillRect(0, 0, canvas.width, canvas.height) //paints the background

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
})

//draws the animated shop
const shop = new Sprite({
    position: {
        x: 670, //670
        y: 119
    },
    imageSrc: "./img/shop.png",
    scale: 2.97,
    totalFrames: 6
})

//creates the player
const player = new Fighter({
    position: {
        x: 200,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/samurai/Idle.png",
    scale: 2.3,
    offset: {
        x: 200,
        y: 132
    },
    sprites: {
        idle: {
            imageSrc: "./img/samurai/Idle.png",
            totalFrames: 8
        },
        run: {
            imageSrc: "./img/samurai/Run.png",
            totalFrames: 8
        },
        jump: {
            imageSrc: "./img/samurai/Jump.png",
            totalFrames: 2
        },
        fall: {
            imageSrc: "./img/samurai/Fall.png",
            totalFrames: 2
        }
    }
});

//creates the enemy
const enemy = new Fighter({
    position: {
        x: 800,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue'
});


decreaseTimer();

//makes the game run
function animate() {
    window.requestAnimationFrame(animate);//makes the function call itself
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height); //re-renders the canvas background
    background.update(); //renders the background
    shop.update(); //renders the shop
    player.update(); //renders the player
    // enemy.update(); //renders the enemy

    //player movement
    if((keys.a.pressed && keys.d.pressed) || (!keys.a.pressed && !keys.d.pressed)){
        player.velocity.x = 0;
    } else if(keys.d.pressed){
        player.velocity.x = 5;
    } else if(keys.a.pressed) {
        player.velocity.x = -5;
    }
    determineSprite(player)

    //enemy movement
    if((keys.arrowLeft.pressed && keys.arrowRight.pressed) || (!keys.arrowLeft.pressed && !keys.arrowRight.pressed)){
        enemy.velocity.x = 0;
    } else if(keys.arrowRight.pressed){
        enemy.velocity.x = 5;
    } else if(keys.arrowLeft.pressed) {
        enemy.velocity.x = -5;
    }

    //player attack collision
    if(rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking) {  
        player.isAttacking = false;
        if(gameRunning){
            enemy.health -= 10;
            document.querySelector('#enemyHealth').style.width = `${enemy.health}%`
        }
    }

    //enemy attack collision
    if(rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking) {
            enemy.isAttacking = false;
            if(gameRunning){
                player.health -= 10;
                document.querySelector('#playerHealth').style.width = `${player.health}%`
            }
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

    //decides the position of the attackboxes according to the players` location
    if(player.position.x > enemy.position.x) {
        player.attackBox.offset.x = -50;
        enemy.attackBox.offset.x = 0;
    } else {
        player.attackBox.offset.x = 0;
        enemy.attackBox.offset.x = -50;
    }

    //game over by health reaching 0
    if(player.health === 0 || enemy.health === 0){
        if(gameRunning){
            gameOver({player, enemy, timerId});
        }
    }
}
//play
animate();

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
        case 'Control':
            enemy.attack();
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