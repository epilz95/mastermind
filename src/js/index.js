// @flow

// $FlowFixMe
import 'normalize.css'
// $FlowFixMe
import '../sass/main.scss'

type Color = {|
  name: string,
  color: string
|}

type Colors = Array<Color>

const COLORS: Colors = [
  {
    name: 'lemon',
    color: '#f93b19'
  },
  {
    name: 'citron',
    color: '#97c11f'
  },
  {
    name: 'salem',
    color: '#0d8f35'
  },
  {
    name: 'picton-blue',
    color: '#2daae2'
  },
  {
    name: 'denim',
    color: '#1071b8'
  },
  {
    name: 'port-gore',
    color: '#28235d'
  },
  {
    name: 'thunderbird',
    color: '#bf1522'
  },
  {
    name: 'tangerine',
    color: '#f29200'
  }
]

let store = {
  paletNode: undefined,
  secretCode: undefined,
  currRound: undefined,
  rounds: []
}

const setState = (newState) => {
  store = { ...store, ...newState }
}

const getRandomColor = (array: Colors): Color => array[Math.floor(Math.random() * array.length)]

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

export const generateCode = (
  colors: Colors,
  count: number,
  init: Array<Color> = []
): Colors => {
  if (count <= 0) return init

  const result = [ ...init, getRandomColor(colors) ]

  return generateCode(colors, count - 1, result)
}

export const initNewRound = (currRound: number) => {
  const isFirstRound = typeof currRound === 'undefined'

  const newRound = isFirstRound
    ? 1
    : currRound + 1

  const newRoundObj = {
    id: newRound,
    secretCode: []
  }

  return {
    currRound: newRound,
    newRoundObj
  }
}

export const initGame = ({
  stateSetterFnc,
  codeGenFnc,
  roundInitializer,
  colorPalet
}: {
  stateSetterFnc: Function,
  codeGenFnc: Function,
  roundInitializer: Function,
  colorPalet: Colors
}) => {
  const secretCode = codeGenFnc(colorPalet, 4)

  const newRound = roundInitializer(undefined)

  stateSetterFnc({
    secretCode,
    currRound: newRound.currRound,
    rounds: [newRound.newRoundObj]
  })
  console.log({ store })
}

const addListeners = (): void => {
  const positionNodes = document.querySelectorAll('.position')
  const colorPaletNode = document.querySelector('.color-palet')

  if (positionNodes && colorPaletNode) {
    positionNodes.forEach(
      node => node.addEventListener('click', (e: MouseEvent) => showColorPalet(e, colorPaletNode, node))
    )
  }

  if (window && colorPaletNode) {
    window.addEventListener('click', () => hideColorPalet(colorPaletNode))
  }

  const colorPaletColorNodes = colorPaletNode
  ? colorPaletNode.querySelectorAll('.color-palet__option')
  : undefined

  if (colorPaletColorNodes) {
    colorPaletColorNodes.forEach(
      node => node.addEventListener('click', (e: MouseEvent) => setColor(e))
    )
  }

  const buttonStart = document.querySelector('.button-start')

  if (buttonStart) {
    buttonStart.addEventListener('click', () =>
      initGame({
        stateSetterFnc: setState,
        codeGenFnc: generateCode,
        roundInitializer: initNewRound,
        colorPalet: COLORS
      })
    )
  }
}

const main = () => {
  addListeners()
}

main()
