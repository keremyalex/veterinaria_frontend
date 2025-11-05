import { create } from 'zustand';
import type { Auth } from '../interfaces/auth.interface';
import { clientGraphQl } from '@/api/graph-client';
import { LOGIN } from '@/graphql/mutations/login.mutation';


type AuthStatus = 'authenticated' | 'no-authenticated' | 'checking';

type AuthState = {
    token: string | null;
    tokenExpiration: string | null;
    user: Auth | null;
    authStatus: AuthStatus;

    login: (email:string,password:string) => Promise<boolean>;
    logout: () =>void;
}

export const useAuthStore=create<AuthState>()((set)=>({
    token:null,
    tokenExpiration:null,
    user:null,
    authStatus:'checking',

    login:async(email,password)=>{
        try{
            const {data}=await clientGraphQl.mutate({
                mutation:LOGIN,
                variables:{
                    login:{
                        email:email,
                        password:password
                    }
                }
            });
            console.log(data);
            
            if(!data){
                throw new Error('data no provided');
            }
            const {login:userauth}=data;
            localStorage.setItem('token',userauth.token);

            set({
                authStatus:'authenticated',
                token:userauth.token,
                user:{
                    email:userauth.user.email,
                    fullname:userauth.user.fullname,
                    id:userauth.user.email,
                    roles:userauth.user.roles,
                    isActive:userauth.user.isActive
                    
                },
            });
            return true;
        }catch(error){
            console.log(error);
            localStorage.removeItem('token');
            set({
                authStatus:'no-authenticated',
                token:null,
                tokenExpiration:null,
                user:null,
            });
            return false;
        }
    },
    
    logout:()=>{

    }
}));
