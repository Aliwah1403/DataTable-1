import React from "react";
import DataTable from "./data-table";
import { people } from "../people";
import { columns } from "./columns";

const People = () => {
  return <DataTable columns={columns} data={people} />;
};

export default People;
