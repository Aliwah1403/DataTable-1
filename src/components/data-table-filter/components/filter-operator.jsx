import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import {
  dateFilterOperators,
  filterTypeOperatorDetails,
  multiOptionFilterOperators,
  numberFilterOperators,
  optionFilterOperators,
  textFilterOperators,
} from '../core/operators'
import { t } from '../lib/i18n';

// Renders the filter operator display and menu for a given column filter
// The filter operator display is the label and icon for the filter operator
// The filter operator menu is the dropdown menu for the filter operator
export function FilterOperator(
  {
    column,
    filter,
    actions,
    locale = 'en'
  }
) {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    (<Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="m-0 h-full w-fit whitespace-nowrap rounded-none p-0 px-2 text-xs">
          <FilterOperatorDisplay filter={filter} columnType={column.type} locale={locale} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-fit p-0 origin-(--radix-popover-content-transform-origin)">
        <Command loop>
          <CommandInput placeholder={t('search', locale)} />
          <CommandEmpty>{t('noresults', locale)}</CommandEmpty>
          <CommandList className="max-h-fit">
            <FilterOperatorController
              filter={filter}
              column={column}
              actions={actions}
              closeController={close}
              locale={locale} />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>)
  );
}

export function FilterOperatorDisplay(
  {
    filter,
    columnType,
    locale = 'en'
  }
) {
  const operator = filterTypeOperatorDetails[columnType][filter.operator]
  const label = t(operator.key, locale)

  return <span className="text-muted-foreground">{label}</span>;
}

/*
 *
 * TODO: Reduce into a single component. Each data type does not need it's own controller.
 *
 */
export function FilterOperatorController(
  {
    filter,
    column,
    actions,
    closeController,
    locale = 'en'
  }
) {
  switch (column.type) {
    case 'option':
      return (
        (<FilterOperatorOptionController
          filter={filter}
          column={column}
          actions={actions}
          closeController={closeController}
          locale={locale} />)
      );
    case 'multiOption':
      return (
        (<FilterOperatorMultiOptionController
          filter={filter}
          column={column}
          actions={actions}
          closeController={closeController}
          locale={locale} />)
      );
    case 'date':
      return (
        (<FilterOperatorDateController
          filter={filter}
          column={column}
          actions={actions}
          closeController={closeController}
          locale={locale} />)
      );
    case 'text':
      return (
        (<FilterOperatorTextController
          filter={filter}
          column={column}
          actions={actions}
          closeController={closeController}
          locale={locale} />)
      );
    case 'number':
      return (
        (<FilterOperatorNumberController
          filter={filter}
          column={column}
          actions={actions}
          closeController={closeController}
          locale={locale} />)
      );
    default:
      return null
  }
}

function FilterOperatorOptionController(
  {
    filter,
    column,
    actions,
    closeController,
    locale = 'en'
  }
) {
  const filterDetails = optionFilterOperators[filter.operator]

  const relatedFilters = Object.values(optionFilterOperators).filter((o) => o.target === filterDetails.target)

  const changeOperator = (value) => {
    actions?.setFilterOperator(column.id, value)
    closeController()
  }

  return (
    (<CommandGroup heading={t('operators', locale)}>
      {relatedFilters.map((r) => {
        return (
          (<CommandItem onSelect={changeOperator} value={r.value} key={r.value}>
            {t(r.key, locale)}
          </CommandItem>)
        );
      })}
    </CommandGroup>)
  );
}

function FilterOperatorMultiOptionController(
  {
    filter,
    column,
    actions,
    closeController,
    locale = 'en'
  }
) {
  const filterDetails = multiOptionFilterOperators[filter.operator]

  const relatedFilters = Object.values(multiOptionFilterOperators).filter((o) => o.target === filterDetails.target)

  const changeOperator = (value) => {
    actions?.setFilterOperator(column.id, value)
    closeController()
  }

  return (
    (<CommandGroup heading={t('operators', locale)}>
      {relatedFilters.map((r) => {
        return (
          (<CommandItem onSelect={changeOperator} value={r.value} key={r.value}>
            {t(r.key, locale)}
          </CommandItem>)
        );
      })}
    </CommandGroup>)
  );
}

function FilterOperatorDateController(
  {
    filter,
    column,
    actions,
    closeController,
    locale = 'en'
  }
) {
  const filterDetails = dateFilterOperators[filter.operator]

  const relatedFilters = Object.values(dateFilterOperators).filter((o) => o.target === filterDetails.target)

  const changeOperator = (value) => {
    actions?.setFilterOperator(column.id, value)
    closeController()
  }

  return (
    (<CommandGroup>
      {relatedFilters.map((r) => {
        return (
          (<CommandItem onSelect={changeOperator} value={r.value} key={r.value}>
            {t(r.key, locale)}
          </CommandItem>)
        );
      })}
    </CommandGroup>)
  );
}

export function FilterOperatorTextController(
  {
    filter,
    column,
    actions,
    closeController,
    locale = 'en'
  }
) {
  const filterDetails = textFilterOperators[filter.operator]

  const relatedFilters = Object.values(textFilterOperators).filter((o) => o.target === filterDetails.target)

  const changeOperator = (value) => {
    actions?.setFilterOperator(column.id, value)
    closeController()
  }

  return (
    (<CommandGroup heading={t('operators', locale)}>
      {relatedFilters.map((r) => {
        return (
          (<CommandItem onSelect={changeOperator} value={r.value} key={r.value}>
            {t(r.key, locale)}
          </CommandItem>)
        );
      })}
    </CommandGroup>)
  );
}

function FilterOperatorNumberController(
  {
    filter,
    column,
    actions,
    closeController,
    locale = 'en'
  }
) {
  const filterDetails = numberFilterOperators[filter.operator]

  const relatedFilters = Object.values(numberFilterOperators).filter((o) => o.target === filterDetails.target)

  const changeOperator = (value) => {
    actions?.setFilterOperator(column.id, value)
    closeController()
  }

  return (
    (<div>
      <CommandGroup heading={t('operators', locale)}>
        {relatedFilters.map((r) => (
          <CommandItem onSelect={() => changeOperator(r.value)} value={r.value} key={r.value}>
            {t(r.key, locale)}
          </CommandItem>
        ))}
      </CommandGroup>
    </div>)
  );
}
