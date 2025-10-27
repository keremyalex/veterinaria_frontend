import { create } from 'zustand';
import type { Auth } from '../interfaces/auth.interface';


type AuthStatus = 'authenticated' | 'no-authenticated' | 'checking';

type AuthState = {
    token: string | null;
    tokenExpiration: string | null;
    user: Auth | null;
    authStatus: AuthStatus;

    login: () => void;
    logout: () => void;
}

const useAuthStore=create<AuthState>()((get,set)=>({
    token:null,
    tokenExpiration:null,
    user:null,
    authStatus:'checking',

    login:()=>{

    },
    
    logout:()=>{

    }
}));
