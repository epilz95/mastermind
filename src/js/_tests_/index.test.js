import {
  initGame,
  generateCode,
  initNewRound,
  addColorToRound
   } from '../index'

describe('initGame()', () => {
  const setUp = (configOverwrite) => {
    const config = {
      stateSetterFnc: () => {},
      codeGenFnc: () => 'placeholder',
      roundInitializer: () => {
        return {
          currRound: 'placeholder',
          newRoundObj: {}
        }
      },
      colorPalet: [],
      ...configOverwrite
    }

    const result = initGame(config)

    return {
      result,
      config
    }
  }

  it('should call code generator', () => {
    const { config } = setUp({
      codeGenFnc: jest.fn()
    })

    expect(config.codeGenFnc.mock.calls.length).toBe(1)
  })

  it('should call setState func', () => {
    const { config } = setUp({
      stateSetterFnc: jest.fn()
    })

    const mockCalls = config.stateSetterFnc.mock.calls

    expect(mockCalls.length).toBe(1)

    expect(mockCalls[0]).toEqual([{
      secretCode: expect.anything(),
      currRound: 'placeholder',
      rounds: {
        'placeholder': {}
      }
    }])
  })

  it('should call roundInitializer to init first round', () => {
    const { config } = setUp({
      roundInitializer: jest.fn().mockReturnValue({
        currRound: 'placeholder',
        newRoundObj: {}
      })
    })

    expect(config.roundInitializer.mock.calls.length).toBe(1)
  })
})

describe('generateCode()', () => {
  const COLORS = [
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
