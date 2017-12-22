import {
  addColorToRound,
  checkCodeLength,
  compareCodes,
  convertToColorCode,
  generateCode,
  initNewRound
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
}) // end generateCode()

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
}) // end initNewRound()

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
}) // end addColorToRound()

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
}) // end checkCodeLength()

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
}) // end convertToColorCode()

describe('compareCodes()', () => {
  it('should return hints as an array of nulls if no color is correct', () => {
    const playerCode = {
      color1: 'blue',
      color2: 'red',
      color3: 'green',
      color4: 'orange'
    }

    const secretCode = {
      color1: 'purple',
      color2: 'yellow',
      color3: 'darkgreen',
      color4: 'black'
    }

    const { hints } = compareCodes(playerCode, secretCode)

    expect(hints).toEqual([ null, null, null, null ])
  })

  it('should return hints with one "white" if one color is correct at the wrong position', () => {
    const playerCode = {
      color1: 'blue',
      color2: 'red',
      color3: 'green',
      color4: 'orange'
    }

    const secretCode = {
      color1: 'purple',
      color2: 'blue',
      color3: 'darkgreen',
      color4: 'black'
    }

    const { hints } = compareCodes(playerCode, secretCode)

    expect(hints).toEqual([ 'white', null, null, null ])
  })

  it('should return hints with one "black" if one color is correct at the right position', () => {
    const playerCode = {
      color1: 'blue',
      color2: 'red',
      color3: 'green',
      color4: 'orange'
    }

    const secretCode = {
      color1: 'purple',
      color2: 'red',
      color3: 'darkgreen',
      color4: 'black'
    }

    const { hints } = compareCodes(playerCode, secretCode)

    expect(hints).toEqual([ 'black', null, null, null ])
  })

  it('should return hints with four "white" if all colors are correct, but at the wrong position', () => {
    const playerCode = {
      color1: 'red',
      color2: 'purple',
      color3: 'black',
      color4: 'darkgreen'
    }

    const secretCode = {
      color1: 'purple',
      color2: 'red',
      color3: 'darkgreen',
      color4: 'black'
    }

    const { hints } = compareCodes(playerCode, secretCode)

    expect(hints).toEqual([ 'white', 'white', 'white', 'white' ])
  })

  it('should return hints with four "black" if all colors are correct at the right position', () => {
    const playerCode = {
      color1: 'purple',
      color2: 'red',
      color3: 'darkgreen',
      color4: 'black'
    }

    const secretCode = {
      color1: 'purple',
      color2: 'red',
      color3: 'darkgreen',
      color4: 'black'
    }

    const { hints } = compareCodes(playerCode, secretCode)

    expect(hints).toEqual([ 'black', 'black', 'black', 'black' ])
  })

  it('should return hints with one "white" and one "black" if one colors is correct at the wrong position and one is correct at the right position', () => {
    const playerCode = {
      color1: 'green',
      color2: 'orange',
      color3: 'darkgreen',
      color4: 'purple'
    }

    const secretCode = {
      color1: 'purple',
      color2: 'red',
      color3: 'darkgreen',
      color4: 'black'
    }

    const { hints } = compareCodes(playerCode, secretCode)

    expect(hints).toEqual([ 'black', 'white', null, null ])
  })

  it('should evaluate color doubles separately', () => {
    const playerCode = {
      color1: 'green',
      color2: 'green',
      color3: 'orange',
      color4: 'purple'
    }

    const secretCode = {
      color1: 'green',
      color2: 'red',
      color3: 'green',
      color4: 'black'
    }

    const { hints } = compareCodes(playerCode, secretCode)

    expect(hints).toEqual([ 'black', 'white', null, null ])
  })

  it('should return isCorrect === false if codes don\'t match', () => {
    const playerCode = {
      color1: 'green',
      color2: 'green',
      color3: 'orange',
      color4: 'purple'
    }

    const secretCode = {
      color1: 'green',
      color2: 'red',
      color3: 'green',
      color4: 'black'
    }

    const { isCorrect } = compareCodes(playerCode, secretCode)

    expect(isCorrect).toBe(false)
  })

  it('should return isCorrect === true if codes match', () => {
    const playerCode = {
      color1: 'green',
      color2: 'red',
      color3: 'green',
      color4: 'black'
    }

    const secretCode = {
      color1: 'green',
      color2: 'red',
      color3: 'green',
      color4: 'black'
    }

    const { isCorrect } = compareCodes(playerCode, secretCode)

    expect(isCorrect).toBe(true)
  })
}) // end compareCodes()
