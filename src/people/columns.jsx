import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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

export const columns = [
  {
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
  },
  {
    accessorKey: "registration",
    header: () => <div className="text-center">Registration</div>,
  },
  {
    accessorKey: "driver",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex justify-center items-center mx-auto"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Driver
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "destination",
    header: () => <div className="text-center">Destination</div>,
  },
  {
    accessorKey: "rate",
    header: () => <div className="text-center">Rate</div>,
  },
  {
    accessorKey: "fuel",
    header: () => <div className="text-center">Fuel</div>,
  },
  {
    accessorKey: "clerkFee",
    header: () => <div className="text-center">Clerk Fee</div>,
  },
  {
    accessorKey: "milageFee",
    header: () => <div className="text-center">Milage Fee</div>,
  },
  {
    accessorKey: "repairCost",
    header: () => <div className="text-center">Repair Cost</div>,
  },
  {
    accessorKey: "extraCost",
    header: () => <div className="text-center">Extra Cost</div>,
  },
  // {
  //   accessorKey: "date_of_birth",
  //   header: () => <div className="text-center">Date of Birth</div>,
  //   cell: ({ row }) => {
  //     const date_of_birth = row.getValue("date_of_birth");
  //     return <div className="font-medium">{date_of_birth}</div>;
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const expenditure = row.original;
      const registrationId = expenditure.registration;
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
                navigator.clipboard.writeText(expenditure.registration.toString());
              }}
            >
              Copy vehicle registration
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
