class Sprite {
    constructor({position, imageSrc, scale = 1, totalFrames = 1, offset = { x: 0, y: 0 }}) {
        this.position = position //stores the players position on the x and y axes
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale
        this.totalFrames = totalFrames
        this.frame = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.offset = offset
    }

    animateFrames() {
        if(this.framesElapsed % this.framesHold === 0){
            if(this.frame < this.totalFrames - 1){
                this.frame++
            } else {
                this.frame = 0;
            }
        }
        this.framesElapsed++ 
    }

    draw() {
        c.drawImage(
            this.image,
            (this.image.width / this.totalFrames) * this.frame,
            0,
            this.image.width / this.totalFrames,
            this.image.height,      
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.totalFrames) * this.scale, 
            this.image.height * this.scale)
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({ position, velocity, color = 'red', imageSrc, scale = 1, totalFrames = 1, offset = { x: 0, y: 0 }, sprites }) {
        super({
            position,
            imageSrc,
            scale,
            totalFrames,
            offset
        })
        this.velocity = velocity  // players velocity on the x and y axes
        this.height = 150; 
        this.width = 50;
        this.attackBox = { //determines the attackbox`s position and size
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: {
                x: 0,
                y: 0
            },
            width: 100,
            height: 50
        }
        this.color = color; 
        this.isAttacking
        this.health = 100;
        this.canJump 
        this.canAttack = true
        this.frame = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.sprites = sprites

        for(const sprite in this.sprites){
            this.sprites[sprite].image = new Image();
            this.sprites[sprite].image.src = this.sprites[sprite].imageSrc
        }
        // this.lastKey
    }

    // draw() {
    //     //draws the player
    //     c.fillStyle = this.color;
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height);
    //     //draw the attackbox
    //     if(this.isAttacking){
    //         c.fillStyle = 'green'
    //         c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    //     }
    // }

    update() {
        this.draw();
        this.animateFrames();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.y += this.velocity.y;

        //deals with horizontal movement and prevents the player from going out of bounds on the x-axis
        if(this.position.x + this.velocity.x <= 0){
            this.velocity.x = 0;
            this.position.x = 0;
        } else if(this.position.x + this.velocity.x + this.width >= canvas.width) {
            this.velocity.x = 0;
            this.position.x = canvas.width - this.width;
        } else if(horizontalPlayerCollision()){
            this.velocity.x = 0; 
        } else {
            this.position.x += this.velocity.x
        }

        //deals with vertical movement and prevents the player from going out of bounds on the y-axis
        if(this.position.y + this.height + this.velocity.y >= floor){
            this.velocity.y = 0;
            this.position.y = floor - this.height;
        } else if(verticalPlayerCollision()){
            this.position.y -= this.velocity.y
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity;
        }
    }

    jump() {
        //if statement prevents mid-air jumps
        if(this.canJump){
            this.velocity.y = -20;
        }
    }

    attack() {
        //if statement prevents multiple attacks in sequence, preventing them from stacking an absurd amount of damage
        if(this.canAttack) {
            this.isAttacking = true;
            this.canAttack = false;
            setTimeout(() => {
            this.isAttacking = false;
            }, 100)
            setTimeout(() => {
            this.canAttack = true;
            }, 500);
        }
    }
}
