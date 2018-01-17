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

export const checkCodeLength = (playerCode: Object, maxCodeLength: number) => {
  return Object.keys(playerCode).length === maxCodeLength
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

export const compareCodes = (playerCode: ColorCode, secretCode: ColorCode, maxCodeLength: number): {|
  isCorrect: boolean,
  hints: Hints
|} => {
  const result = checkColorAndPosition(playerCode, secretCode)
  const { blacks } = result
  const newPlayerCode = result.playerCode
  const newSecretCode = result.secretCode

  const whites = checkColors(newPlayerCode, newSecretCode)

  const isCorrect = blacks.length === maxCodeLength

  const hints = [ ...blacks, ...whites ]

  return {
    isCorrect,
    hints
  }
}

export const fillWithNones = (hints: Hints, totalLength: number): Hints => {
  if (hints.length === totalLength) return hints

  return fillWithNones([ ...hints, 'none' ], totalLength)
}
