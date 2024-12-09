import "./App.css";
import { Button } from "@/components/ui/button";
import People from "./people/page";
import Dashboard from "./dashboard-chart";

function App() {
  return (
    <div className="flex flex-col gap-20">
      <People />
      Dashboard Chart
      <Dashboard />
    </div>
  );
}

export default App;
