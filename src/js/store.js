// @flow

export let store = {
  paletNode: undefined,
  currRowNode: undefined,
  secretCode: {},
  currRound: undefined,
  rounds: {}
}

export const setState = (newState: Object) => {
  store = { ...store, ...newState }

  return newState
}
