import { create } from 'zustand';
import type { Auth } from '../interfaces/auth.interface';
import { clientGraphQl } from '@/api/graph-client';
import { LOGIN } from '@/graphql/mutations/login.mutation';
import { REVALIDATE_TOKEN } from '@/graphql/queries/revalidate.query';

type AuthStatus = 'authenticated' | 'no-authenticated' | 'checking';

type AuthState = {
    token: string | null;
    tokenExpiration: string | null;
    user: Auth | null;
    authStatus: AuthStatus;

    login: (email:string,password:string) => Promise<boolean>;
    logout: () => void;
    checkAuthStatus: () => Promise<void>;
    revalidateToken: () => Promise<boolean>;
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
    
    logout: () => {
        localStorage.removeItem('token');
        set({
            authStatus: 'no-authenticated',
            token: null,
            tokenExpiration: null,
            user: null,
        });
    },

    checkAuthStatus: async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            set({
                authStatus: 'no-authenticated',
                token: null,
                tokenExpiration: null,
                user: null,
            });
            return;
        }

        // Intentar revalidar el token
        const isValid = await useAuthStore.getState().revalidateToken();
        
        if (!isValid) {
            localStorage.removeItem('token');
            set({
                authStatus: 'no-authenticated',
                token: null,
                tokenExpiration: null,
                user: null,
            });
        }
    },

    revalidateToken: async () => {
        try {
            const { data } = await clientGraphQl.query({
                query: REVALIDATE_TOKEN,
                fetchPolicy: 'network-only' // Siempre consultar el servidor
            });

            if (!data || !(data as any).revalidate) {
                throw new Error('Invalid response from revalidate');
            }

            const { revalidate } = data as any;
            
            // Actualizar el token si viene uno nuevo
            if (revalidate.token) {
                localStorage.setItem('token', revalidate.token);
            }

            set({
                authStatus: 'authenticated',
                token: revalidate.token || localStorage.getItem('token'),
                user: {
                    email: revalidate.user.email,
                    fullname: revalidate.user.fullname,
                    id: revalidate.user.id,
                    roles: revalidate.user.roles,
                    isActive: revalidate.user.isActive
                },
            });

            return true;
        } catch (error) {
            console.error('Error revalidating token:', error);
            return false;
        }
    }
}));
