import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="flex">
      <Navbar />
      <Outlet />
    </div>
  );
}
