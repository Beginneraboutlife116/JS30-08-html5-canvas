import { canvas, ctx, clock, dialog } from "./variables"

/**
 * To draw the timer
 * @param {object} clock - basic timer
 */
export function drawTimer(clock) {
  const clockXStart = Math.floor((canvas.width - clock.width) / 2)

  ctx.fillStyle = "white"
  if (Number.parseInt(clock.time, 10) < 10) {
    ctx.fillStyle = "red"
  }
  ctx.font = "2.5rem 'Press Start 2P'"
  const text = ctx.measureText(clock.time)
  ctx.fillText(
    clock.time.toString(),
    clockXStart + Math.round((clock.width - text.width) / 2),
    80
  )
}

/**
 * Determine who is being attacked?
 * @param {object} param0 - the attacking side
 * @param {object} param1 - the attacked side
 */
export function determineBeingAttacked({ attacker, victim }) {
  if (
    attacker.isAttacking &&
    attacker.currentFrame === attacker.sprites.attack1.attack1AttackingFrame
  ) {
    if (
      attacker.attackBox.position.x + attacker.attackBox.width >=
        victim.position.x &&
      attacker.attackBox.position.x <= victim.position.x + victim.shape.width &&
      attacker.position.y + attacker.attackBox.height >= victim.position.y &&
      attacker.attackBox.position.y <= victim.position.y + victim.shape.height
    ) {
      victim.switchSprites("takeHit")
      victim.attacked = true
      victim.health -= attacker.abilities.attackValue
      if (victim.health <= 0) {
        victim.health = 0
      }
    }
    attacker.isAttacking = false
  }
}

//* To recording the setTimeout Id for clearTimeout
let timeoutId

/**
 * Decreasing Timer to make clock time update
 */
export function decreaseTimer() {
  timeoutId = setTimeout(decreaseTimer, 1000)
  if (clock.time > 0) {
    clock.time--
  }
}

/**
 * To determine who winner is, and also make dialog showing, stop the timer counting
 * @param {instance} param0 - player1
 * @param {instance} param1 = player2
 */
export function determineWinner({ player1, player2 }) {
  clearTimeout(timeoutId)
  dialog.show()
  const dialogResult = document.querySelector(".dialog__result")
  if (player1.health > player2.health) {
    dialogResult.textContent = `${
      player1.name[0].toUpperCase() + player1.name.substring(1)
    } Wins!`
  } else if (player2.health > player1.health) {
    dialogResult.textContent = `${
      player2.name[0].toUpperCase() + player2.name.substring(1)
    } Wins!`
  } else {
    dialogResult.textContent = "Tied"
  }
}

export function modifyPressStyle({ keys, eventKey, modifyMethod }) {
  const matchKey = keys.find((key) => key.textContent === eventKey) ?? null
  if (matchKey) matchKey.parentElement.classList[modifyMethod]("press")
}
