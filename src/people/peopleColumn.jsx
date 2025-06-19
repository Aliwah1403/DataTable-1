import { ArrowUpDown, Heading1Icon, MoreHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "../components/ui/checkbox";
import DataTableColumnHeader from "../components/datatableheader";
import { includesStringFilterFn } from "../lib/utils";

import { createColumnConfigHelper } from "../components/data-table-filter/core/filters";
import { createColumnHelper } from "@tanstack/react-table";

const dtf = createColumnConfigHelper();
const columnHelper = createColumnHelper();

export const columnsConfig = [
  dtf
    .text()
    .id("first_name")
    .accessor((row) => row.first_name)
    .displayName("First Name")
    .icon(Heading1Icon)
    .build(),

  dtf
    .text()
    .id("last_name")
    .accessor((row) => row.last_name)
    .displayName("Last Name")
    .icon(Heading1Icon)
    .build(),
];

export const peopleColums = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  }),
  columnHelper.accessor((row) => row.first_name, {
    id: "first_name",
    header: "First Name",
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="font-bold text-left">{row.getValue("first_name")}</div>
    ),
  }),
  columnHelper.accessor((row) => row.last_name, {
    id: "last_name",
    header: "Last Name",
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("last_name")}</div>
    ),
  }),

  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    filterFn: includesStringFilterFn,
  },
  {
    accessorKey: "date_of_birth",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const people = row.original;
      const firstName = people.first_name;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(firstName.toString());
              }}
            >
              Copy first name
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400">
              Delete row
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
