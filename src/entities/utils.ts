/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

interface ProtoValue<T> {
  value?: null | T;
}

export function getOpt<T, R>(value?: null | ProtoValue<T>, defaultValue?: R) {
  return value ? value.value ? value.value : defaultValue : defaultValue;
}

