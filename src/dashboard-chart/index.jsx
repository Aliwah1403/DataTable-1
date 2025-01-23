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
import {
  CalendarIcon,
  Monitor,
  WalletIcon,
  CreditCardIcon,
} from "lucide-react";
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
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

// Your existing mock data generation code
const generateMockData = () => {
  const today = new Date();
  const oneYearAgo = subMonths(today, 12);
  const data = [];

  for (let i = 0; i < 365; i++) {
    const date = addDays(oneYearAgo, i);
    data.push({
      _id: i.toString(),
      date: format(date, "yyyy-MM-dd"),
      income: Math.floor(Math.random() * 100000) + 100000,
      expenses: Math.floor(Math.random() * 80000) + 70000,
    });
  }

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
      case "30D":
        setDateRange({ from: addDays(today, -30), to: today });
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
      setTimeRange("ALL");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-end gap-4 md:flex-row md:items-center">
        <div className="inline-flex rounded-lg border bg-background p-1">
          <Button
            variant={timeRange === "7D" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleTimeRangeChange("7D")}
            className="rounded-l-md"
          >
            7D
          </Button>
          <Button
            variant={timeRange === "30D" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleTimeRangeChange("30D")}
            className="rounded-none border-l"
          >
            1M
          </Button>
          <Button
            variant={timeRange === "3M" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleTimeRangeChange("3M")}
            className="rounded-none border-l"
          >
            3M
          </Button>
          <Button
            variant={timeRange === "6M" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleTimeRangeChange("6M")}
            className="rounded-none border-l"
          >
            6M
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={timeRange === "custom" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-r-md border-l"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd")} -{" "}
                      {format(dateRange.to, "LLL dd")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd")
                  )
                ) : (
                  <span>Custom</span>
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
                color: "#053030",
                icon: WalletIcon,
              },
              expenses: {
                label: "Expenses",
                color: "#1cb447",
                icon: CreditCardIcon,
              },
            }}
            className="h-[400px] w-full"
          >
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
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income Trend (KES)</CardTitle>
            <CardDescription>
              Income analysis over selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                income: {
                  label: "Income",
                  color: "#053030",
                  icon: WalletIcon,
                },
              }}
              className="h-[300px] w-full"
            >
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
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Analysis (KES)</CardTitle>
            <CardDescription>
              Expense patterns over selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                expenses: {
                  label: "Expenses",
                  color: "#1cb447",
                  icon: CreditCardIcon,
                },
              }}
              className="h-[300px] w-full"
            >
              <AreaChart data={filteredData}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(parseISO(value), "MMM dd")}
                  interval={Math.floor(filteredData.length / 10)}
                />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  fill="#1cb447"
                  fillOpacity={0.2}
                  stroke="#1cb447"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
