class Sprite {
    constructor({position, src, frames = 1, buffer = 20, scale = 1}) {
        this.position = position
        this.scale = scale
        this.loaded = false
        this.image = new Image()
        this.image.onload = () => {
            this.width = (this.image.width / this.frames) * this.scale
            this.height = this.image.height * this.scale
            this.loaded = true
        }
        this.image.src = src
        this.frames = frames
        this.frame = 0
        this.buffer = buffer
        this.elapsed = 0
    }

    draw() {
        if (!this.image) return
        const cropbox = {
            position: {
                x: this.frame * this.image.width / this.frames,
                y: 0
            },
            width: this.image.width / this.frames,
            height: this.image.height
        }
        context.drawImage(
            this.image,
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        this.draw()
        this.updateFrames()
    }

    updateFrames() {
        this.elapsed++
        if (this.elapsed % this.buffer === 0) {
            this.frame++
            if (this.frame == this.frames) this.frame = 0
        }
    }
}