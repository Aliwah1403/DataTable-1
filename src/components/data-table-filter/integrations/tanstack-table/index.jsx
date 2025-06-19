import { multiOptionFilterFn, optionFilterFn } from '../../lib/filter-fns'
import {
  isColumnOption,
  isColumnOptionArray,
  isStringArray,
} from '../../lib/helpers'
import { dateFilterFn, numberFilterFn, textFilterFn } from './filter-fns'

export function createTSTColumns(
  {
    columns,
    configs
  }
) {
  const _cols = []

  for (const col of columns) {
    // Get the column filter config for this column
    const config = configs.find((c) => c.id === col.id)

    // If the column is not filterable or doesn't have a filter config, skip it
    // An explicit check is done on `enableColumnFilter`
    if (col.enableColumnFilter === false || !config) {
      _cols.push(col)
      continue
    }

    if (config.type === 'text') {
      col.filterFn = textFilterFn
      _cols.push(col)
      continue
    }

    if (config.type === 'number') {
      col.filterFn = numberFilterFn
      _cols.push(col)
      continue
    }

    if (config.type === 'date') {
      col.filterFn = dateFilterFn
      _cols.push(col)
      continue
    }

    if (config.type === 'option') {
      col.filterFn = (row, columnId, filterValue) => {
        const value = row.getValue(columnId)

        if (!value) return false

        if (typeof value === 'string') {
          return optionFilterFn(value, filterValue);
        }

        if (isColumnOption(value)) {
          return optionFilterFn(value.value, filterValue);
        }

        const sanitizedValue = config.transformOptionFn(value)
        return optionFilterFn(sanitizedValue.value, filterValue);
      }
    }

    if (config.type === 'multiOption') {
      col.filterFn = (
        row,
        columnId,
        filterValue,
      ) => {
        const value = row.getValue(columnId)

        if (!value) return false

        if (isStringArray(value)) {
          return multiOptionFilterFn(value, filterValue);
        }

        if (isColumnOptionArray(value)) {
          return multiOptionFilterFn(value.map((v) => v.value), filterValue);
        }

        const sanitizedValue = (value).map((v) =>
          config.transformOptionFn(v))

        return multiOptionFilterFn(sanitizedValue.map((v) => v.value), filterValue);
      }
    }

    _cols.push(col)
  }

  return _cols
}

export function createTSTFilters(filters) {
  return filters.map((filter) => ({ id: filter.columnId, value: filter }));
}
