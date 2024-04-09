class Player extends Sprite {
    constructor({position, floorCollisionBlocks, platformCollisionBlocks, src, frames, scale = 0.5, animations}) {
        super({src, frames, scale})
        this.position = position
        this.velocity = {
            x: 0,
            y: 1
        }
        this.floorCollisionBlocks = floorCollisionBlocks
        this.platformCollisionBlocks = platformCollisionBlocks
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 10,
            height: 10
        }
        this.animations = animations
        this.lastDirection = 'r'
        for (let key in this.animations) {
            const image = new Image()
            image.src = this.animations[key].src
            this.animations[key].image = image
        }
        this.cameraBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 200,
            height: 80
        }
    }

    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return
        this.image = this.animations[key].image
        this.frames = this.animations[key].frames
        this.buffer = this.animations[key].buffer
        this.frame = 0
    }

    update() {
        this.updateFrames()
        this.updateHitbox()
        this.updatecameraBox()
        // context.fillStyle = 'rgba(0, 0, 255, 0.2)'
        // context.fillRect(this.cameraBox.position.x, this.cameraBox.position.y, this.cameraBox.width, this.cameraBox.height)
        // context.fillStyle = 'rgba(0, 255, 0, 0.2)'
        // context.fillRect(this.position.x, this.position.y, this.width, this.height)
        // context.fillStyle = 'rgba(255, 0, 0, 0.2)'
        // context.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
        this.draw()
        this.position.x += this.velocity.x
        this.updateHitbox()
        this.checkForHorizontalCollisions()
        this.applyGravity()
        this.updateHitbox()
        this.checkForVerticalCollisions()
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 35,
                y: this.position.y + 26
            },
            width: 14,
            height: 27
        }
    }

    updatecameraBox() {
        this.cameraBox = {
            position: {
                x: this.position.x - 50,
                y: this.position.y
            },
            width: 200,
            height: 80
        }
    }

    shouldPanCameraLeft({canvas, camera}) {
        const cameraBoxRight = this.cameraBox.position.x + this.cameraBox.width
        const scaledCanvasWidth = canvas.width / 4
        if (cameraBoxRight >= 576) return
        if (cameraBoxRight >= scaledCanvasWidth + Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }

    shouldPanCameraRight({camera}) {
        if (this.cameraBox.position.x <= 0) return
        if (this.cameraBox.position.x <= Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }

    checkForHorizontalCanvasCollision() {
        if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 || this.hitbox.position.x + this.velocity.x <= 0) {
            this.velocity.x = 0
        }
    }

    shouldPanCameraDown({camera}) {
        if (this.cameraBox.position.y + this.velocity.y <= 0) return
        if (this.cameraBox.position.y <= Math.abs(camera.position.y)) {
            camera.position.y -= this.velocity.y
        }
    }

    shouldPanCameraUp({canvas, camera}) {
        if (this.cameraBox.position.y + this.cameraBox.height + this.velocity.y >= 432) return
        const scaledCanvasHeight = canvas.height / 4
        if (this.cameraBox.position.y + this.cameraBox.height >= Math.abs(camera.position.y) + scaledCanvasHeight) {
            camera.position.y -= this.velocity.y
        }
    }

    // checkForHorizontalCanvasCollision() {
    //     if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 || this.hitbox.position.x + this.velocity.x <= 0) {
    //         this.velocity.x = 0
    //     }
    // }

    checkForHorizontalCollisions() {
        for (let i = 0; i < this.floorCollisionBlocks.length; i++) {
            const block = this.floorCollisionBlocks[i];
            if (collision({object1: this.hitbox, object2: block})) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0
                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width
                    this.position.x = block.position.x - offset - 0.01
                    break
                }
                if (this.velocity.x < 0) {
                    this.velocity.x = 0
                    const offset = this.hitbox.position.x - this.position.x
                    this.position.x = block.position.x + block.width - offset + 0.01
                    break
                }
            }
        }
    }
    
    applyGravity() {
        this.velocity.y += 0.1
        this.position.y += this.velocity.y
    }

    checkForVerticalCollisions() {
        for (let i = 0; i < this.floorCollisionBlocks.length; i++) {
            const block = this.floorCollisionBlocks[i];
            if (collision({object1: this.hitbox, object2: block})) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
                    this.position.y = block.position.y - offset - 0.01
                    break
                }
                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y
                    this.position.y = block.position.y + block.height - offset + 0.01
                    break
                }
            }
        }

        for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
            const block = this.platformCollisionBlocks[i];
            if (platformCollision({object1: this.hitbox, object2: block})) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
                    this.position.y = block.position.y - offset - 0.01
                    break
                }
            }
        }
    }

}