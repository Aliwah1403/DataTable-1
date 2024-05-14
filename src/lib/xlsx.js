import xlsx from "json-as-xlsx";
import { expenditure } from "@/expenditure";

export const exportToExcel = () => {
  let columns = [
    {
      sheet: "Expenditure",
      columns: [
        { label: "Registration", value: "registration" },
        { label: "Driver", value: "driver" },
        { label: "Destination", value: "destination" },
        { label: "Rate", value: "rate" },
        { label: "Fuel", value: "fuel" },
        { label: "Clerk Fee", value: "clerkFee" },
        { label: "Milage Fee", value: "milageFee" },
        { label: "Repair Cost", value: "repairCost" },
        { label: "Extra Cost", value: "extraCost" },
      ],
      content: expenditure,
    },
  ];

  let settings = {
    fileName: "Expenditure report",
  };

  xlsx(columns, settings);
};
