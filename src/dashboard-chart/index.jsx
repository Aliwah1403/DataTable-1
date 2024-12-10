import * as React from "react";
import {
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  parseISO,
  subDays,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts";

// Generate mock data for 12 months plus the last 7 days
const generateMockData = () => {
  const today = new Date();
  const oneYearAgo = subMonths(today, 12);
  const data = [];

  // Generate data for the past 12 months
  for (let i = 0; i < 365; i++) {
    const date = addDays(oneYearAgo, i);
    data.push({
      _id: i.toString(),
      date: format(date, "yyyy-MM-dd"),
      income: Math.floor(Math.random() * 100000) + 100000,
      expenses: Math.floor(Math.random() * 80000) + 70000,
    });
  }

  // Add data for the last 7 days (including today)
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    data.push({
      _id: (365 + 6 - i).toString(),
      date: format(date, "yyyy-MM-dd"),
      income: Math.floor(Math.random() * 100000) + 100000,
      expenses: Math.floor(Math.random() * 80000) + 70000,
    });
  }

  return data;
};

const mockData = generateMockData();

// Function to filter data based on date range
const filterDataByDateRange = (data, startDate, endDate) => {
  return data.filter((item) => {
    const itemDate = parseISO(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });
};

export default function ExpenditureCharts() {
  const [dateRange, setDateRange] = React.useState({
    from: startOfMonth(subMonths(new Date(), 1)),
    to: endOfMonth(new Date()),
  });
  const [timeRange, setTimeRange] = React.useState("1M");
  const [chartType, setChartType] = React.useState("bar");

  // Filter data based on date range
  const filteredData = React.useMemo(
    () => filterDataByDateRange(mockData, dateRange.from, dateRange.to),
    [dateRange]
  );

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    const today = new Date();
    switch (range) {
      case "7D":
        setDateRange({ from: addDays(today, -7), to: today });
        break;
      case "1M":
        setDateRange({ from: startOfMonth(today), to: endOfMonth(today) });
        break;
      case "3M":
        setDateRange({
          from: startOfMonth(subMonths(today, 2)),
          to: endOfMonth(today),
        });
        break;
      case "6M":
        setDateRange({
          from: startOfMonth(subMonths(today, 5)),
          to: endOfMonth(today),
        });
        break;
      case "1Y":
        setDateRange({
          from: startOfMonth(subMonths(today, 11)),
          to: endOfMonth(today),
        });
        break;
      case "ALL":
        setDateRange({
          from: parseISO(mockData[0].date),
          to: parseISO(mockData[mockData.length - 1].date),
        });
        break;
    }
  };

  const handleDateRangeChange = (range) => {
    if (range?.from && range?.to) {
      setDateRange(range);
      setTimeRange("ALL"); // Reset time range when custom date is selected
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs defaultValue="bar" onValueChange={(v) => setChartType(v)}>
          <TabsList>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant={timeRange === "7D" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeRangeChange("7D")}
            >
              7D
            </Button>
            <Button
              variant={timeRange === "1M" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeRangeChange("1M")}
            >
              1M
            </Button>
            <Button
              variant={timeRange === "3M" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeRangeChange("3M")}
            >
              3M
            </Button>
            <Button
              variant={timeRange === "6M" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeRangeChange("6M")}
            >
              6M
            </Button>
            <Button
              variant={timeRange === "1Y" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeRangeChange("1Y")}
            >
              1Y
            </Button>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expenditure (KES)</CardTitle>
          <CardDescription>
            Compare income and expenses over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              income: {
                label: "Income",
                color: "hsl(var(--primary))",
              },
              expenses: {
                label: "Expenses",
                color: "hsl(var(--destructive))",
              },
            }}
            className="h-[400px] w-full"
          >
            {chartType === "bar" ? (
              <BarChart data={filteredData}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(parseISO(value), "MMM dd")}
                  interval={Math.floor(filteredData.length / 10)}
                />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="income" fill="#053030" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#1cb447" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={filteredData}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(parseISO(value), "MMM dd")}
                  interval={Math.floor(filteredData.length / 10)}
                />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#053030"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#1cb447"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
