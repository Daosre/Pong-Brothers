let maxWidth = window.innerWidth
let maxHeight = window.innerHeight
let currentDirection = 'top-right'
let score = 0
let gameInterval
let gameOver = false
let velocity = 0
let gameOn = document.querySelector('.start')
let Go = document.querySelector('.accueil')
let game = document.querySelector('.main')
let text = document.querySelector('.textstart')
let playerone = document.querySelector('.Player1')
let playertwo = document.querySelector('.Player2')
let balls = document.querySelector('.ball')


gameOn.addEventListener('click', () => {
    Go.style.display = 'none'
    game.style.display = 'block'
})
//Platform Orange
class Platform {
    constructor(positionX,positionY, className) {
        this.positionX = positionX
        this.positionY = positionY
        this.className = className
    }

    // Place correctement la plateforme au début du jeu, en servant de la variable maxWidth, qui est la largeur de l'écran réele.
    init() {
        this.positionX = maxWidth / 2 - 75
        this.display()
    }

    // Gère les déplacements de la plateforme, gauche ou droite
    move(direction) {
        if (direction === 'left' && this.positionX >= 20) {
            this.positionX -= 90
        }
        if (direction === 'right' && this.positionX <= maxWidth - 180) {
            this.positionX += 90
        }
        this.display()
    }
    // Applique le changement appliquée à positionX au DOM ( HTML )
    display() {
        const platform = document.querySelector(`.${this.className}`)
        platform.style.left = `${this.positionX}px`
    }
    returnPosition() {
        return [this.positionX, this.positionX + 150]
    }
}

let plateformOrange = new Platform(500,maxHeight - 80, "Orange")
let plateformRouge = new Platform(500,40,"Red")
plateformOrange.init()
plateformRouge.init() 

document.addEventListener('keydown', function (event) {
    if (event.code === 'ArrowLeft') {
        plateformOrange.move('left')
    } if (event.code === 'KeyA'){
        plateformRouge.move('left')
    }
    if (event.code === 'ArrowRight') {
        plateformOrange.move('right')
    } if(event.code === 'KeyD') {
        plateformRouge.move('right')
    }
    if (event.code === 'Space') {
        text.style.display = 'none'
        playerone.style.display = 'none'
        playertwo.style.display = 'none'
        balls.style.display = 'block'
        // On veut une fonction qui démarre la mécanique du jeu ( ball.move() )
        if (gameOver === true) {
            ball.init()
            gameOver = false
            window.location.reload()
        }
        handleGame()
    }
})
class Ball {
    constructor(positionX, positionY) {
        this.positionX = positionX
        this.positionY = positionY
    }
    init() {
        this.positionX = maxWidth / 2 - 10
        this.positionY = maxHeight / 2 - 20
        this.display()
    }

    display() {
        let ball = document.querySelector('.ball')
        ball.style.top = `${this.positionY}px`
        ball.style.left = `${this.positionX}px`
    }

    move() {
        this.handleCollision()
        switch (currentDirection) {
            case 'top-left':
                this.positionX -= 30 + velocity
                this.positionY -= 30 + velocity
                break

            case 'top-right':
                this.positionX += 30 + velocity
                this.positionY -= 30 + velocity
                break
            case 'bottom-left':
                this.positionX -= 30 + velocity
                this.positionY += 30 + velocity
                break
            case 'bottom-right':
                this.positionX += 30 + velocity
                this.positionY += 30 + velocity
                break
            default:
                return
        }

        this.display()
    }
    handleCollision() {
        if (this.positionX >= maxWidth - 10) {
            if (currentDirection === 'top-right') {
                currentDirection = 'top-left'
            } else {
                currentDirection = 'bottom-left'
            }
        }
        if (this.positionY <= 0) {
            if (currentDirection === 'top-right') {
                currentDirection = 'bottom-right'
            } else {
                currentDirection = 'bottom-left'
            }
        }
        if (this.positionX <= 10) {
            if (currentDirection === 'top-left') {
                currentDirection = 'top-right'
            } else {
                currentDirection = 'bottom-right'
            }
        }            
        let scoreText = document.querySelector('.score')
        if (this.positionY >= plateformOrange.positionY) {
            let platformPosition = plateformOrange.returnPosition()
            console.log(this.positionY,platformPosition)

            //Platform Orange, Collision avec la platformOrange
            if (this.positionX >= platformPosition[0] &&
                this.positionX <= platformPosition[1]) {
                velocity += 1
                score++
                scoreText.innerText = `Score: ${score}`
                if (currentDirection === 'bottom-left') {
                    currentDirection = 'top-left'
                } else {
                    currentDirection = 'top-right'
                }
                
            } else {
                gameOver = true
                scoreText.innerText = `Loose with ${score}pts. Nice Try !`
                this.display()
                handleGame()
            }
        }            
        if (this.positionY <= plateformRouge.positionY) {
            let platformPosition = plateformRouge.returnPosition()
            //Platform Rouge, Collision avec la platformRouge
            if (this.positionX >= platformPosition[0] &&
                this.positionX <= platformPosition[1]) {
                velocity += 1
                score++
                scoreText.innerText = `Score: ${score}`
                if (currentDirection === 'top-left') {
                    currentDirection = 'bottom-left'
                } else {
                    currentDirection = 'bottom-right'
                }
            } else {
                gameOver = true
                scoreText.innerText = `Perdu avec ${score} points`
                this.display()
                handleGame()
            }
        }
            }
    }

// Démarrage du jeu sans mécanique

let ball = new Ball(20, 20)
ball.init()

// On veut une fonction qui démarre la mécanique du jeu
function handleGame() {
    if (gameOver === false) {
        gameInterval = setInterval(() => {
            ball.move()
        }, 80)
    } else {
        clearInterval(gameInterval)
        currentDirection = 'top-left'
    }
}
