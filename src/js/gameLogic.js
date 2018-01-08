// @flow

import { immutablyDeleteProperty, objToArray } from 'functionstein'

import type {
  Color,
  Colors,
  ColorCode,
  Hints
} from './types'

export const getRandomColor = (array: Colors): Color => array[Math.floor(Math.random() * array.length)]

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

export const checkCodeLength = (playerCode: Object) => {
  return Object.keys(playerCode).length === 4
}

export const checkColorAndPosition = (playerCode: ColorCode, secretCode: ColorCode) => {
  return Object.keys(playerCode)
    .reduce((acc, k) => {
      const isMatch = playerCode[k] === secretCode[k]
      const newPlayerCode = isMatch
        ? immutablyDeleteProperty(acc.playerCode, k)
        : acc.playerCode
      const newSecretCode = isMatch
        ? immutablyDeleteProperty(acc.secretCode, k)
        : acc.secretCode
      const blacks = isMatch
        ? [ ...acc.blacks, 'black' ]
        : acc.blacks

      return {
        playerCode: newPlayerCode,
        secretCode: newSecretCode,
        blacks
      }
    }, {
      playerCode,
      secretCode,
      blacks: []
    })
}

export const checkColors = (playerCode: ColorCode, secretCode: ColorCode) => {
  const arrPlayer = objToArray(playerCode)
  const arrSecret = objToArray(secretCode)

  const whites = arrPlayer.reduce((acc, val, i, arr) => {
    const firstMatch = acc.arrSecret.indexOf(val)
    const hasMatch = firstMatch !== -1

    const newArrSecret = hasMatch
      ? [ ...acc.arrSecret.slice(0, firstMatch), ...acc.arrSecret.slice(firstMatch + 1) ]
      : acc.arrSecret

    const whites = hasMatch
      ? [ ...acc.whites, 'white' ]
      : acc.whites

    if (i < arr.length - 1) {
      return {
        arrSecret: newArrSecret,
        whites
      }
    }

    return whites
  }, {
    arrSecret,
    whites: []
  })

  return whites
}

export const compareCodes = (playerCode: ColorCode, secretCode: ColorCode): {|
  isCorrect: boolean,
  hints: Hints
|} => {
  const result = checkColorAndPosition(playerCode, secretCode)
  const { blacks } = result
  const newPlayerCode = result.playerCode
  const newSecretCode = result.secretCode

  const whites = checkColors(newPlayerCode, newSecretCode)

  const isCorrect = blacks.length === 4

  const hints = [ ...blacks, ...whites ]

  // console.log({playerCode}, {secretCode}, {isCorrect}, {hints})

  return {
    isCorrect,
    hints
  }
}

export const displayHints = (playerCode: ColorCode, secretCode: ColorCode) => {
  const result = compareCodes(playerCode, secretCode)
  const hints = result.hints
  let newHints = []

  // if (result.isCorrect)

  if (hints.length === 0) {
    newHints = [ -1, -1, -1, -1 ]
  } else if (hints.length === 1) {
    newHints = [ ...hints, -1, -1, -1 ]
  } else if (hints.length === 2) {
    newHints = [ ...hints, -1, -1 ]
  } else if (hints.length === 3) {
    newHints = [ ...hints, -1 ]
  } else {
    newHints = [ ...hints ]
  }

  const convertedHints = newHints.map(hint => {
    if (hint === 'black') return 1
    if (hint === 'white') return 0
    if (hint === -1) return -1
  })

  console.log({hints}, {newHints}, {convertedHints})
}
