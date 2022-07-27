import { ctx } from "../variables"

export default class Sprite {
  constructor({
    position,
    imgSrc,
    scale = 1,
    maxFrames = 1,
    offset = { x: 0, y: 0 }
  }) {
    this.position = position
    this.image = new Image()
    this.image.src = imgSrc
    this.scale = scale
    this.maxFrames = maxFrames
    this.currentFrame = 0
    this.framesHolding = 10
    this.elapsedFrames = 0
    this.offset = offset
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.maxFrames),
      0,
      this.image.width / this.maxFrames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.maxFrames) * this.scale,
      this.image.height * this.scale
    )
  }

  animateFrames() {
    this.elapsedFrames++
    if (this.elapsedFrames % this.framesHolding === 0) {
      if (this.currentFrame < this.maxFrames - 1) {
        this.currentFrame++
      } else {
        this.currentFrame = 0
      }
    }
  }

  update() {
    this.draw()
    this.animateFrames()
  }
}
