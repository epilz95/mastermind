import {
  initGame
} from '../index'

describe('initGame()', () => {
  const colors = [ { color: '#ffffff' }, { color: '#000000' } ]

  const setUp = (configOverwrite) => {
    const config = {
      stateSetterFnc: () => {},
      codeGenFnc: () => colors,
      setSecretCodeFnc: () => {},
      roundInitializer: () => {
        return {
          currRound: 'placeholder',
          newRoundObj: {}
        }
      },
      colorPalet: colors,
      secCodeNodesArray: [],
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
      codeGenFnc: jest.fn().mockReturnValue(colors)
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
}) // end initGame()
