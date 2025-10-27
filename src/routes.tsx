import { createBrowserRouter, Navigate } from "react-router";
import { VetLayout } from "./vet/layouts/VetLayout";
import DashboardPage from "./vet/pages/DashboardPage";
import { AuthLayout } from "./auth/layouts/AuthLayout";
import { LoginPage } from "./auth/pages/LoginPage";

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
        children:[
            {
                index:true,
                element:<Navigate to={'/vet/dashboard'}/>
            },
            {
                path:'dashboard',
                Component:DashboardPage
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
