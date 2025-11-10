import * as React from "react"
import {
  Users,
  Heart,
  Clock,
  Calendar,
  Stethoscope,
  Pill,
  Syringe,
  Activity,
  Dog,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavProjects } from "./NavProjects"
import { NavUser } from "./NavUser"
import { useAuthStore } from "@/auth/store/auth.store"

// Data para el sistema veterinario
const data = {
  projects: [
    {
      name: "Doctores",
      url: "/vet/doctores",
      icon: Users,
    },
    {
      name: "Clientes", 
      url: "/vet/clientes",
      icon: Users,
    },
    {
      name: "Especies",
      url: "/vet/especies",
      icon: Activity,
    },
    {
      name: "Mascotas",
      url: "/vet/mascotas",
      icon: Dog,
    },
    {
      name: "Horarios",
      url: "/vet/horarios",
      icon: Clock,
    },
    {
      name: "Citas",
      url: "/vet/citas",
      icon: Calendar,
    },
    {
      name: "Diagnósticos",
      url: "/vet/diagnosticos",
      icon: Stethoscope,
    },
    {
      name: "Tratamientos",
      url: "/vet/tratamientos",
      icon: Heart,
    },
    {
      name: "Vacunas",
      url: "/vet/vacunas",
      icon: Pill,
    },
    {
      name: "Vacunación",
      url: "/vet/vacunacion",
      icon: Syringe,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {user}=useAuthStore();
  return (
    <Sidebar collapsible="icon" {...props}>

      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Heart className="h-6 w-6 text-red-500" />
          <span className="font-semibold text-lg">VetSystem</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{avatar:'',email:user?.email??'',name:user?.fullname??''}} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
