import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { useMemo, useState } from "react";

import { Settings2 } from "lucide-react";
import { CalendarIcon, Cross2Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { cn, getDropDownValues } from "../lib/utils";

import DataTableViewOptions from "../components/datatableoption";
import DataTablePagination from "../components/datatablepagination";
import DateInputFilter from "../components/dateinputfilter";
// import DataTableFacetedFilter from "../components/faceted-filter";

import { exportToExcel } from "../lib/xlsx";
import { DataTableFacetedFilter } from "../components/faceted-filter";
import { ExportModal } from "@/components/dataexportmodal";
import { peopleColums } from "./peopleColumn";

import {
  DataTableFilter,
  useDataTableFilters,
} from "../components/data-table-filter";
import { columnsConfig } from "./peopleColumn";
import {
  createTSTColumns,
  createTSTFilters,
} from "../components/data-table-filter/integrations/tanstack-table";

export function DataTable({ data }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState([]);
  const [rowSelection, setRowSelection] = useState([]);
  const [date, setDate] = useState();

  const { columns, filters, actions, strategy } = useDataTableFilters({
    strategy: "client",
    data: data ?? [],
    columnsConfig,
  });

  const tstColumns = useMemo(
    () =>
      createTSTColumns({
        columns: peopleColums,
        configs: columnsConfig,
      }),
    [columns]
  );

  const tstFilters = useMemo(() => createTSTFilters(filters), [filters]);

  const table = useReactTable({
    data,
    columns: tstColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters: tstFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center py-4">
            <div className="flex flex-row gap-2">
              {/* BazzaUI filters */}
              <DataTableFilter
                filters={filters}
                columns={columns}
                actions={actions}
                strategy={strategy}
              />
              {/* Filter input field */}
              {/* <Input
                placeholder="Filter by Name"
                className="max-w-sm"
                value={table.getColumn("first_name")?.getFilterValue() ?? ""}
                onChange={(e) => {
                  table.getColumn("first_name")?.setFilterValue(e.target.value);
                }}
              />

              {table.getColumn("gender") && (
                <DataTableFacetedFilter
                  column={table.getColumn("gender")}
                  title="Gender"
                  options={getDropDownValues(data, "gender")}
                />
              )}

              {isFiltered && (
                <Button
                  aria-label="Reset filters"
                  variant="ghost"
                  onClick={() => table.resetColumnFilters()}
                  className="h-8 px-2 lg:px-3"
                >
                  Reset
                  <Cross2Icon className="ml-2 size-4" aria-hidden="true" />
                </Button>
              )} */}

              {/* Date picker filter */}
              {/* <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Filter by date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover> */}
            </div>

            <div className="flex flex-row gap-2">
              {/* export data button */}
              {/* <Button
                size="sm"
                className="h-8 bg-[#109189] hover:bg-[#11746e]"
                onClick={() => exportToExcel()}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                >
                  <path
                    d="M3.5 2C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V6H8.5C8.22386 6 8 5.77614 8 5.5V2H3.5ZM9 2.70711L11.2929 5H9V2.70711ZM2 2.5C2 1.67157 2.67157 1 3.5 1H8.5C8.63261 1 8.75979 1.05268 8.85355 1.14645L12.8536 5.14645C12.9473 5.24021 13 5.36739 13 5.5V12.5C13 13.3284 12.3284 14 11.5 14H3.5C2.67157 14 2 13.3284 2 12.5V2.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Export
              </Button> */}

              {/* <ExportModal columns={peopleColums} /> */}

              {/* Column visibility dropdown */}
              <DataTableViewOptions table={table} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table Section */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3">
            {" "}
            <DataTablePagination table={table} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DataTable;
