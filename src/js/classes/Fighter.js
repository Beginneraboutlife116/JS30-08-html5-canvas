import { canvas, clock, ctx, groundHeight } from "../variables"
import Sprite from "./Sprite"

export default class Fighter extends Sprite {
  #gravity = 0.5
  #abilities
  #shape = {
    width: 50,
    height: 150
  }
  status = {
    //* Recording characters movement
    left: false,
    right: false,
    jump: false
  }
  lastKey //* Recording the last key for preventing bad reflection

  // ? why using object as parameter??
  // * because by using this, we could ignore the order of the parameters
  constructor({
    position,
    name,
    keys,
    abilities,
    health,
    imgSrc,
    scale = 1,
    maxFrames = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {
      offset: {
        x: 0,
        y: 0
      },
      width: 0,
      height: 0
    }
  }) {
    super({ position, imgSrc, scale, maxFrames, offset })
    this.name = name
    this.position = {
      x: position.x - Math.floor(this.#shape.width / 2),
      y: position.y
    }
    this.velocity = {
      x: 0,
      y: 0
    }
    this.keys = keys
    this.#abilities = abilities
    this.isAttacking = false
    this.attackBox = {
      position: {
        //* This setting makes attackBox independent from Sprite position.
        x: this.position.x,
        y: this.position.y
      },
      width: attackBox.width,
      height: attackBox.height,
      offset: attackBox.offset
    }
    this.health = health
    this.currentFrame = 0
    this.framesHolding = 5
    this.elapsedFrames = 0
    this.sprites = sprites
    this.death = false
    this.attacked = false
    this.lastHealth = health

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imgSrc
    }
  }

  draw() {
    super.draw()
  }

  drawHealthBar(clock) {
    const clockXStart = Math.floor((canvas.width - clock.width) / 2)
    const clockYStart = 16
    const healthBarWidth = clockXStart - 36
    const healthBarHeight = 32
    const healthBarYStart =
      clockYStart + Math.floor((clock.height - healthBarHeight) / 2)
    const strokeLineWidth = 2
    let healthBarXStart, currentHealthWidth, strokeXStart

    if (this.attacked && this.lastHealth > this.health) {
      currentHealthWidth = (healthBarWidth * this.lastHealth) / 100

      if (this.name === "player1") {
        healthBarXStart = 32 + (healthBarWidth * (100 - this.lastHealth)) / 100
      }

      if (this.name === "player2") {
        healthBarXStart = clockXStart + clock.width + 2
      }

      ctx.fillStyle = "#E70E02"
      ctx.fillRect(
        healthBarXStart,
        healthBarYStart,
        currentHealthWidth,
        healthBarHeight
      )
      this.lastHealth -= 2
    } else {
      this.attacked = false
      if (this.name === "player1") {
        healthBarXStart = 32 + (healthBarWidth * (100 - this.health)) / 100
      }

      if (this.name === "player2") {
        healthBarXStart = clockXStart + clock.width + 2
      }

      currentHealthWidth = (healthBarWidth * this.health) / 100
      ctx.fillStyle = "#2364AA"
      ctx.fillRect(
        healthBarXStart,
        healthBarYStart,
        currentHealthWidth,
        healthBarHeight
      )
    }

    if (this.name === "player1") {
      strokeXStart = 30
    }
    if (this.name === "player2") {
      strokeXStart = healthBarXStart - strokeLineWidth
    }

    ctx.lineWidth = strokeLineWidth
    ctx.strokeStyle = "white"
    ctx.strokeRect(
      strokeXStart,
      healthBarYStart - strokeLineWidth,
      healthBarWidth + 2 * strokeLineWidth,
      healthBarHeight + 2 * strokeLineWidth
    )
  }

  update() {
    this.draw()
    this.drawHealthBar(clock)
    if (!this.death) {
      this.animateFrames()
    }

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y

    //* vertical movement
    if (
      this.position.y + this.#shape.height + this.velocity.y >=
      canvas.height - groundHeight
    ) {
      this.velocity.y = 0

      //* for resolving the flash between fall and idle
      this.position.y = 331
    } else {
      this.velocity.y += this.#gravity
      this.position.y += this.velocity.y
    }

    //* horizontal movement
    if (
      this.position.x + this.velocity.x + this.#shape.width >= canvas.width ||
      this.position.x + this.velocity.x < 0
    ) {
      this.velocity.x = 0
    }
    this.position.x += this.velocity.x
  }

  attack() {
    this.switchSprites("attack1")
    this.isAttacking = true
  }

  switchSprites(movement) {
    if (this.image === this.sprites.death.image) {
      if (this.currentFrame === this.sprites.death.maxFrames - 1) {
        this.death = true
      }
      return
    }
    //* overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      //* This is for once attack animation
      this.currentFrame < this.sprites.attack1.maxFrames - 1
    )
      return

    //* overriding all other animations with the takeHit animation
    if (
      this.image === this.sprites.takeHit.image &&
      this.currentFrame < this.sprites.takeHit.maxFrames - 1
    )
      return
    if (this.image !== this.sprites[movement].image) {
      this.image = this.sprites[movement].image
      this.maxFrames = this.sprites[movement].maxFrames
      this.currentFrame = 0
    }
  }

  changeStatus(keyCode) {
    if (this.death) return
    const inputKeyValidation = this.keys[keyCode] ?? null
    if (inputKeyValidation === null) return
    if (inputKeyValidation === "attack") {
      this.attack()
    } else {
      if (inputKeyValidation !== "jump") {
        this.lastKey = keyCode
      }
      this.status[inputKeyValidation] = true
    }
  }

  setVelocity() {
    if (!this.status.right && !this.status.left) {
      this.switchSprites("idle")
    }
    if (this.status.left && this.keys[this.lastKey] === "left") {
      this.velocity.x = -this.abilities.speed
      this.switchSprites("run")
    }
    if (this.status.right && this.keys[this.lastKey] === "right") {
      this.velocity.x = this.abilities.speed
      this.switchSprites("run")
    }
    if (
      this.status.jump &&
      this.position.y === canvas.height - this.#shape.height - groundHeight
    ) {
      this.velocity.y = -this.abilities.jumpHeight
    }
  }

  get abilities() {
    return this.#abilities
  }

  get shape() {
    return this.#shape
  }
}
