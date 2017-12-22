import {
  generateCode,
  initNewRound,
  addColorToRound,
  checkCodeLength,
  convertToColorCode
} from '../gameLogic'

import { COLORS } from '../config'

describe('generateCode()', () => {
  it('should generate a color array with specific number of items', () => {
    const count = 4

    expect(generateCode(COLORS, count).length).toBe(4)
  })

  it('should return result with values from input array', () => {
    const result = generateCode(COLORS, 4)

    result.forEach(i => {
      expect(COLORS.find((el) => el.name === i.name)).not.toBe(undefined)
    })
  })
})

describe('initNewRound()', () => {
  it('should return first round if current round is undefined', () => {
    const { currRound, newRoundObj } = initNewRound(undefined)

    expect(currRound).toBe(1)

    expect(newRoundObj).toEqual({
      id: '1',
      playerCode: {}
    })
  })

  it('should return next round', () => {
    const { currRound, newRoundObj } = initNewRound(1)

    expect(currRound).toBe(2)

    expect(newRoundObj).toEqual({
      id: '2',
      playerCode: {}
    })
  })
})

describe('addColorToRound', () => {
  const setUp = (configOverwrite) => {
    const config = {
      stateSetterFnc: jest.fn(),
      currRound: '2',
      rounds: {
        '1': {
          id: '1',
          playerCode: {
            color1: '#324234',
            color2: '#324234',
            color3: '#324234',
            color4: '#324234'
          }
        },
        '2': {
          id: '2',
          playerCode: {
            color1: '#324234',
            color2: '#324234'
          }
        }
      },
      color: '#2daae2',
      position: 'color1',
      ...configOverwrite
    }

    const result = addColorToRound(config)

    return {
      config,
      result
    }
  }

  it('should return updated state', () => {
    const { result } = setUp()

    expect(result).toEqual({
      rounds: {
        '1': {
          id: '1',
          playerCode: {
            color1: '#324234',
            color2: '#324234',
            color3: '#324234',
            color4: '#324234'
          }
        },
        '2': {
          id: '2',
          playerCode: {
            color1: '#2daae2',
            color2: '#324234'
          }
        }
      }
    })
  })

  it('should call setState with correct argument', () => {
    const { stateSetterFnc } = setUp().config

    // check if setStateMock has been called exactly once
    expect(stateSetterFnc.mock.calls.length).toBe(1)

    // check if setSTateMock has been called with right argument
    expect(stateSetterFnc.mock.calls[0][0]).toEqual({
      rounds: {
        '1': {
          id: '1',
          playerCode: {
            color1: '#324234',
            color2: '#324234',
            color3: '#324234',
            color4: '#324234'
          }
        },
        '2': {
          id: '2',
          playerCode: {
            color1: '#2daae2',
            color2: '#324234'
          }
        }
      }
    })
  })
})

describe('checkCodeLength', () => {
  it('should return true if playerCode has 4 items', () => {
    const playerCode = {
      color1: '#324234',
      color2: '#324234',
      color3: '#324234',
      color4: '#324234'
    }

    expect(checkCodeLength(playerCode)).toBe(true)
  })

  it('should return false if playerCode has less than 4 items', () => {
    const playerCode = {
      color1: '#324234',
      color2: '#324234'
    }

    expect(checkCodeLength(playerCode)).toBe(false)
  })
})

describe('converToColorCode()', () => {
  it('should convert array of colors to colocCode object', () => {
    expect(convertToColorCode([
      { color: '#abc' },
      { color: '#def' }
    ])).toEqual({
      color1: '#abc',
      color2: '#def'
    })
  })
})
