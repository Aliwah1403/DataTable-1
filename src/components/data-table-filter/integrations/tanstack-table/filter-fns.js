import * as f from '../../lib/filter-fns'

export function dateFilterFn(row, columnId, filterValue) {
  const value = row.getValue(columnId)

  return f.dateFilterFn(value, filterValue);
}

export function textFilterFn(row, columnId, filterValue) {
  const value = row.getValue(columnId) ?? ''

  return f.textFilterFn(value, filterValue);
}

export function numberFilterFn(row, columnId, filterValue) {
  const value = row.getValue(columnId)

  return f.numberFilterFn(value, filterValue);
}
