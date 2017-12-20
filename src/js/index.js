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

type ColorPosition = string
type ColorHex = string

type ColorCode = { [ColorPosition]: ColorHex }

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
  secretCode: {},
  currRound: undefined,
  rounds: {}
}

const setState = (newState) => {
  store = { ...store, ...newState }

  return newState
}

const getRandomColor = (array: Colors): Color => array[Math.floor(Math.random() * array.length)]

const showColorPalet = (e, colorPalet: ?HTMLElement, codeNode: ?HTMLElement) => {
  e.stopPropagation()

  if (colorPalet && codeNode) {
    setState({ paletNode: e.target })

    const positionCoords = codeNode.getBoundingClientRect()

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

export const addColorToRound = ({
  currRound,
  rounds,
  stateSetterFnc,
  color,
  position
}: {
  currRound: number,
  rounds: Object,
  stateSetterFnc: Function,
  color: string,
  position: string
}) => {
  const currRoundStr = currRound.toString()
  const currRoundObj = rounds[currRoundStr]
  const currPlayerCode = currRoundObj.playerCode

  const newState = {
    rounds: {
      ...rounds,
      [currRoundStr]: {
        ...currRoundObj,
        playerCode: {
          ...currPlayerCode,
          [position]: color
        }
      }
    }
  }

  stateSetterFnc(newState)

  return newState
}

const setColor = (e) => {
  if (store.currRound === undefined) return

  const target = e.target

  if (target instanceof HTMLElement) {
    const { color } = target.dataset

    if (store.paletNode instanceof HTMLElement) {
      store.paletNode.style.backgroundColor = color

      const { position } = store.paletNode.dataset

      addColorToRound({
        currRound: store.currRound,
        rounds: store.rounds,
        stateSetterFnc: setState,
        color,
        position
      })
    }
  }
}

const hideColorPalet = (colorPalet: ?HTMLElement) => {
  if (colorPalet) colorPalet.style.display = 'none'
}

export const convertToColorCode = (colors: Colors): ColorCode => {
  return colors.reduce((acc, c, i) => {
    const position = i + 1
    return {
      ...acc,
      [`color${position.toString()}`]: c.color
    }
  }, {})
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

export const initNewRound = (currRound: ?number) => {
  const isFirstRound = typeof currRound === 'undefined'

  const newRound = isFirstRound
    ? 1
    : currRound + 1

  const newRoundObj = {
    id: newRound.toString(),
    playerCode: {}
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
  const colorArray = codeGenFnc(colorPalet, 4)
  const secretCode = convertToColorCode(colorArray)

  const newRound = roundInitializer(undefined)

  stateSetterFnc({
    secretCode,
    currRound: newRound.currRound,
    rounds: { [newRound.currRound.toString()]: newRound.newRoundObj }
  })
}

export const checkCodeLength = (playerCode: Object) => {
  return Object.keys(playerCode).length === 4
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

  const buttonCheck = document.querySelector('.button--check')

  if (buttonCheck) {
    buttonCheck.addEventListener('click', () => {
      const { currRound, rounds } = store
      const currRoundObj = currRound
        ? rounds[currRound]
        : undefined

      const playerCode = currRoundObj
        ? currRoundObj.playerCode
        : {}

      const isValidCode = checkCodeLength(playerCode)
      const errorMessage = document.querySelector('.error')

      if (!isValidCode && errorMessage) {
        errorMessage.style.display = 'block'
      } else if (errorMessage) {
        errorMessage.style.display = 'none'
      }

      if (!isValidCode) return

      // compare player code with secret code

      // --> show hints for current round

      // if player code === secret code
        // --> end game 'win'

      // if player code !== secret code && last round
        // --> end game 'lose'

      // if player code !== secret code
        // --> init next round
      const newRound = initNewRound(currRound)

      setState({
        currRound: newRound.currRound,
        rounds: {
          ...rounds,
          [newRound.currRound.toString()]: newRound.newRoundObj
        }
      })
      console.log({ store, currRound })
    })
  }
}

const main = () => {
  addListeners()
}

main()
