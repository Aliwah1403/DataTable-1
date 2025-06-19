import { isAnyOf, uniq } from '../lib/array'
import { isColumnOptionArray } from '../lib/helpers'
import { memo } from '../lib/memo'

class ColumnConfigBuilder {
  constructor(type) {
    this.config = {
      type
    }
  }

  clone() {
    const newInstance = new ColumnConfigBuilder(this.config.type)
    newInstance.config = { ...this.config }
    return newInstance
  }

  id(value) {
    const newInstance = this.clone() // We'll refine this
    newInstance.config.id = value
    return newInstance;
  }

  accessor(accessor) {
    const newInstance = this.clone()
    newInstance.config.accessor = accessor
    return newInstance;
  }

  displayName(value) {
    const newInstance = this.clone()
    newInstance.config.displayName = value
    return newInstance
  }

  icon(value) {
    const newInstance = this.clone()
    newInstance.config.icon = value
    return newInstance
  }

  min(value) {
    if (this.config.type !== 'number') {
      throw new Error('min() is only applicable to number columns')
    }
    const newInstance = this.clone()
    newInstance.config.min = value
    return newInstance
  }

  max(value) {
    if (this.config.type !== 'number') {
      throw new Error('max() is only applicable to number columns')
    }
    const newInstance = this.clone()
    newInstance.config.max = value
    return newInstance
  }

  options(value) {
    if (!isAnyOf(this.config.type, ['option', 'multiOption'])) {
      throw new Error('options() is only applicable to option or multiOption columns')
    }
    const newInstance = this.clone()
    newInstance.config.options = value
    return newInstance
  }

  transformOptionFn(fn) {
    if (!isAnyOf(this.config.type, ['option', 'multiOption'])) {
      throw new Error('transformOptionFn() is only applicable to option or multiOption columns')
    }
    const newInstance = this.clone()
    newInstance.config.transformOptionFn = fn
    return newInstance
  }

  orderFn(fn) {
    if (!isAnyOf(this.config.type, ['option', 'multiOption'])) {
      throw new Error('orderFn() is only applicable to option or multiOption columns')
    }
    const newInstance = this.clone()
    newInstance.config.orderFn = fn
    return newInstance
  }

  build() {
    if (!this.config.id) throw new Error('id is required')
    if (!this.config.accessor) throw new Error('accessor is required')
    if (!this.config.displayName) throw new Error('displayName is required')
    if (!this.config.icon) throw new Error('icon is required')
    return this.config;
  }
}

// Factory function remains mostly the same
export function createColumnConfigHelper() {
  return {
    text: () => new ColumnConfigBuilder('text'),
    number: () => new ColumnConfigBuilder('number'),
    date: () => new ColumnConfigBuilder('date'),
    option: () => new ColumnConfigBuilder('option'),
    multiOption: () =>
      new ColumnConfigBuilder('multiOption'),
  };
}

export function getColumnOptions(column, data, strategy) {
  if (!isAnyOf(column.type, ['option', 'multiOption'])) {
    console.warn('Column options can only be retrieved for option and multiOption columns')
    return []
  }

  if (strategy === 'server' && !column.options) {
    throw new Error('column options are required for server-side filtering')
  }

  if (column.options) {
    return column.options
  }

  const filtered = data
    .flatMap(column.accessor)
    .filter(v => v !== undefined && v !== null)

  let models = uniq(filtered)

  if (column.orderFn) {
    models = models.sort((m1, m2) =>
      column.orderFn(m1, m2))
  }

  if (column.transformOptionFn) {
    // Memoize transformOptionFn calls
    const memoizedTransform = memo(() => [models], (deps) =>
      deps[0].map((m) =>
        column.transformOptionFn(m)), { key: `transform-${column.id}` })
    return memoizedTransform();
  }

  if (isColumnOptionArray(models)) return models

  throw new Error(
    `[data-table-filter] [${column.id}] Either provide static options, a transformOptionFn, or ensure the column data conforms to ColumnOption type`
  )
}

export function getColumnValues(column, data) {
  // Memoize accessor calls
  const memoizedAccessor = memo(() => [data], (deps) =>
    deps[0]
      .flatMap(column.accessor)
      .filter(v => v !== undefined && v !== null), { key: `accessor-${column.id}` })

  const raw = memoizedAccessor()

  if (!isAnyOf(column.type, ['option', 'multiOption'])) {
    return raw
  }

  if (column.options) {
    return raw
      .map((v) => column.options?.find((o) => o.value === v)?.value)
      .filter((v) => v !== undefined && v !== null);
  }

  if (column.transformOptionFn) {
    const memoizedTransform = memo(() => [raw], (deps) =>
      deps[0].map((v) => column.transformOptionFn(v)), { key: `transform-values-${column.id}` })
    return memoizedTransform();
  }

  if (isColumnOptionArray(raw)) {
    return raw
  }

  throw new Error(
    `[data-table-filter] [${column.id}] Either provide static options, a transformOptionFn, or ensure the column data conforms to ColumnOption type`
  )
}

