import { createBrowserRouter, Navigate } from "react-router";
import { VetLayout } from "./vet/layouts/VetLayout";
import DashboardPage from "./vet/pages/DashboardPage";
import { AuthLayout } from "./auth/layouts/AuthLayout";
import { LoginPage } from "./auth/pages/LoginPage";
import { ProductsPage } from "./vet/pages/ProductsPage";
import EspeciesPage from "./vet/pages/EspeciesPage";
import ClientesPage from "./vet/pages/ClientesPage";
import MascotasPageWithForm from "./vet/pages/MascotasPageWithForm";
import HorariosPageWithForm from './vet/pages/HorariosPageWithForm';
import CitasPageWithForm from './vet/pages/CitasPageWithForm';
import DiagnosticosPageWithForm from './vet/pages/DiagnosticosPageWithForm';
import TratamientosPageWithForm from './vet/pages/TratamientosPageWithForm';
import VacunasPageWithForm from './vet/pages/VacunasPageWithForm';
import AplicacionesVacunaPageWithForm from './vet/pages/AplicacionesVacunaPageWithForm';
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
                Component:MascotasPageWithForm
            },
            {
                path:'horarios',
                Component:HorariosPageWithForm
            },
            {
                path:'citas',
                Component:CitasPageWithForm
            },
            {
                path:'diagnosticos',
                Component:DiagnosticosPageWithForm
            },
            {
                path:'tratamientos',
                Component:TratamientosPageWithForm
            },
            {
                path:'vacunas',
                Component:VacunasPageWithForm
            },
            {
                path:'aplicaciones-vacuna',
                Component:AplicacionesVacunaPageWithForm
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
