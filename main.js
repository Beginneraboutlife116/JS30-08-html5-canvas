import "./style.css"
import { canvas, ctx, clock } from "./src/js/variables"
import Sprite from "./src/js/classes/Sprite"
import Fighter from "./src/js/classes/Fighter"
import {
  drawTimer,
  determineBeingAttacked,
  decreaseTimer,
  determineWinner,
  modifyPressStyle
} from "./src/js/utilities"
import images from "./src/js/image.js"

//* background
const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imgSrc: images.background
})
const shop = new Sprite({
  position: {
    x: 620,
    y: 127
  },
  imgSrc: images.shop,
  scale: 2.75,
  maxFrames: 6
})

//* player and enemy parameters
const player1 = new Fighter({
  name: "player1",
  position: {
    x: 256,
    y: 20
  },
  shape: {
    width: 50,
    height: 150
  },
  keys: {
    KeyA: "left",
    KeyD: "right",
    KeyW: "jump",
    KeyC: "attack"
  },
  abilities: {
    speed: 5,
    jumpHeight: 15,
    attackValue: 20
  },
  health: 100,
  imgSrc: images.samuraiMack.idle,
  maxFrames: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155
  },
  sprites: {
    idle: {
      imgSrc: images.samuraiMack.idle,
      maxFrames: 8
    },
    run: {
      imgSrc: images.samuraiMack.run,
      maxFrames: 8
    },
    jump: {
      imgSrc: images.samuraiMack.jump,
      maxFrames: 2
    },
    fall: {
      imgSrc: images.samuraiMack.fall,
      maxFrames: 2
    },
    attack1: {
      imgSrc: images.samuraiMack.attack,
      maxFrames: 6,
      attack1AttackingFrame: 4
    },
    takeHit: {
      imgSrc: images.samuraiMack.takeHit,
      maxFrames: 4
    },
    death: {
      imgSrc: images.samuraiMack.death,
      maxFrames: 6
    }
  },
  attackBox: {
    offset: {
      x: 127.5,
      y: 35
    },
    width: 130,
    height: 60
  }
})
const player2 = new Fighter({
  name: "player2",
  position: {
    x: 768,
    y: 20
  },
  shape: {
    width: 50,
    height: 150
  },
  keys: {
    KeyK: "left",
    Semicolon: "right",
    KeyO: "jump",
    KeyM: "attack"
  },
  abilities: {
    speed: 5,
    jumpHeight: 15,
    attackValue: 10
  },
  health: 100,
  imgSrc: images.kenji.idle,
  maxFrames: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 170
  },
  sprites: {
    idle: {
      imgSrc: images.kenji.idle,
      maxFrames: 4
    },
    run: {
      imgSrc: images.kenji.run,
      maxFrames: 8
    },
    jump: {
      imgSrc: images.kenji.jump,
      maxFrames: 2
    },
    fall: {
      imgSrc: images.kenji.fall,
      maxFrames: 2
    },
    attack1: {
      imgSrc: images.kenji.attack,
      maxFrames: 4,
      attack1AttackingFrame: 2
    },
    takeHit: {
      imgSrc: images.kenji.takeHit,
      maxFrames: 3
    },
    death: {
      imgSrc: images.kenji.death,
      maxFrames: 7
    }
  },
  attackBox: {
    offset: {
      x: -175,
      y: 35
    },
    width: 150,
    height: 65
  }
})

//* loop animation
function animate() {
  window.requestAnimationFrame(animate)

  background.update()
  shop.update()

  ctx.fillStyle = "hsla(0, 100%, 100%, .2)"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  player1.update()
  player2.update()

  drawTimer(clock)

  player1.velocity.x = 0
  player2.velocity.x = 0

  // ? why does the author move the setting velocity value from addEventListener to here?
  // * By test, putting the animation staff in here, it gets smoother animation.
  player1.setVelocity()
  player2.setVelocity()

  if (player1.velocity.y < 0) {
    player1.switchSprites("jump")
  } else if (player1.velocity.y > 0) {
    player1.switchSprites("fall")
  }
  if (player2.velocity.y < 0) {
    player2.switchSprites("jump")
  } else if (player2.velocity.y > 0) {
    player2.switchSprites("fall")
  }

  if (player1.health > 0 && player2.health > 0 && clock.time > 0) {
    determineBeingAttacked({ attacker: player1, victim: player2 })
    determineBeingAttacked({ attacker: player2, victim: player1 })
  }

  if (player1.health <= 0) {
    player1.switchSprites("death")
    determineWinner({ player1, player2 })
  }
  if (player2.health <= 0) {
    player2.switchSprites("death")
    determineWinner({ player1, player2 })
  }
  if (clock.time === 0) {
    determineWinner({ player1, player2 })
  }
}

//* default setting
canvas.width = 1024
canvas.height = 576
ctx.fillStyle = "black"
ctx.fillRect(0, 0, canvas.width, canvas.height)

player1.draw()
player2.draw()
player1.drawHealthBar(clock)
player2.drawHealthBar(clock)
decreaseTimer()
animate()

const player1Keys = [...document.querySelectorAll(".player1 .key__name")]
const player2Keys = [...document.querySelectorAll(".player2 .key__name")]

window.addEventListener("keydown", (event) => {
  const keyCode = event.code
  player1.changeStatus(keyCode)
  player2.changeStatus(keyCode)
  const eventKey = event.key.toUpperCase()
  modifyPressStyle({ keys: player1Keys, eventKey, modifyMethod: "add" })
  modifyPressStyle({ keys: player2Keys, eventKey, modifyMethod: "add" })
})

window.addEventListener("keyup", (event) => {
  const keyCode = event.code
  if (player1.keys[keyCode]) {
    player1.status[player1.keys[keyCode]] = false
  }
  if (player2.keys[keyCode]) {
    player2.status[player2.keys[keyCode]] = false
  }
  const eventKey = event.key.toUpperCase()
  modifyPressStyle({ keys: player1Keys, eventKey, modifyMethod: "remove" })
  modifyPressStyle({ keys: player2Keys, eventKey, modifyMethod: "remove" })
})
