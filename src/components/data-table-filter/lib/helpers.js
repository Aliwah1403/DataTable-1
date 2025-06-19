import { isBefore } from 'date-fns'

export function getColumn(columns, id) {
  const column = columns.find((c) => c.id === id)

  if (!column) {
    throw new Error(`Column with id ${id} not found`)
  }

  return column
}

export function createNumberFilterValue(values) {
  if (!values || values.length === 0) return []
  if (values.length === 1) return [values[0]]
  if (values.length === 2) return createNumberRange(values);
  return [values[0], values[1]]
}

export function createDateFilterValue(
  values,
) {
  if (!values || values.length === 0) return []
  if (values.length === 1) return [values[0]]
  if (values.length === 2) return createDateRange(values);
  throw new Error('Cannot create date filter value from more than 2 values')
}

export function createDateRange(values) {
  const [a, b] = values
  const [min, max] = isBefore(a, b) ? [a, b] : [b, a]

  return [min, max]
}

export function createNumberRange(values) {
  let a = 0
  let b = 0

  if (!values || values.length === 0) return [a, b]
  if (values.length === 1) {
    a = values[0]
  } else {
    a = values[0]
    b = values[1]
  }

  const [min, max] = a < b ? [a, b] : [b, a]

  return [min, max]
}

export function isColumnOption(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'label' in value
  )
}

export function isColumnOptionArray(value) {
  return Array.isArray(value) && value.every(isColumnOption);
}

export function isStringArray(value) {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

export function isColumnOptionMap(value) {
  if (!(value instanceof Map)) {
    return false
  }
  for (const key of value.keys()) {
    if (typeof key !== 'string') {
      return false
    }
  }
  for (const val of value.values()) {
    if (typeof val !== 'number') {
      return false
    }
  }
  return true
}

export function isMinMaxTuple(value) {
  return (Array.isArray(value) &&
  value.length === 2 &&
  typeof value[0] === 'number' && typeof value[1] === 'number');
}
