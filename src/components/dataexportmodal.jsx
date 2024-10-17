import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { DownloadIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { cn } from "@/lib/utils";
import { FileText, FileSpreadsheet, FileJson, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ExportModal({ columns }) {
  const [exportType, setExportType] = useState(null);
  const [loadingType, setLoadingType] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState(
    columns.filter((col) => col.accessorKey).map((col) => col.accessorKey)
  );
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  const handleExportTypeSelect = (type) => {
    setLoadingType(type);
    setTimeout(() => {
      setExportType(type);
      setLoadingType(null);
    }, 1000); // Simulating a loading delay
  };

  const handleColumnToggle = (columnId) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleExport = () => {
    console.log("Exporting data:", {
      type: exportType,
      columns: selectedColumns,
      dateRange,
    });
    // Implement actual export logic here
  };

  const handleGoBack = () => {
    setExportType(null);
  };

  const getColumnLabel = (column) => {
    if (typeof column.header === "function") {
      // Extract the title from the header function
      const headerContent = column.header({ column });
      if (React.isValidElement(headerContent) && headerContent.props.title) {
        return headerContent.props.title;
      }
    }
    return typeof column.header === "string"
      ? column.header
      : column.accessorKey;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8">
          <DownloadIcon className="mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            {exportType
              ? "Select columns and date range for your export"
              : "Choose a format to export your data."}
          </DialogDescription>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {!exportType ? (
            <motion.div
              key="export-options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-4 py-4"
            >
              {["pdf", "csv", "excel", "json"].map((type) => (
                <Button
                  key={type}
                  onClick={() => handleExportTypeSelect(type)}
                  className="h-24 flex flex-col items-center justify-center bg-green-950 hover:bg-green-950/80 dark:bg-transparent dark:border text-white "
                  disabled={loadingType !== null}
                >
                  {loadingType === type ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {type === "pdf" && (
                        <FileText
                          className="mb-2 dark:stroke-cyan-600"
                          size={24}
                        />
                      )}
                      {type === "csv" && (
                        <FileText
                          className="mb-2 dark:stroke-cyan-600"
                          size={24}
                        />
                      )}
                      {type === "excel" && (
                        <FileSpreadsheet
                          className="mb-2 dark:stroke-cyan-600"
                          size={24}
                        />
                      )}
                      {type === "json" && (
                        <FileJson
                          className="mb-2 dark:stroke-cyan-600"
                          size={24}
                        />
                      )}
                      {type.toUpperCase()}
                    </>
                  )}
                </Button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="export-settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 py-4"
            >
              <div className="flex items-center gap-4">
                <Label htmlFor="date-range" className="w-24 flex-shrink-0">
                  Date Range
                </Label>
                <CalendarDatePicker className="flex-grow" />
              </div>
              <div className="grid gap-2">
                <Label className="text-left">Select Columns</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {columns
                      .filter((col) => col.accessorKey)
                      .map((column) => (
                        <div
                          key={column.accessorKey}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={column.id}
                            checked={selectedColumns.includes(
                              column.accessorKey
                            )}
                            onCheckedChange={() =>
                              handleColumnToggle(column.accessorKey)
                            }
                            className="border-green-950  data-[state=checked]:bg-green-950 data-[state=checked]:border-green-950"
                          />
                          <label
                            htmlFor={column.accessorKey}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {getColumnLabel(column)}
                          </label>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </div>
              <div className="flex justify-between mt-4">
                <Button onClick={handleGoBack} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
                <Button
                  onClick={handleExport}
                  className="bg-green-950 hover:bg-green-900 text-white"
                >
                  Export as {exportType.toUpperCase()}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
