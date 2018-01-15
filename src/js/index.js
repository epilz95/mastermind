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

import { COLORS, MAX_CODE_LENGTH } from './config'

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

  message.style.top = `${currTop - currHeight - 9}px`

  if (checkButton) {
    checkButton.style.top = `${currTop - currHeight - 9}px`
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
  const buttonCheck = document.querySelector('.button--check')

  if (buttonStart) {
    buttonStart.addEventListener('click', (e: MouseEvent) => {
      const secCodeNodesArray = Array.from(document.querySelectorAll('.secret-code .position'))

      initGame({
        stateSetterFnc: setState,
        codeGenFnc: generateCode,
        setSecretCodeFnc: setSecretCode,
        roundInitializer: initNewRound,
        colorPalet: COLORS,
        secCodeNodesArray: secCodeNodesArray
      })

      if (buttonCheck) buttonCheck.classList.remove('button--inactive')
      buttonStart.innerHTML = 'Restart'

      const secCodeRowNode = document.querySelector('.secret-code')
      if (secCodeRowNode) secCodeRowNode.classList.remove('secret-code--visible')

      const rowNodesArray = Array.from(document.querySelectorAll('.panel__row'))
      markActiveRow(rowNodesArray)

      // if someone clicks start again
      if (typeof store.paletNode !== 'undefined') {
        if (positionNodes) {
          positionNodes.forEach(node => {
            if (node.parentElement && node.parentElement.parentElement) {
              const parentRowNode = node.parentElement.parentElement
              if (parentRowNode.classList.contains('secret-code')) return
            }

            node.style.backgroundColor = ''
          })
        }

        setState({
          paletNode: undefined,
          currRowNode: undefined
        })

        const hints = document.querySelectorAll('.result')
        const messages = document.querySelectorAll('.message')
        const checkButton = document.querySelector('.button--check')

        hints.forEach(hint => hint.classList.remove('fail', 'halfway', 'success'))

        if (messages) {
          messages.forEach(message => {
            message.style.top = ''
            message.style.display = 'none'
          })
        }

        if (checkButton) checkButton.style.top = ''
      }

      console.log({store})
    })
  }

  if (buttonCheck) {
    buttonCheck.addEventListener('click', () => {
      if (typeof store.currRound === 'undefined') return

      const { currRound, rounds, secretCode } = store
      const currRoundObj = currRound
        ? rounds[currRound]
        : undefined

      const playerCode = currRoundObj
        ? currRoundObj.playerCode
        : {}

      const isValidCode = checkCodeLength(playerCode, MAX_CODE_LENGTH)
      const errorMessage = document.querySelector('.error')

      if (!isValidCode && errorMessage) {
        errorMessage.style.display = 'block'
      } else if (errorMessage) {
        errorMessage.style.display = 'none'
      }

      if (!isValidCode) return

      const { hints, isCorrect } = compareCodes(playerCode, secretCode, MAX_CODE_LENGTH)

      if (store.paletNode) {
        setState({ currRowNode: store.paletNode.parentNode.parentNode })

        const hintNodesArray = Array.from(store.currRowNode.querySelectorAll('.result'))

        const convertedHints = fillWithNones(hints, 4)

        displayHints(convertedHints, hintNodesArray)
      }

      const maxTries = 12
      const messages = document.querySelectorAll('.message')

      messages.forEach(message => {
        if (isCorrect) return
        if (store.currRound && store.currRound >= maxTries && !isCorrect) return
        moveItemsPerRound(message, buttonCheck)
      })

      const secCodeRowNode = document.querySelector('.secret-code')
      const winMessage = document.querySelector('.win')
      const tryCount = currRound
        ? currRound.toString()
        : undefined

      if (isCorrect && winMessage && tryCount) {
        const winMsgContent = winMessage.querySelector('span')

        winMessage.style.display = 'block'
        if (winMsgContent) winMsgContent.textContent = `You won the game with ${tryCount} tries!`
      } else if (winMessage) {
        winMessage.style.display = 'none'
      }

      if (isCorrect) {
        if (secCodeRowNode) secCodeRowNode.classList.add('secret-code--visible')
        if (buttonCheck) buttonCheck.classList.add('button--inactive')

        return
      }

      if (
        secCodeRowNode &&
        store.currRound &&
        store.currRound >= maxTries &&
        !isCorrect) {
        const loseMessage = document.querySelector('.lose')

        if (loseMessage) loseMessage.style.display = 'block'
        secCodeRowNode.classList.add('secret-code--visible')
        buttonCheck.classList.add('button--inactive')

        return
      }

      const newRound = initNewRound(currRound)

      setState({
        currRound: newRound.currRound,
        rounds: {
          ...rounds,
          [newRound.currRound.toString()]: newRound.newRoundObj
        }
      })

      const rowNodesArray = Array.from(document.querySelectorAll('.panel__row'))
      markActiveRow(rowNodesArray)
    })
  }
}

const main = () => {
  addListeners()
}

main()
