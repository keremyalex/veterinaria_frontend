import { Outlet } from "react-router";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};