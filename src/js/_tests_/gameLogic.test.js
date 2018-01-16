import {
  addColorToRound,
  checkCodeLength,
  checkColorAndPosition,
  checkColors,
  compareCodes,
  convertToColorCode,
  generateCode,
  initNewRound,
  fillWithNones
} from '../gameLogic'

import { COLORS, MAX_CODE_LENGTH } from '../config'

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

    const maxCodeLength = MAX_CODE_LENGTH

    expect(checkCodeLength(playerCode, maxCodeLength)).toBe(true)
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
  it('should return hints as an empty array if no color is correct', () => {
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

    const maxCodeLength = MAX_CODE_LENGTH

    const { hints } = compareCodes(playerCode, secretCode, maxCodeLength)

    expect(hints).toEqual([])
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

    const maxCodeLength = MAX_CODE_LENGTH

    const { hints } = compareCodes(playerCode, secretCode, maxCodeLength)

    expect(hints).toEqual([ 'white' ])
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

    const maxCodeLength = MAX_CODE_LENGTH

    const { hints } = compareCodes(playerCode, secretCode, maxCodeLength)

    expect(hints).toEqual([ 'black' ])
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

    const maxCodeLength = MAX_CODE_LENGTH

    const { hints } = compareCodes(playerCode, secretCode, maxCodeLength)

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

    const maxCodeLength = MAX_CODE_LENGTH

    const { hints } = compareCodes(playerCode, secretCode, maxCodeLength)

    expect(hints).toEqual([ 'black', 'black', 'black', 'black' ])
  })

  it('should return hints with one "white" and one "black" if one color is correct at the wrong position and one is correct at the right position', () => {
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

    const maxCodeLength = MAX_CODE_LENGTH

    const { hints } = compareCodes(playerCode, secretCode, maxCodeLength)

    expect(hints).toEqual([ 'black', 'white' ])
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

    const maxCodeLength = MAX_CODE_LENGTH

    const { hints } = compareCodes(playerCode, secretCode, maxCodeLength)

    expect(hints).toEqual([ 'black', 'white' ])
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

    const maxCodeLength = MAX_CODE_LENGTH

    const { isCorrect } = compareCodes(playerCode, secretCode, maxCodeLength)

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

    const maxCodeLength = MAX_CODE_LENGTH

    const { isCorrect } = compareCodes(playerCode, secretCode, maxCodeLength)

    expect(isCorrect).toBe(true)
  })
}) // end compareCodes()

describe('checkColorAndPosition()', () => {
  const setUp = (playerCodeOW, secretCodeOW) => {
    const playerCode = {
      color1: 'green',
      color2: 'red',
      color3: 'green',
      color4: 'black',
      ...playerCodeOW
    }

    const secretCode = {
      color1: 'yellow',
      color2: 'blue',
      color3: 'red',
      color4: 'green',
      ...secretCodeOW
    }

    const result = checkColorAndPosition(playerCode, secretCode)

    return {
      result,
      playerCode,
      secretCode
    }
  }

  it('should return both codes unaltered and empty array if there is no match with color and position', () => {
    const { result, playerCode, secretCode } = setUp()

    expect(result).toEqual({
      playerCode,
      secretCode,
      blacks: []
    })
  })

  it('should return both codes without matching entries and array with correct amount of matches', () => {
    const { result } = setUp({ color1: 'yellow', color2: 'blue' })

    const playerCode = { color3: 'green', color4: 'black' }
    const secretCode = { color3: 'red', color4: 'green' }
    const blacks = [ 'black', 'black' ]

    expect(result).toEqual({
      playerCode,
      secretCode,
      blacks
    })
  })
}) // end checkColorAndPosition()

describe('checkColors()', () => {
  const setUp = (playerCodeOW, secretCodeOW) => {
    const playerCode = {
      color1: 'purple',
      color2: 'red',
      color3: 'green',
      color4: 'black',
      ...playerCodeOW
    }

    const secretCode = {
      color1: 'cyan',
      color2: 'blue',
      color3: 'white',
      color4: 'yellow',
      ...secretCodeOW
    }

    const whites = checkColors(playerCode, secretCode)

    return whites
  }

  it('should return empty result array if there are no matches', () => {
    const whites = setUp()

    expect(whites).toEqual([])
  })

  it('should return correct amount of matches without duplicates inside result array', () => {
    const whites = setUp({ color2: 'white', color3: 'blue' })

    expect(whites).toEqual([ 'white', 'white' ])
  })

  it('should return correct amount of matches with duplicates inside result array', () => {
    const whites = setUp(
      { color1: 'white', color2: 'white' },
       { color3: 'white', color4: 'white' }
    )

    expect(whites).toEqual([ 'white', 'white' ])
  })
}) // end checkColors()

describe('fillWithNones()', () => {
  it('should fill hint-array with \'none\' values until total length is reached', () => {
    const result = fillWithNones([ 'black', 'black' ], 4)

    expect(result).toEqual([ 'black', 'black', 'none', 'none' ])
  })
})
