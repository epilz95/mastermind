import { theStringMachine } from '../index'
 // number -> 'Number: <number>'
// string -> '<string>, YAY!'
describe('theStringMachine()', () => {
  it('should print "Number: <number>"', () => {
    expect(theStringMachine(8)).toBe('Number: 8')
  })

  it('should print "<string>, YAY!"', () => {
    expect(theStringMachine('Heya')).toBe('Heya, YAY!')
  })

  it('should handle every other value', () => {
    expect(theStringMachine({ name: 'eva' })).toBe('What the hell is this???')
  })
})
