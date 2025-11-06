import { useAuthStore } from "@/auth/store/auth.store";
import { redirect } from "react-router"

export const authMiddleware = async () => {
    const authState = useAuthStore.getState();
    
    // Si el estado es 'checking', verificar el token
    if (authState.authStatus === 'checking') {
        await authState.checkAuthStatus();
    }
    
    // Después de verificar, si aún no está autenticado, redirigir
    const currentState = useAuthStore.getState();
    if (currentState.authStatus !== 'authenticated') {
        throw redirect('/auth/login');
    }
}