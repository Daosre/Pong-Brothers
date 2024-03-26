//Définition de la Hauteur/ Largueur de la page.
let maxWidth = window.innerWidth
let maxHeight = window.innerHeight
//Direction de départ de la balle.
let currentDirection = 'top-left'
//Initialisation du score
let score = 0
let gameInterval
let gameOver = false
//Initialisation de la vélocité de départ.
let velocity = 0
//Sélection des différentes classe CSS que nous chageons au court de commande.
let gameOn = document.querySelector('.start')
let Go = document.querySelector('.accueil')
let game = document.querySelector('.main')
let text = document.querySelector('.textstart')
let playerone = document.querySelector('.Player1')
let playertwo = document.querySelector('.Player2')
let balls = document.querySelector('.ball')
//Bouton règles.
let rules = document.querySelector('.rules')
let rule = document.querySelector('.rule')

//Apparition du jeu / Disparition du Menu.
gameOn.addEventListener('click', () => {
    Go.style.display = 'none'
    game.style.display = 'block'
})
//Activation du bouton au click pour faire apparaitre les règles.
rules.addEventListener('click', () => {
    rules.style.display = 'none'
    rule.style.display = 'block'
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
    //Retourne l'emplacement du joueur
    returnPosition() {
        return [this.positionX, this.positionX + 150]
    }
}
//Création des joueurs
let plateformOrange = new Platform(500,maxHeight - 80, "Orange")
let plateformRouge = new Platform(500,40,"Red")
//Initialisation des emplacements des joueurs.
plateformOrange.init()
plateformRouge.init() 

//Programmation des touches pour le déplacement des joueurs.
document.addEventListener('keydown', function (event) {
    //Déplacement joueur 1
    if (event.code === 'ArrowLeft') {
        plateformOrange.move('left')
    } if (event.code === 'KeyA'){
        plateformRouge.move('left')
    }
    //Déplacement joueur 2
    if (event.code === 'ArrowRight') {
        plateformOrange.move('right')
    } if(event.code === 'KeyD') {
        plateformRouge.move('right')
    }
    //Initialisation du départ de la partie avec disparition des éléments qui gène.
    if (event.code === 'Space') {
        text.style.display = 'none'
        playerone.style.display = 'none'
        playertwo.style.display = 'none'
        balls.style.display = 'block'
        //Rechargement en cas de défaite.
        if (gameOver === true) {
            ball.init()
            gameOver = false
            window.location.reload()
        }
        handleGame()
    }
})
//Création de la classe Ball
class Ball {
    constructor(positionX, positionY) {
        this.positionX = positionX
        this.positionY = positionY
    }
    //Initalisation du point de départ.
    init() {
        this.positionX = maxWidth / 2 - 10
        this.positionY = maxHeight / 2 - 20
        this.display()
    }
    //Méthode d'apparition.
    display() {
        let ball = document.querySelector('.ball')
        ball.style.top = `${this.positionY}px`
        ball.style.left = `${this.positionX}px`
    }
    //Méthode pour le déplacement.
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
    //Collision de la balle
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
        //Si la balle touche l(emplacement ou ce trouve le joueur que ce passe t-il.
        if (this.positionY >= plateformOrange.positionY) {
            let platformPosition = plateformOrange.returnPosition()
            //Platform Orange, Collision avec la platformOrange
            if (this.positionX >= platformPosition[0] &&
                this.positionX <= platformPosition[1]) {
                velocity += 1
                score++
                scoreText.innerText = `Score: ${score}`
                //Choix de la direction en fonction de la ou la balle rebondit
                if (currentDirection === 'bottom-left') {
                    currentDirection = 'top-left'
                } else {
                    currentDirection = 'top-right'
                }
                //Affichage du texte quand c'est GameOver
            } else {
                gameOver = true
                scoreText.innerText = `Loose with ${score}pts. Nice Try !`
                this.display()
                handleGame()
            }
        } 

        //Collision avec la platformRouge    
        if (this.positionY <= plateformRouge.positionY) {
            let platformPosition = plateformRouge.returnPosition()
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

//Démarrage du jeu.
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
