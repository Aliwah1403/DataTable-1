import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { isEqual } from "date-fns";
import { format } from "date-fns";
import { Ellipsis } from "lucide-react";
import {
  cloneElement,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { numberFilterOperators } from "../core/operators";
import { useDebounceCallback } from "../hooks/use-debounce-callback";
import { take } from "../lib/array";
import { createNumberRange } from "../lib/helpers";
import { t } from "../lib/i18n";
import { DebouncedInput } from "../ui/debounced-input";

export const FilterValue = memo(__FilterValue);

function __FilterValue({ filter, column, actions, strategy, locale }) {
  return (
    <Popover>
      <PopoverAnchor className="h-full" />
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="m-0 h-full w-fit whitespace-nowrap rounded-none p-0 px-2 text-xs"
        >
          <FilterValueDisplay
            filter={filter}
            column={column}
            actions={actions}
            locale={locale}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-fit p-0 origin-(--radix-popover-content-transform-origin)"
      >
        <FilterValueController
          filter={filter}
          column={column}
          actions={actions}
          strategy={strategy}
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  );
}

export function FilterValueDisplay({ filter, column, actions, locale = "en" }) {
  switch (column.type) {
    case "option":
      return (
        <FilterValueOptionDisplay
          filter={filter}
          column={column}
          actions={actions}
          locale={locale}
        />
      );
    case "multiOption":
      return (
        <FilterValueMultiOptionDisplay
          filter={filter}
          column={column}
          actions={actions}
          locale={locale}
        />
      );
    case "date":
      return (
        <FilterValueDateDisplay
          filter={filter}
          column={column}
          actions={actions}
          locale={locale}
        />
      );
    case "text":
      return (
        <FilterValueTextDisplay
          filter={filter}
          column={column}
          actions={actions}
          locale={locale}
        />
      );
    case "number":
      return (
        <FilterValueNumberDisplay
          filter={filter}
          column={column}
          actions={actions}
          locale={locale}
        />
      );
    default:
      return null;
  }
}

export function FilterValueOptionDisplay({
  filter,
  column,
  actions,
  locale = "en",
}) {
  const options = useMemo(() => column.getOptions(), [column]);
  const selected = options.filter((o) => filter?.values.includes(o.value));

  // We display the selected options based on how many are selected
  //
  // If there is only one option selected, we display its icon and label
  //
  // If there are multiple options selected, we display:
  // 1) up to 3 icons of the selected options
  // 2) the number of selected options
  if (selected.length === 1) {
    const { label, icon: Icon } = selected[0];
    const hasIcon = !!Icon;
    return (
      <span className="inline-flex items-center gap-1">
        {hasIcon &&
          (isValidElement(Icon) ? (
            Icon
          ) : (
            <Icon className="size-4 text-primary" />
          ))}
        <span>{label}</span>
      </span>
    );
  }
  const name = column.displayName.toLowerCase();
  // TODO: Better pluralization for different languages
  const pluralName = name.endsWith("s") ? `${name}es` : `${name}s`;

  const hasOptionIcons = !options?.some((o) => !o.icon);

  return (
    <div className="inline-flex items-center gap-0.5">
      {hasOptionIcons &&
        take(selected, 3).map(({ value, icon }) => {
          const Icon = icon;
          return isValidElement(Icon) ? (
            Icon
          ) : (
            <Icon key={value} className="size-4" />
          );
        })}
      <span className={cn(hasOptionIcons && "ml-1.5")}>
        {selected.length} {pluralName}
      </span>
    </div>
  );
}

export function FilterValueMultiOptionDisplay({
  filter,
  column,
  actions,
  locale = "en",
}) {
  const options = useMemo(() => column.getOptions(), [column]);
  const selected = options.filter((o) => filter.values.includes(o.value));

  if (selected.length === 1) {
    const { label, icon: Icon } = selected[0];
    const hasIcon = !!Icon;
    return (
      <span className="inline-flex items-center gap-1.5">
        {hasIcon &&
          (isValidElement(Icon) ? (
            Icon
          ) : (
            <Icon className="size-4 text-primary" />
          ))}
        <span>{label}</span>
      </span>
    );
  }

  const name = column.displayName.toLowerCase();

  const hasOptionIcons = !options?.some((o) => !o.icon);

  return (
    <div className="inline-flex items-center gap-1.5">
      {hasOptionIcons && (
        <div key="icons" className="inline-flex items-center gap-0.5">
          {take(selected, 3).map(({ value, icon }) => {
            const Icon = icon;
            return isValidElement(Icon) ? (
              cloneElement(Icon, { key: value })
            ) : (
              <Icon key={value} className="size-4" />
            );
          })}
        </div>
      )}
      <span>
        {selected.length} {name}
      </span>
    </div>
  );
}

function formatDateRange(start, end) {
  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();

  if (sameMonth && sameYear) {
    return `${format(start, "MMM d")} - ${format(end, "d, yyyy")}`;
  }

  if (sameYear) {
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  }

  return `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`;
}

export function FilterValueDateDisplay({
  filter,
  column,
  actions,
  locale = "en",
}) {
  if (!filter) return null;
  if (filter.values.length === 0) return <Ellipsis className="size-4" />;
  if (filter.values.length === 1) {
    const value = filter.values[0];

    const formattedDateStr = format(value, "MMM d, yyyy");

    return <span>{formattedDateStr}</span>;
  }

  const formattedRangeStr = formatDateRange(filter.values[0], filter.values[1]);

  return <span>{formattedRangeStr}</span>;
}

export function FilterValueTextDisplay({
  filter,
  column,
  actions,
  locale = "en",
}) {
  if (!filter) return null;
  if (filter.values.length === 0 || filter.values[0].trim() === "")
    return <Ellipsis className="size-4" />;

  const value = filter.values[0];

  return <span>{value}</span>;
}

export function FilterValueNumberDisplay({
  filter,
  column,
  actions,
  locale = "en",
}) {
  if (!filter || !filter.values || filter.values.length === 0) return null;

  if (
    filter.operator === "is between" ||
    filter.operator === "is not between"
  ) {
    const minValue = filter.values[0];
    const maxValue = filter.values[1];

    return (
      <span className="tabular-nums tracking-tight">
        {minValue} {t("and", locale)} {maxValue}
      </span>
    );
  }

  const value = filter.values[0];
  return <span className="tabular-nums tracking-tight">{value}</span>;
}

export const FilterValueController = memo(__FilterValueController);

function __FilterValueController({
  filter,
  column,
  actions,
  strategy,
  locale = "en",
}) {
  switch (column.type) {
    case "option":
      return (
        <FilterValueOptionController
          filter={filter}
          column={column}
          actions={actions}
          strategy={strategy}
          locale={locale}
        />
      );
    case "multiOption":
      return (
        <FilterValueMultiOptionController
          filter={filter}
          column={column}
          actions={actions}
          strategy={strategy}
          locale={locale}
        />
      );
    case "date":
      return (
        <FilterValueDateController
          filter={filter}
          column={column}
          actions={actions}
          strategy={strategy}
          locale={locale}
        />
      );
    case "text":
      return (
        <FilterValueTextController
          filter={filter}
          column={column}
          actions={actions}
          strategy={strategy}
          locale={locale}
        />
      );
    case "number":
      return (
        <FilterValueNumberController
          filter={filter}
          column={column}
          actions={actions}
          strategy={strategy}
          locale={locale}
        />
      );
    default:
      return null;
  }
}

// Memoized option item to prevent re-renders unless its own props change
const OptionItem = memo(function OptionItem({ option, onToggle }) {
  const { value, label, icon: Icon, selected, count } = option;
  const handleSelect = useCallback(() => {
    onToggle(value, !selected);
  }, [onToggle, value, selected]);

  return (
    <CommandItem
      key={value}
      onSelect={handleSelect}
      className="group flex items-center justify-between gap-1.5"
    >
      <div className="flex items-center gap-1.5">
        <Checkbox
          checked={selected}
          className="opacity-0 data-[state=checked]:opacity-100 group-data-[selected=true]:opacity-100 dark:border-ring mr-1"
        />
        {Icon &&
          (isValidElement(Icon) ? (
            Icon
          ) : (
            <Icon className="size-4 text-primary" />
          ))}
        <span>
          {label}
          <sup
            className={cn(
              count == null && "hidden",
              "ml-0.5 tabular-nums tracking-tight text-muted-foreground",
              count === 0 && "slashed-zero"
            )}
          >
            {typeof count === "number" ? (count < 100 ? count : "100+") : ""}
          </sup>
        </span>
      </div>
    </CommandItem>
  );
});

export function FilterValueOptionController({
  filter,
  column,
  actions,
  locale = "en",
}) {
  // Compute initial options once per mount
  const initialOptions = useMemo(() => {
    const counts = column.getFacetedUniqueValues();
    return column.getOptions().map((o) => ({
      ...o,
      selected: filter?.values.includes(o.value),
      initialSelected: filter?.values.includes(o.value),
      count: counts?.get(o.value) ?? 0,
    }));
  }, []);

  const [options, setOptions] = useState(initialOptions);

  // Update selected state when filter values change
  useEffect(() => {
    setOptions((prev) =>
      prev.map((o) => ({ ...o, selected: filter?.values.includes(o.value) }))
    );
  }, [filter?.values]);

  const handleToggle = useCallback(
    (value, checked) => {
      if (checked) actions.addFilterValue(column, [value]);
      else actions.removeFilterValue(column, [value]);
    },
    [actions, column]
  );

  // Derive groups based on `initialSelected` only
  const { selectedOptions, unselectedOptions } = useMemo(() => {
    const sel = [];
    const unsel = [];
    for (const o of options) {
      if (o.initialSelected) sel.push(o);
      else unsel.push(o);
    }
    return { selectedOptions: sel, unselectedOptions: unsel };
  }, [options]);

  return (
    <Command loop>
      <CommandInput autoFocus placeholder={t("search", locale)} />
      <CommandEmpty>{t("noresults", locale)}</CommandEmpty>
      <CommandList className="max-h-fit">
        <CommandGroup className={cn(selectedOptions.length === 0 && "hidden")}>
          {selectedOptions.map((option) => (
            <OptionItem
              key={option.value}
              option={option}
              onToggle={handleToggle}
            />
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup
          className={cn(unselectedOptions.length === 0 && "hidden")}
        >
          {unselectedOptions.map((option) => (
            <OptionItem
              key={option.value}
              option={option}
              onToggle={handleToggle}
            />
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function FilterValueMultiOptionController({
  filter,
  column,
  actions,
  locale = "en",
}) {
  // Compute initial options once per mount
  const initialOptions = useMemo(() => {
    const counts = column.getFacetedUniqueValues();
    return column.getOptions().map((o) => {
      const selected = filter?.values.includes(o.value);
      return {
        ...o,
        selected,
        initialSelected: selected,
        count: counts?.get(o.value) ?? 0,
      };
    });
  }, []);

  const [options, setOptions] = useState(initialOptions);

  // Update selected state when filter values change
  useEffect(() => {
    setOptions((prev) =>
      prev.map((o) => ({ ...o, selected: filter?.values.includes(o.value) }))
    );
  }, [filter?.values]);

  const handleToggle = useCallback(
    (value, checked) => {
      if (checked) actions.addFilterValue(column, [value]);
      else actions.removeFilterValue(column, [value]);
    },
    [actions, column]
  );

  // Derive groups based on `initialSelected` only
  const { selectedOptions, unselectedOptions } = useMemo(() => {
    const sel = [];
    const unsel = [];
    for (const o of options) {
      if (o.initialSelected) sel.push(o);
      else unsel.push(o);
    }
    return { selectedOptions: sel, unselectedOptions: unsel };
  }, [options]);

  return (
    <Command loop>
      <CommandInput autoFocus placeholder={t("search", locale)} />
      <CommandEmpty>{t("noresults", locale)}</CommandEmpty>
      <CommandList>
        <CommandGroup className={cn(selectedOptions.length === 0 && "hidden")}>
          {selectedOptions.map((option) => (
            <OptionItem
              key={option.value}
              option={option}
              onToggle={handleToggle}
            />
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup
          className={cn(unselectedOptions.length === 0 && "hidden")}
        >
          {unselectedOptions.map((option) => (
            <OptionItem
              key={option.value}
              option={option}
              onToggle={handleToggle}
            />
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function FilterValueDateController({ filter, column, actions }) {
  const [date, setDate] = useState({
    from: filter?.values[0] ?? new Date(),
    to: filter?.values[1] ?? undefined,
  });

  function changeDateRange(value) {
    const start = value?.from;
    const end =
      start && value && value.to && !isEqual(start, value.to)
        ? value.to
        : undefined;

    setDate({ from: start, to: end });

    const isRange = start && end;
    const newValues = isRange ? [start, end] : start ? [start] : [];

    actions.setFilterValue(column, newValues);
  }

  return (
    <Command>
      <CommandList className="max-h-fit">
        <CommandGroup>
          <div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={changeDateRange}
              numberOfMonths={1}
            />
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function FilterValueTextController({
  filter,
  column,
  actions,
  locale = "en",
}) {
  const changeText = (value) => {
    actions.setFilterValue(column, [String(value)]);
  };

  return (
    <Command>
      <CommandList className="max-h-fit">
        <CommandGroup>
          <CommandItem>
            <DebouncedInput
              placeholder={t("search", locale)}
              autoFocus
              value={filter?.values[0] ?? ""}
              onChange={changeText}
            />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function FilterValueNumberController({
  filter,
  column,
  actions,
  locale = "en",
}) {
  const minMax = useMemo(() => column.getFacetedMinMaxValues(), [column]);
  const [sliderMin, sliderMax] = [
    minMax ? minMax[0] : 0,
    minMax ? minMax[1] : 0,
  ];

  // Local state for values
  const [values, setValues] = useState(filter?.values ?? [0, 0]);

  // Sync with parent filter changes
  useEffect(() => {
    if (
      filter?.values &&
      filter.values.length === values.length &&
      filter.values.every((v, i) => v === values[i])
    ) {
      setValues(filter.values);
    }
  }, [filter?.values, values]);

  const isNumberRange =
    // filter && values.length === 2
    filter && numberFilterOperators[filter.operator].target === "multiple";

  const setFilterOperatorDebounced = useDebounceCallback(
    actions.setFilterOperator,
    500
  );
  const setFilterValueDebounced = useDebounceCallback(
    actions.setFilterValue,
    500
  );

  const changeNumber = (value) => {
    setValues(value);
    setFilterValueDebounced(column, value);
  };

  const changeMinNumber = (value) => {
    const newValues = createNumberRange([value, values[1]]);
    setValues(newValues);
    setFilterValueDebounced(column, newValues);
  };

  const changeMaxNumber = (value) => {
    const newValues = createNumberRange([values[0], value]);
    setValues(newValues);
    setFilterValueDebounced(column, newValues);
  };

  const changeType = useCallback(
    (type) => {
      let newValues = [];
      if (type === "single")
        newValues = [values[0]]; // Keep the first value for single mode
      else if (!minMax)
        newValues = createNumberRange([values[0], values[1] ?? 0]);
      else {
        const value = values[0];
        newValues =
          value - minMax[0] < minMax[1] - value
            ? createNumberRange([value, minMax[1]])
            : createNumberRange([minMax[0], value]);
      }

      const newOperator = type === "single" ? "is" : "is between";

      // Update local state
      setValues(newValues);

      // Cancel in-flight debounced calls to prevent flicker/race conditions
      setFilterOperatorDebounced.cancel();
      setFilterValueDebounced.cancel();

      // Update global filter state atomically
      actions.setFilterOperator(column.id, newOperator);
      actions.setFilterValue(column, newValues);
    },
    [values, column, actions, minMax]
  );

  return (
    <Command>
      <CommandList className="w-[300px] px-2 py-2">
        <CommandGroup>
          <div className="flex flex-col w-full">
            <Tabs
              value={isNumberRange ? "range" : "single"}
              onValueChange={(v) => changeType(v)}
            >
              <TabsList className="w-full *:text-xs">
                <TabsTrigger value="single">{t("single", locale)}</TabsTrigger>
                <TabsTrigger value="range">{t("range", locale)}</TabsTrigger>
              </TabsList>
              <TabsContent value="single" className="flex flex-col gap-4 mt-4">
                {minMax && (
                  <Slider
                    value={[values[0]]}
                    onValueChange={(value) => changeNumber(value)}
                    min={sliderMin}
                    max={sliderMax}
                    step={1}
                    aria-orientation="horizontal"
                  />
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">
                    {t("value", locale)}
                  </span>
                  <DebouncedInput
                    id="single"
                    type="number"
                    // Use values[0] directly
                    value={values[0].toString()}
                    onChange={(v) => changeNumber([Number(v)])}
                  />
                </div>
              </TabsContent>
              <TabsContent value="range" className="flex flex-col gap-4 mt-4">
                {minMax && (
                  <Slider
                    // Use values directly
                    value={values}
                    onValueChange={changeNumber}
                    min={sliderMin}
                    max={sliderMax}
                    step={1}
                    aria-orientation="horizontal"
                  />
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">
                      {t("min", locale)}
                    </span>
                    <DebouncedInput
                      type="number"
                      value={values[0]}
                      onChange={(v) => changeMinNumber(Number(v))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">
                      {t("max", locale)}
                    </span>
                    <DebouncedInput
                      type="number"
                      value={values[1]}
                      onChange={(v) => changeMaxNumber(Number(v))}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
