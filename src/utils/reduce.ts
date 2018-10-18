/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

function reduce<T, R>(array: Array<T>, initialState: R, reducer: (state: R, value: T) => R): R {
  return array.reduce(reducer, initialState);
}

export default reduce;
