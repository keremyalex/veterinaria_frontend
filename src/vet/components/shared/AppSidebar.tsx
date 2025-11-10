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
  Settings,
  ShoppingCart,
  UserCog,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"
import { useAuthStore } from "@/auth/store/auth.store"

// Data para el sistema veterinario organizado por módulos
const data = {
  navMain: [
    {
      title: "Gestión Clínica",
      url: "#",
      icon: Stethoscope,
      isActive: true,
      items: [
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
    },
    {
      title: "Administración",
      url: "#",
      icon: Settings,
      items: [
        {
          name: "Usuarios",
          url: "/vet/usuarios",
          icon: UserCog,
        },
      ],
    },
    {
      title: "Ventas",
      url: "#",
      icon: ShoppingCart,
      items: [
        {
          name: "Panel de Ventas",
          url: "/vet/ventas",
          icon: ShoppingCart,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  const { state } = useSidebar();
  
  return (
    <Sidebar collapsible="icon" {...props}>

      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Heart className="h-6 w-6 text-red-500" />
          {state !== "collapsed" && (
            <span className="font-semibold text-lg">VetSystem</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{avatar:'',email:user?.email??'',name:user?.fullname??''}} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
