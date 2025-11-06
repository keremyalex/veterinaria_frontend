import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  SquareChartGantt,
  SquareTerminal,
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
import { TeamSwitcher } from "./TeamSwitcher"
import { NavMain } from "./NavMain"
import { NavProjects } from "./NavProjects"
import { NavUser } from "./NavUser"
import { useAuthStore } from "@/auth/store/auth.store"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Productos",
      url: "/vet/products",
      icon: SquareChartGantt,
    },
    {
      name: "Especies",
      url: "/vet/especies",
      icon: Activity,
    },
    {
      name: "Clientes",
      url: "/vet/clientes",
      icon: Users,
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
      icon: Pill,
    },
    {
      name: "Vacunas",
      url: "/vet/vacunas",
      icon: Heart,
    },
    {
      name: "Aplicaciones Vacuna",
      url: "/vet/aplicaciones-vacuna",
      icon: Syringe,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {user}=useAuthStore();
  return (
    <Sidebar collapsible="icon" {...props}>

      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{avatar:'',email:user?.email??'',name:user?.fullname??''}} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
