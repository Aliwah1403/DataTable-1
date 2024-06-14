import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { rankItem } from "@tanstack/match-sorter-utils";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getDropDownValues = (data, selector) => {
  const uniqueArray = [...new Set(data.map((item) => item[selector]))];
  const noEmptyValues = uniqueArray.filter((element) => element !== "").sort();
  const optionsArray = noEmptyValues.map((listItem) => {
    return {
      value: listItem,
      label: listItem,
    };
  });
  return optionsArray;
};

export const includesStringFilterFn = (row, columnId, filterValues) => {
  // Suitable for only one filter at a time (change argument to filterValue)
  
  // const value = String(row.getValue(columnId));
  // const filterString = String(filterValue).toLowerCase();
  // return value.toLowerCase().includes(filterString);



  if (!Array.isArray(filterValues) || filterValues.length === 0) {
    return true; // If no filters are selected, include all rows
  }

  const rowValue = String(row.getValue(columnId)).toLowerCase();
  return filterValues.some((filterValue) =>
    rowValue.includes(String(filterValue).toLowerCase())
  );
};

includesStringFilterFn.autoRemove = (val) => !val;
