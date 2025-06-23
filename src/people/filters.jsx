import { createColumnConfigHelper } from "../components/data-table-filter/core/filters";
import {
  IconAsterisk,
  IconCashBanknote,
  IconGenderAgender,
  IconGenderBigender,
  IconGenderFemale,
  IconGenderGenderfluid,
  IconGenderGenderqueer,
  IconGenderMale,
} from "@tabler/icons-react";
import { Heading1Icon, CircleDotDashedIcon } from "lucide-react";

const dtf = createColumnConfigHelper();

const GENDER_STATUSES = [
  { id: "male", name: "Male", icon: IconGenderMale },
  { id: "female", name: "Female", icon: IconGenderFemale },
  { id: "polygender", name: "Polygender", icon: IconAsterisk },
  { id: "genderqueer", name: "Genderqueer", icon: IconGenderGenderqueer },
  { id: "bigender", name: "Bigender", icon: IconGenderBigender },
  { id: "nonBinary", name: "Non-binary", icon: IconAsterisk },
  { id: "genderFluid", name: "Genderfluid", icon: IconGenderGenderfluid },
  { id: "agender", name: "Agender", icon: IconGenderAgender },
];

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

  dtf
    .option()
    .id("gender")
    .accessor((row) => row.gender)
    .displayName("Gender")
    .icon(CircleDotDashedIcon)
    .options(
      GENDER_STATUSES.map((gender) => {
        return {
          value: gender.id,
          label: gender.name,
          icon: gender.icon,
        };
      })
    )
    .build(),

  dtf
    .number()
    .accessor((row) => row.salary)
    .id("salary")
    .displayName("Salary")
    .icon(IconCashBanknote)
    .build(),
];
