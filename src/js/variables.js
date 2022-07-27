import A11yDialog from 'a11y-dialog'

//* using A11yDialog
const dialogEl = document.querySelector("[data-model]")
export const dialog = new A11yDialog(dialogEl)

export const canvas = document.querySelector('.game-stage')

// * Those function to manipulate the 2d context are based on ctx.
export const ctx = canvas.getContext('2d')

export const groundHeight = 95

export const clock = {
  width: 100,
  height: 80,
  time: 60
}