// @flow

import { immutablyDeleteProperty } from 'functionstein'

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

export const compareCodes = (playerCode: ColorCode, secretCode: ColorCode): {|
  isCorrect: boolean,
  hints: Hints
|} => {
  // TODO
  const { newPlayerCode, newSecretCode, blacks } = checkColorAndPosition(playerCode, secretCode)
  const { whites } = checkColors(newPlayerCode, newSecretCode)

  // TODO gen array from whites and blacks

  return {
    isCorrect: false,
    hints: [ null, null, null, null ]
  }
}

export const checkColorAndPosition = (playerCode: ColorCode, secretCode: ColorCode) => {
  return Object.keys(playerCode)
    .reduce((acc, k) => {
      const isMatch = playerCode[k] === secretCode[k]
      const newPlayerCode = isMatch
        ? immutablyDeleteProperty(acc.newPlayerCode, k)
        : acc.newPlayerCode
      const newSecretCode = isMatch
        ? immutablyDeleteProperty(acc.newSecretCode, k)
        : acc.newSecretCode
      const blacks = isMatch
        ? [ ...acc.blacks, 'black' ]
        : acc.blacks

      return {
        newPlayerCode,
        newSecretCode,
        blacks
      }
    }, {
      newPlayerCode: playerCode,
      newSecretCode: secretCode,
      blacks: []
    })
}

export const checkColors = (playerCode: ColorCode, secretCode: ColorCode) => {
  // convert code Objects to array?
  // return Object with number of white matches (for the hints array)
}

// create the hints array: number of black matches, number of white matches, number resting to 4
