import { createBrowserRouter, Navigate } from "react-router";
import { VetLayout } from "./vet/layouts/VetLayout";
import DashboardPage from "./vet/pages/DashboardPage";
import { AuthLayout } from "./auth/layouts/AuthLayout";
import { LoginPage } from "./auth/pages/LoginPage";
import { ProductsPage } from "./vet/pages/ProductsPage";
import EspeciesPage from "./vet/pages/EspeciesPage";
import ClientesPage from "./vet/pages/ClientesPage";
import MascotasPage from "./vet/pages/MascotasPage";
import HorariosPage from "./vet/pages/HorariosPage";
import CitasPage from "./vet/pages/CitasPage";
import DiagnosticosPage from "./vet/pages/DiagnosticosPage";
import TratamientosPage from "./vet/pages/TratamientosPage";
import VacunasPage from "./vet/pages/VacunasPage";
import AplicacionesVacunaPage from "./vet/pages/AplicacionesVacunaPage";
import { authMiddleware } from "./middleware/auth.middleware";

export const router=createBrowserRouter([
    {
        path:'/',
        Component:()=>{return <div>Home Layout</div>},
        children:[

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
                path:'products',
                Component:ProductsPage
            },
            {
                path:'especies',
                Component:EspeciesPage
            },
            {
                path:'clientes',
                Component:ClientesPage
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
                path:'aplicaciones-vacuna',
                Component:AplicacionesVacunaPage
            }
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
