import xlsx from "json-as-xlsx";
import { expenditure } from "@/expenditure";
import { people } from "@/people";

export const exportToExcel = () => {
  let columns = [
    {
      sheet: "People",
      columns: [
        { label: "First Name", value: "first_name" },
        { label: "Last Name", value: "last_name" },
        { label: "Gender", value: "gender" },
      ],
      content: people,
    },
  ];

  // let columns = [
  //   {
  //     sheet: "Expenditure",
  //     columns: [
  //       { label: "Registration", value: "registration" },
  //       { label: "Driver", value: "driver" },
  //       { label: "Destination", value: "destination" },
  //       { label: "Rate", value: "rate" },
  //       { label: "Fuel", value: "fuel" },
  //       { label: "Clerk Fee", value: "clerkFee" },
  //       { label: "Milage Fee", value: "milageFee" },
  //       { label: "Repair Cost", value: "repairCost" },
  //       { label: "Extra Cost", value: "extraCost" },
  //     ],
  //     content: expenditure,
  //   },
  // ];

  let settings = {
    fileName: "People report",
  };

  xlsx(columns, settings);
};
