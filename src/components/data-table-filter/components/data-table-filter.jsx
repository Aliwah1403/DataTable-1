import { useIsMobile } from 'src/hooks/use-mobile'
import { ActiveFilters, ActiveFiltersMobileContainer } from './active-filters'
import { FilterActions } from './filter-actions'
import { FilterSelector } from './filter-selector'

export function DataTableFilter(
  {
    columns,
    filters,
    actions,
    strategy,
    locale = 'en'
  }
) {
  const isMobile = useIsMobile()
  if (isMobile) {
    return (
      (<div className="flex w-full items-start justify-between gap-2">
        <div className="flex gap-1">
          <FilterSelector
            columns={columns}
            filters={filters}
            actions={actions}
            strategy={strategy}
            locale={locale} />
          <FilterActions hasFilters={filters.length > 0} actions={actions} locale={locale} />
        </div>
        <ActiveFiltersMobileContainer>
          <ActiveFilters
            columns={columns}
            filters={filters}
            actions={actions}
            strategy={strategy}
            locale={locale} />
        </ActiveFiltersMobileContainer>
      </div>)
    );
  }

  return (
    (<div className="flex w-full items-start justify-between gap-2">
      <div className="flex md:flex-wrap gap-2 w-full flex-1">
        <FilterSelector
          columns={columns}
          filters={filters}
          actions={actions}
          strategy={strategy}
          locale={locale} />
        <ActiveFilters
          columns={columns}
          filters={filters}
          actions={actions}
          strategy={strategy}
          locale={locale} />
      </div>
      <FilterActions hasFilters={filters.length > 0} actions={actions} locale={locale} />
    </div>)
  );
}
