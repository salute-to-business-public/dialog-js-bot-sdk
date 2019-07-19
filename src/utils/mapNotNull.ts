/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

function mapNotNull<T, R>(
  collection: Array<T>,
  mapper: (value: T) => R | null | undefined,
): Array<R> {
  const result: Array<R> = [];
  collection.forEach((value) => {
    const mapped = mapper(value);
    if (mapped !== null && typeof mapped !== 'undefined') {
      result.push(mapped);
    }
  });

  return result;
}

export default mapNotNull;
