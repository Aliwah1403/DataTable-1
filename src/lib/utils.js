import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {rankItem} from '@tanstack/match-sorter-utils'

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

export const includesStringFilterFn = (row, columnId, filterValue) => {
  const value = String(row.getValue(columnId));
  const filterString = String(filterValue).toLowerCase();
  return value.toLowerCase().includes(filterString);
};

includesStringFilterFn.autoRemove = (val) => !val;