// @flow

export let store = {
  isStarted: false,
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
