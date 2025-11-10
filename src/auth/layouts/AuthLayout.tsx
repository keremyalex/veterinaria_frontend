import { Outlet } from "react-router"

export const AuthLayout = () => {
  return (
    <main className="min-h-screen">
      <Outlet/>
    </main>
  )
}
