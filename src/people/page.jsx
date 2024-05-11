import React from "react";
import DataTable from "./data-table";
import { people } from "../people";
import { columns } from "./columns";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { expenditure } from "../expenditure";

const Expenditure = () => {
  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <div className="text-left">
          <h2 className="text-2xl font-semibold leading-none tracking-tight mb-2">
            Expenditure
          </h2>
          <h4 className="text-sm text-muted-foreground">
            List of trips made by your vehicles
          </h4>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-[#013941] hover:bg-[#053030]" size="lg">
              <Plus size={15} className="mr-3" />
              Add Data
            </Button>
          </SheetTrigger>
          <SheetContent className="w-1/2">
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <DataTable columns={columns} data={expenditure} />
    </>
  );
};

export default Expenditure;
