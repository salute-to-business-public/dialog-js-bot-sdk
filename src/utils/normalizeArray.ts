/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

function normalizeArray<T>(value: undefined | null | T | Array<T>): Array<T> {
  return value ? (Array.isArray(value) ? value : [value]) : [];
}

export default normalizeArray;
