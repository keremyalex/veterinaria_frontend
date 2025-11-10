import { createBrowserRouter, Navigate } from "react-router";
import { VetLayout } from "./vet/layouts/VetLayout";
import DashboardPage from "./vet/pages/DashboardPage";
import { AuthLayout } from "./auth/layouts/AuthLayout";
import { LoginPage } from "./auth/pages/LoginPage";
import DoctoresPage from "./vet/pages/DoctoresPage";
import ClientesPage from "./vet/pages/ClientesPage";
import EspeciesPage from "./vet/pages/EspeciesPage";
import MascotasPage from "./vet/pages/MascotasPage";
import HorariosPage from "./vet/pages/HorariosPage";
import CitasPage from "./vet/pages/CitasPage";
import DiagnosticosPage from "./vet/pages/DiagnosticosPage";
import TratamientosPage from "./vet/pages/TratamientosPage";
import VacunasPage from "./vet/pages/VacunasPage";
import VacunacionPage from "./vet/pages/VacunacionPage";
import { UsuariosPage } from "./vet/pages/UsuariosPage";
import { VentasPage } from "./vet/pages/VentasPage";
import { authMiddleware } from "./middleware/auth.middleware";
import { PublicLayout } from "./layouts/PublicLayout";
import LandingPage from "./vet/pages/LandingPage";

export const router=createBrowserRouter([
    {
        path:'/',
        Component:PublicLayout,
        children:[
            {
                index: true,
                Component: LandingPage
            }
        ]
    },
    {
        path:'/vet',
        Component:VetLayout,
        middleware:[authMiddleware],
        children:[
            {
                index:true,
                element:<Navigate to={'/vet/dashboard'}/>
            },
            {
                path:'dashboard',
                Component:DashboardPage
            },
            {
                path:'doctores',
                Component:DoctoresPage
            },
            {
                path:'clientes',
                Component:ClientesPage
            },
            {
                path:'especies',
                Component:EspeciesPage
            },
            {
                path:'mascotas',
                Component:MascotasPage
            },
            {
                path:'horarios',
                Component:HorariosPage
            },
            {
                path:'citas',
                Component:CitasPage
            },
            {
                path:'diagnosticos',
                Component:DiagnosticosPage
            },
            {
                path:'tratamientos',
                Component:TratamientosPage
            },
            {
                path:'vacunas',
                Component:VacunasPage
            },
            {
                path:'vacunacion',
                Component:VacunacionPage
            },
            {
                path:'usuarios',
                Component:UsuariosPage
            },
            {
                path:'ventas',
                Component:VentasPage
            },
        ]
    },
    {
        path:'/admin',
        Component:()=>{return <div>Layout</div>},
        children:[]
    },
    {
        path:'/auth',
        Component:AuthLayout,
        children:[
            {
                index:true,
                element:<Navigate to={'/auth/login'}/>
            },
            {
                path:'login',
                Component:LoginPage
            }
        ]
    },
    {
        path:'*',
        element:<Navigate to={'/'}/>
    }

])
