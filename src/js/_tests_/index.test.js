import { initGame, generateCode } from '../index'

describe('initGame()', () => {
  it('should call code generator', () => {
    const codeGenMock = jest.fn()

    initGame(() => {}, codeGenMock)

    expect(codeGenMock.mock.calls.length).toBe(1)
  })

  it('should call setState func', () => {
    const setStateMock = jest.fn()

    initGame(setStateMock, () => {})

    expect(setStateMock.mock.calls.length).toBe(1)
  })
})

describe('generateCode()', () => {
  const COLORS: Colors = [
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
