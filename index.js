const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4
}

const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 36) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 36))
}
const floorCollisionBlocks = []
floorCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 192) {
            floorCollisionBlocks.push(new CollisionBlock({
                position: {
                    x: x * 16,
                    y: y * 16
                }
            }))
        }
    })
})

const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += 36) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 36))
}
const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 192) {
            platformCollisionBlocks.push(new CollisionBlock({
                position: {
                    x: x * 16,
                    y: y * 16
                },
                height: 4
            }))
        }
    })
})

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    src: './img/background.png'
})

const player = new Player({
    position: {
        x: 100,
        y: 300
    },
    floorCollisionBlocks: floorCollisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,
    src: './img/warrior/Idle.png',
    frames: 8,
    animations: {
        idle: {
            src: './img/warrior/Idle.png',
            frames: 8,
            buffer: 20
        },
        idleLeft: {
            src: './img/warrior/IdleLeft.png',
            frames: 8,
            buffer: 20
        },
        run: {
            src: './img/warrior/Run.png',
            frames: 8,
            buffer: 10
        },
        runLeft: {
            src: './img/warrior/RunLeft.png',
            frames: 8,
            buffer: 10
        },
        jump: {
            src: './img/warrior/Jump.png',
            frames: 2,
            buffer: 20
        },
        jumpLeft: {
            src: './img/warrior/JumpLeft.png',
            frames: 2,
            buffer: 20
        },
        fall: {
            src: './img/warrior/Fall.png',
            frames: 2,
            buffer: 20
        },
        fallLeft: {
            src: './img/warrior/FallLeft.png',
            frames: 2,
            buffer: 20
        }
    }
})


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const backgroundImageHeight = 432
const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height
    }
}

function animate() {
    window.requestAnimationFrame(animate)
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.save()
    context.scale(4, 4)
    context.translate(camera.position.x, camera.position.y)
    background.update()
    // floorCollisionBlocks.forEach(block => {
    //     block.draw()
    // })
    // platformCollisionBlocks.forEach(block => {
    //     block.draw()
    // })
    player.checkForHorizontalCanvasCollision()
    player.update()
    player.velocity.x = 0
    if (keys.d.pressed) {
        player.velocity.x = 2
        player.switchSprite('run')
        player.lastDirection = 'r'
        player.shouldPanCameraLeft({canvas, camera})
    }
    else if (keys.a.pressed) {
        player.velocity.x = -2
        player.switchSprite('runLeft')
        player.lastDirection = 'l'
        player.shouldPanCameraRight({camera})
    }
    else if (player.velocity.x === 0) {
        if (player.lastDirection === 'l') player.switchSprite('idleLeft')
        else player.switchSprite('idle')
    }
    if (player.velocity.y < 0) {
        player.shouldPanCameraDown({camera})
        if (player.lastDirection === 'r') player.switchSprite('jump')
        else player.switchSprite('jumpLeft')
    }
    else if (player.velocity.y > 0) {
        player.shouldPanCameraUp({canvas, camera})
        if (player.lastDirection === 'r') player.switchSprite('fall')
        else player.switchSprite('fallLeft')
    }
    context.restore()
}
animate()