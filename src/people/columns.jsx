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

export const columns = [
  {
    accessorKey: "id",
    header: () => <div className="text-center">Person ID</div>,
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex justify-center items-center mx-auto"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "last_name",
    header: () => <div className="text-center">Last Name</div>,
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center">Email</div>,
  },
  {
    accessorKey: "gender",
    header: () => <div className="text-center">Gender</div>,
  },
  {
    accessorKey: "date_of_birth",
    header: () => <div className="text-center">Date of Birth</div>,
    cell: ({ row }) => {
      const date_of_birth = row.getValue("date_of_birth");
      return <div className="font-medium">{date_of_birth}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const person = row.original;
      const personId = person.id;
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
                navigator.clipboard.writeText(person.first_name.toString());
              }}
            >
              Copy person's name
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