export function getFacetedUniqueValues(column, values, strategy) {
  if (!isAnyOf(column.type, ['option', 'multiOption'])) {
    console.warn(
      'Faceted unique values can only be retrieved for option and multiOption columns'
    )
    return new Map();
  }

  if (strategy === 'server') {
    return column.facetedOptions
  }

  const acc = new Map()

  if (isColumnOptionArray(values)) {
    for (const option of values) {
      const curr = acc.get(option.value) ?? 0
      acc.set(option.value, curr + 1)
    }
  } else {
    for (const option of values) {
      const curr = acc.get(option) ?? 0
      acc.set(option, curr + 1)
    }
  }

  return acc
}

export function getFacetedMinMaxValues(column, data, strategy) {
  if (column.type !== 'number') return undefined // Only applicable to number columns

  if (typeof column.min === 'number' && typeof column.max === 'number') {
    return [column.min, column.max]
  }

  if (strategy === 'server') {
    return undefined
  }

  const values = data
    .flatMap((row) => column.accessor(row))
    .filter(v => typeof v === 'number' && !Number.isNaN(v))

  if (values.length === 0) {
    return [0, 0] // Fallback to config or reasonable defaults
  }

  const min = Math.min(...values)
  const max = Math.max(...values)

  return [min, max]
}

export function createColumns(data, columnConfigs, strategy) {
  return columnConfigs.map((columnConfig) => {
    const getOptions = memo(() => [data, strategy, columnConfig.options], ([data, strategy]) =>
      getColumnOptions(columnConfig, data, strategy), { key: `options-${columnConfig.id}` })

    const getValues = memo(
      () => [data, strategy],
      () => (strategy === 'client' ? getColumnValues(columnConfig, data) : []),
      { key: `values-${columnConfig.id}` }
    )

    const getUniqueValues = memo(() => [getValues(), strategy], ([values, strategy]) =>
      getFacetedUniqueValues(columnConfig, values, strategy), { key: `faceted-${columnConfig.id}` })

    const getMinMaxValues = memo(
      () => [data, strategy],
      () => getFacetedMinMaxValues(columnConfig, data, strategy),
      { key: `minmax-${columnConfig.id}` }
    )

    // Create the Column instance
    const column = {
      ...columnConfig,
      getOptions,
      getValues,
      getFacetedUniqueValues: getUniqueValues,
      getFacetedMinMaxValues: getMinMaxValues,
      // Prefetch methods will be added below
      prefetchOptions: async () => {}, // Placeholder, defined below
      prefetchValues: async () => {},
      prefetchFacetedUniqueValues: async () => {},
      prefetchFacetedMinMaxValues: async () => {},
      _prefetchedOptionsCache: null, // Initialize private cache
      _prefetchedValuesCache: null,
      _prefetchedFacetedUniqueValuesCache: null,
      _prefetchedFacetedMinMaxValuesCache: null,
    }

    if (strategy === 'client') {
      // Define prefetch methods with access to the column instance
      column.prefetchOptions = async () => {
        if (!column._prefetchedOptionsCache) {
          await new Promise((resolve) =>
            setTimeout(() => {
              const options = getOptions()
              column._prefetchedOptionsCache = options
              // console.log(`Prefetched options for ${columnConfig.id}`)
              resolve(undefined)
            }, 0))
        }
      }

      column.prefetchValues = async () => {
        if (!column._prefetchedValuesCache) {
          await new Promise((resolve) =>
            setTimeout(() => {
              const values = getValues()
              column._prefetchedValuesCache = values
              // console.log(`Prefetched values for ${columnConfig.id}`)
              resolve(undefined)
            }, 0))
        }
      }

      column.prefetchFacetedUniqueValues = async () => {
        if (!column._prefetchedFacetedUniqueValuesCache) {
          await new Promise((resolve) =>
            setTimeout(() => {
              const facetedMap = getUniqueValues()
              column._prefetchedFacetedUniqueValuesCache = facetedMap ?? null
              // console.log(
              //   `Prefetched faceted unique values for ${columnConfig.id}`,
              // )
              resolve(undefined)
            }, 0))
        }
      }

      column.prefetchFacetedMinMaxValues = async () => {
        if (!column._prefetchedFacetedMinMaxValuesCache) {
          await new Promise((resolve) =>
            setTimeout(() => {
              const value = getMinMaxValues()
              column._prefetchedFacetedMinMaxValuesCache = value ?? null
              // console.log(
              //   `Prefetched faceted min/max values for ${columnConfig.id}`,
              // )
              resolve(undefined)
            }, 0))
        }
      }
    }

    return column
  });
}
