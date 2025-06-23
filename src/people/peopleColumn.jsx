import {
  ArrowUpDown,
  Heading1Icon,
  MoreHorizontal,
  CircleDotDashedIcon,
} from "lucide-react";
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

import { createColumnHelper } from "@tanstack/react-table";
import {
  IconAsterisk,
  IconCashBanknote,
  IconGenderAgender,
  IconGenderBigender,
  IconGenderFemale,
  IconGenderGenderfluid,
  IconGenderGenderqueer,
  IconGenderMale,
  IconMoneybag,
} from "@tabler/icons-react";

const columnHelper = createColumnHelper();

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
  columnHelper.accessor((row) => row.gender, {
    id: "gender",
    header: "Gender",
    enableColumnFilter: true,
    cell: ({ row }) => {
      const { gender } = row.original;

      return (
        <div className="flex items-center gap-2">
          <CircleDotDashedIcon className="size-4" />
          <span>{gender}</span>
        </div>
      );
    },
    // cell: ({ row }) => {
    //   const { gender } = row.original;
    //   const StatusIcon = gender.icon;

    //   return (
    //     <div className="flex items-center gap-2">
    //       <StatusIcon className="size-4" />
    //       <span>{gender.name}</span>
    //     </div>
    //   );
    // },
  }),
  // {
  //   accessorKey: "gender",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Gender" />
  //   ),
  //   filterFn: includesStringFilterFn,
  // },
  {
    accessorKey: "date_of_birth",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
  },
  // {
  //   accessorKey: "salary",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Salary" />
  //   ),
  // },
  columnHelper.accessor((row) => row.salary, {
    id: "salary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary" />
    ),
    enableColumnFilter: true,
    cell: ({ row }) => {
      const salary = row.getValue("salary");
      if (!salary) {
        return <div className="text-left">N/A</div>;
      }
      return (
        <div className="text-left">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(salary)}
        </div>
      );
    },
  }),
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
