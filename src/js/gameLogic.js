// @flow

import type {
  Color,
  Colors,
  ColorCode
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
