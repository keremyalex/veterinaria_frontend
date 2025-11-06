import { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { checkAuthStatus, authStatus } = useAuthStore();

  useEffect(() => {
    // Verificar el estado de autenticación al cargar la app
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Mostrar un loading mientras se verifica la autenticación
  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};