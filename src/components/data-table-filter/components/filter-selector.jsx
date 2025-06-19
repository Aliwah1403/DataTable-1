import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, ChevronRightIcon, FilterIcon } from "lucide-react";
import {
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import React from "react";
import { isAnyOf } from "../lib/array";
import { getColumn } from "../lib/helpers";
import { t } from "../lib/i18n";
import { FilterValueController } from "./filter-value";

export const FilterSelector = memo(__FilterSelector);

function __FilterSelector({
  filters,
  columns,
  actions,
  strategy,
  locale = "en",
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [property, setProperty] = useState(undefined);
  const inputRef = useRef(null);

  const column = property ? getColumn(columns, property) : undefined;
  const filter = property
    ? filters.find((f) => f.columnId === property)
    : undefined;

  const hasFilters = filters.length > 0;

  useEffect(() => {
    if (property && inputRef) {
      inputRef.current?.focus();
      setValue("");
    }
  }, [property]);

  useEffect(() => {
    if (!open) setTimeout(() => setValue(""), 150);
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: need filters to be updated
  const content = useMemo(
    () =>
      property && column ? (
        <FilterValueController
          filter={filter}
          column={column}
          actions={actions}
          strategy={strategy}
          locale={locale}
        />
      ) : (
        <Command
          loop
          filter={(value, search, keywords) => {
            const extendValue = `${value} ${keywords?.join(" ")}`;
            return extendValue.toLowerCase().includes(search.toLowerCase())
              ? 1
              : 0;
          }}
        >
          <CommandInput
            value={value}
            onValueChange={setValue}
            ref={inputRef}
            placeholder={t("search", locale)}
          />
          <CommandEmpty>{t("noresults", locale)}</CommandEmpty>
          <CommandList className="max-h-fit">
            <CommandGroup>
              {columns.map((column) => (
                <FilterableColumn
                  key={column.id}
                  column={column}
                  setProperty={setProperty}
                />
              ))}
              <QuickSearchFilters
                search={value}
                filters={filters}
                columns={columns}
                actions={actions}
                strategy={strategy}
                locale={locale}
              />
            </CommandGroup>
          </CommandList>
        </Command>
      ),
    [property, column, filter, filters, columns, actions, value]
  );

  return (
    <Popover
      open={open}
      onOpenChange={async (value) => {
        setOpen(value);
        if (!value) setTimeout(() => setProperty(undefined), 100);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("h-7", hasFilters && "w-fit !px-2")}
        >
          <FilterIcon className="size-4" />
          {!hasFilters && <span>{t("filter", locale)}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-fit p-0 origin-(--radix-popover-content-transform-origin)"
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}

export function FilterableColumn({ column, setProperty }) {
  const itemRef = useRef(null);

  const prefetch = useCallback(() => {
    column.prefetchOptions();
    column.prefetchValues();
    column.prefetchFacetedUniqueValues();
    column.prefetchFacetedMinMaxValues();
  }, [column]);

  useEffect(() => {
    const target = itemRef.current;

    if (!target) return;

    // Set up MutationObserver
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          const isSelected = target.getAttribute("data-selected") === "true";
          if (isSelected) prefetch();
        }
      }
    });

    // Set up observer
    observer.observe(target, {
      attributes: true,
      attributeFilter: ["data-selected"],
    });

    // Cleanup on unmount
    return () => observer.disconnect();
  }, [prefetch]);

  return (
    <CommandItem
      ref={itemRef}
      value={column.id}
      keywords={[column.displayName]}
      onSelect={() => setProperty(column.id)}
      className="group"
      onMouseEnter={prefetch}
    >
      <div className="flex w-full items-center justify-between">
        <div className="inline-flex items-center gap-1.5">
          {<column.icon strokeWidth={2.25} className="size-4" />}
          <span>{column.displayName}</span>
        </div>
        <ArrowRightIcon className="size-4 opacity-0 group-aria-selected:opacity-100" />
      </div>
    </CommandItem>
  );
}

export const QuickSearchFilters = memo(__QuickSearchFilters);

function __QuickSearchFilters({
  search,
  filters,
  columns,
  actions,
  strategy,
  locale = "en",
}) {
  if (!search || search.trim().length < 2) return null;

  const cols = useMemo(
    () => columns.filter((c) => isAnyOf(c.type, ["option", "multiOption"])),
    [columns]
  );

  return (
    <>
      {cols.map((column) => {
        const filter = filters.find((f) => f.columnId === column.id);
        const options = column.getOptions();
        const optionsCount = column.getFacetedUniqueValues();

        function handleOptionSelect(value, check) {
          if (check) actions.addFilterValue(column, [value]);
          else actions.removeFilterValue(column, [value]);
        }

        return (
          <React.Fragment key={column.id}>
            {options.map((v) => {
              const checked = Boolean(filter?.values.includes(v.value));
              const count = optionsCount?.get(v.value) ?? 0;

              return (
                <CommandItem
                  key={v.value}
                  value={v.value}
                  keywords={[v.label, v.value]}
                  onSelect={() => {
                    handleOptionSelect(v.value, !checked);
                  }}
                  className="group"
                >
                  <div className="flex items-center gap-1.5 group">
                    <Checkbox
                      checked={checked}
                      className="opacity-0 data-[state=checked]:opacity-100 group-data-[selected=true]:opacity-100 dark:border-ring mr-1"
                    />
                    <div className="flex items-center w-4 justify-center">
                      {v.icon &&
                        (isValidElement(v.icon) ? (
                          v.icon
                        ) : (
                          <v.icon className="size-4 text-primary" />
                        ))}
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-muted-foreground">
                        {column.displayName}
                      </span>
                      <ChevronRightIcon className="size-3.5 text-muted-foreground/75" />
                      <span>
                        {v.label}
                        <sup
                          className={cn(
                            !optionsCount && "hidden",
                            "ml-0.5 tabular-nums tracking-tight text-muted-foreground",
                            count === 0 && "slashed-zero"
                          )}
                        >
                          {count < 100 ? count : "100+"}
                        </sup>
                      </span>
                    </div>
                  </div>
                </CommandItem>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
}
