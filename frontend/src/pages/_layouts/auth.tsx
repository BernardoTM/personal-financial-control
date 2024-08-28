import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="rounded-lg md:border w-[1240px] md:mx-20  ">
        <Outlet />
      </div>
    </div>
  );
}
