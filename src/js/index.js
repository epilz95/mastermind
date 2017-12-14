// @flow

// $FlowFixMe
import 'normalize.css'
// $FlowFixMe
import '../sass/main.scss'

let store = {
  paletNode: undefined
}

const setState = (newState) => {
  store = { ...store, ...newState }
}

const positions = document.querySelectorAll('.position')
const colorPalet = document.querySelector('.color-palet')
const colorPaletColor = colorPalet
  ? colorPalet.querySelectorAll('.color-palet__option')
  : undefined

const showColorPalet = (e, colorPalet: ?HTMLElement, position: ?HTMLElement) => {
  e.stopPropagation()

  if (colorPalet && position) {
    setState({ paletNode: e.target })

    const positionCoords = position.getBoundingClientRect()

    colorPalet.style.display = 'block'

    colorPalet.style.left = `${
      positionCoords.left -
      (colorPalet.offsetWidth / 2) +
      (positionCoords.width / 2)
    }px`

    colorPalet.style.top = `${
      positionCoords.top -
      colorPalet.offsetHeight - 10 +
      window.scrollY
    }px`
  }
}

const setColor = (e) => {
  const target = e.target

  if (target instanceof HTMLElement) {
    const colorClicked = target.dataset.color

    if (store.paletNode instanceof HTMLElement) {
      store.paletNode.style.backgroundColor = colorClicked
    }
  }
}

const hideColorPalet = (colorPalet: ?HTMLElement) => {
  if (colorPalet) colorPalet.style.display = 'none'
}

positions.forEach(
  position => position.addEventListener('click', (e: MouseEvent) => showColorPalet(e, colorPalet, position))
)

window.addEventListener('click', () => hideColorPalet(colorPalet))

if (colorPaletColor) {
  colorPaletColor.forEach(
    color => color.addEventListener('click', (e: MouseEvent) => setColor(e))
  )
}

export const theStringMachine = (val: ?string) => {
  if (typeof val === 'number') return `Number: ${val}`

  if (typeof val === 'string') return `${val}, YAY!`

  return 'What the hell is this???'
}
