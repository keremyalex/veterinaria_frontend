import { useAuthStore } from "@/auth/store/auth.store";
import { redirect } from "react-router"

export const authMiddleware = async () => {
    const authState = useAuthStore.getState();
    if (authState.authStatus !== 'authenticated') {
        throw redirect('/auth/login');
    }
}