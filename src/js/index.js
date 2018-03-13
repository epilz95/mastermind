// @flow

// $FlowFixMe
import 'normalize.css'
// $FlowFixMe
import '../sass/main.scss'

import { objToArray } from 'functionstein'

import type {
  Hints,
  Colors
} from './types'

import { COLORS, MAX_CODE_LENGTH, MAX_TRIES } from './config'

import { setState, store } from './store'

import {
  addColorToRound,
  checkCodeLength,
  convertToColorCode,
  generateCode,
  initNewRound,
  compareCodes,
  fillWithNones
} from './gameLogic'

const showColorPalet = (e, colorPalet: ?HTMLElement, codeNode: ?HTMLElement) => {
  e.stopPropagation()

  if (colorPalet && codeNode) {
    setState({ paletNode: e.target })

    if (store.paletNode && store.paletNode.parentElement) {
      const currRowNode = store.paletNode.parentElement.parentElement
      const currRowNumber = parseInt(currRowNode.getAttribute('data-row'))

      if (currRowNumber !== store.currRound) return
    }

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

const setSecretCode = (secretCodeVals: ?Array<any>, secCodeNodesArray: ?Array<any>) => {
  if (!secretCodeVals) return

  secretCodeVals.forEach((colorVal, i) => {
    if (!secCodeNodesArray) return

    const currentNode = secCodeNodesArray[i]

    if (!currentNode) return

    currentNode.style.backgroundColor = colorVal
  })
}

export const initGame = ({
  stateSetterFnc,
  codeGenFnc,
  setSecretCodeFnc,
  roundInitializer,
  colorPalet,
  secCodeNodesArray
}: {
  stateSetterFnc: Function,
  codeGenFnc: Function,
  setSecretCodeFnc: Function,
  roundInitializer: Function,
  colorPalet: Colors,
  secCodeNodesArray: Array<any>
}) => {
  const colorArray = codeGenFnc(colorPalet, 4)
  const secretCode = convertToColorCode(colorArray)

  const newRound = roundInitializer(undefined)

  stateSetterFnc({
    secretCode,
    currRound: newRound.currRound,
    rounds: { [newRound.currRound.toString()]: newRound.newRoundObj }
  })

  const secretCodeVals = objToArray(store.secretCode)

  if (secretCodeVals) setSecretCodeFnc(secretCodeVals, secCodeNodesArray)
}

export const displayHints = (hints: Hints, hintNodesArray: ?Array<any>) => {
  hints.forEach((h, i) => {
    if (!hintNodesArray) return

    const currentNode = hintNodesArray[i]

    if (!currentNode) return

    if (h === 'black') {
      currentNode.classList.add('success')
      return
    }

    if (h === 'white') {
      currentNode.classList.add('halfway')
      return
    }

    if (h === 'none') {
      currentNode.classList.add('fail')
    }
  })
}

const moveItemsPerRound = (message: ?HTMLElement, checkButton: ?HTMLElement) => {
  if (!store.currRowNode || !message) return

  const currTop = store.currRowNode.offsetTop
  const currHeight = store.currRowNode.offsetHeight

  message.style.top = `${currTop - currHeight - 13}px`

  if (checkButton) {
    checkButton.style.top = `${currTop - currHeight - 13}px`
  }
}

const markActiveRow = (rowNodesArray: Array<any>) => rowNodesArray.forEach(node => {
  const isCurrRound = parseInt(node.getAttribute('data-row')) === store.currRound

  if (isCurrRound) {
    node.classList.add('panel__row--active')
  } else {
    node.classList.remove('panel__row--active')
  }
})

const startGame = () => {
  const secCodeNodesArray = Array.from(document.querySelectorAll('.secret-code .position'))

  initGame({
    stateSetterFnc: setState,
    codeGenFnc: generateCode,
    setSecretCodeFnc: setSecretCode,
    roundInitializer: initNewRound,
    colorPalet: COLORS,
    secCodeNodesArray: secCodeNodesArray
  })

  const buttonCheck = document.querySelector('.button--check')
  if (buttonCheck) buttonCheck.classList.remove('button--inactive')

  const secCodeRowNode = document.querySelector('.secret-code')
  if (secCodeRowNode) secCodeRowNode.classList.remove('secret-code--visible')

  const rowNodesArray = Array.from(document.querySelectorAll('.panel__row'))
  markActiveRow(rowNodesArray)
}

const addStartButtonListeners = () => {
  const buttonStart = document.querySelector('.button-start')

  if (!buttonStart) return

  buttonStart.addEventListener('click', (e: MouseEvent) => {
    startGame()

    const buttonRestart = document.querySelector('.button-restart')

    buttonStart.style.display = 'none'
    if (buttonRestart) buttonRestart.style.display = 'block'
  })
}

const addRestartButtonListeners = () => {
  const buttonRestart = document.querySelector('.button-restart')

  if (!buttonRestart) return

  buttonRestart.addEventListener('click', (e: MouseEvent) => {
    startGame()

    const positionNodes = document.querySelectorAll('.position')

    if (positionNodes) {
      positionNodes.forEach(node => {
        node.removeAttribute('disabled')

        if (node.parentElement && node.parentElement.parentElement) {
          const parentRowNode = node.parentElement.parentElement
          if (parentRowNode.classList.contains('secret-code')) return
        }

        node.style.backgroundColor = ''
      })
    }

    const buttonStart = document.querySelector('.button-start')
    const hints = document.querySelectorAll('.result')
    const messages = document.querySelectorAll('.message')
    const checkButton = document.querySelector('.button--check')

    if (buttonStart) buttonStart.style.display = 'none'
    buttonRestart.style.display = 'block'

    hints.forEach(hint => hint.classList.remove('fail', 'halfway', 'success'))

    if (messages) {
      messages.forEach(message => {
        message.style.top = ''
        message.style.display = 'none'
      })
    }

    if (checkButton) checkButton.style.top = ''
  })
}

const validateCode = (playerCode) => {
  const isValidCode = checkCodeLength(playerCode, MAX_CODE_LENGTH)

  const errorMessage = document.querySelector('.error')

  if (!isValidCode && errorMessage) {
    errorMessage.style.display = 'block'
  } else if (errorMessage) {
    errorMessage.style.display = 'none'
  }

  return isValidCode
}

const renderHints = (hints) => {
  if (store.paletNode) {
    // set the currRowNode to the state to select corresponding hintNodes
    setState({ currRowNode: store.paletNode.parentNode.parentNode })

    const hintNodesArray = Array.from(store.currRowNode.querySelectorAll('.result'))

    // fill hints to have specified length
    const convertedHints = fillWithNones(hints, MAX_CODE_LENGTH)

    // display the hints
    displayHints(convertedHints, hintNodesArray)
  }
}

const moveCheckAndMsg = (isCorrect, buttonCheck) => {
  const messages = document.querySelectorAll('.message')

  // move messages and checkButton up
  messages.forEach(message => {
    if (isCorrect) return
    if (store.currRound && store.currRound >= MAX_TRIES && !isCorrect) return
    moveItemsPerRound(message, buttonCheck)
  })
}

const handleWin = (secCodeRowNode, currRound, buttonCheck) => {
  if (secCodeRowNode) secCodeRowNode.classList.add('secret-code--visible')
  if (buttonCheck) buttonCheck.classList.add('button--inactive')

  const winMessage = document.querySelector('.win')
  const tryCount = currRound
    ? currRound.toString()
    : undefined

  if (!winMessage) return

  winMessage.style.display = 'block'

  const winMsgContent = winMessage.querySelector('span')

  if (!winMsgContent) return
  winMsgContent.textContent = tryCount
    ? `You won the game with ${tryCount} tries!`
    : 'Congrats - you have won the game!'
}

const handleLoss = (secCodeRowNode, buttonCheck) => {
  const loseMessage = document.querySelector('.lose')
  if (loseMessage) loseMessage.style.display = 'block'

  if (secCodeRowNode) secCodeRowNode.classList.add('secret-code--visible')

  if (buttonCheck) buttonCheck.classList.add('button--inactive')
}

const handleCheckButton = (e: MouseEvent) => {
  if (typeof store.currRound === 'undefined') return

  const { currRound, rounds, secretCode } = store
  const currRoundObj = currRound
    ? rounds[currRound]
    : undefined

  const playerCode = currRoundObj
    ? currRoundObj.playerCode
    : {}

  const isValidCode = validateCode(playerCode)
  if (!isValidCode) return

  const { hints, isCorrect } = compareCodes(playerCode, secretCode, MAX_CODE_LENGTH)

  renderHints(hints)

  const buttonCheck = (e.target instanceof HTMLButtonElement)
    ? e.target
    : undefined

  moveCheckAndMsg(isCorrect, buttonCheck)

  const secCodeRowNode = document.querySelector('.secret-code')

  if (isCorrect) {
    handleWin(secCodeRowNode, currRound, buttonCheck)

    const positionNodes = document.querySelectorAll('.position')
    positionNodes.forEach(node => node.setAttribute('disabled', ''))

    return
  }

  const gameOver = (
    store.currRound &&
    store.currRound >= MAX_TRIES &&
    !isCorrect
  )

  if (gameOver) {
    handleLoss(secCodeRowNode, buttonCheck)

    const positionNodes = document.querySelectorAll('.position')
    positionNodes.forEach(node => node.setAttribute('disabled', ''))

    return
  }

  // if no win or lose case has occurred, init new round and update state
  const newRound = initNewRound(currRound)

  setState({
    currRound: newRound.currRound,
    rounds: {
      ...rounds,
      [newRound.currRound.toString()]: newRound.newRoundObj
    }
  })

  // add class active to current row
  const rowNodesArray = Array.from(document.querySelectorAll('.panel__row'))
  markActiveRow(rowNodesArray)
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

  addStartButtonListeners()
  addRestartButtonListeners()

  const buttonCheck = document.querySelector('.button--check')

  if (buttonCheck) {
    buttonCheck.addEventListener('click', handleCheckButton)
  }
}

const main = () => {
  addListeners()
}

main()

// TEST
