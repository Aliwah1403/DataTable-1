import React from "react";
import DataTable from "./data-table";
import { people } from "../people";
import { columns } from "./columns";
import { Button } from "../components/ui/button";
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
        <Button className="bg-[#013941] hover:bg-[#053030]" size="lg">
          <Plus size={15} className="mr-3" />
          Add Data
        </Button>
      </div>
      <DataTable columns={columns} data={expenditure} />
    </>
  );
};

export default Expenditure;
