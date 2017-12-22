// @flow

export type Color = {|
  name: string,
  color: string
|}

export type Colors = Array<Color>

export type ColorPosition = string
export type ColorHex = string

export type ColorCode = { [ColorPosition]: ColorHex }
