import { useAuthStore } from "@/auth/store/auth.store";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Heart, Loader } from "lucide-react";
import {useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import backgroundImage from "@/assets/3.webp";


type IFormLoginInput = {
  email: string,
  password: string
}

export function LoginForm() {
  const [loginState, setLoginState] = useState<{loading:boolean,error:boolean}>({
    error:false,
    loading:false
  })

  const navigate=useNavigate();

  const {login}=useAuthStore();
  const { control, formState: { errors }, handleSubmit } = useForm<IFormLoginInput>({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit: SubmitHandler<IFormLoginInput> = async(data) => {
    setLoginState({
      error:false,
      loading:true,
    });

    const success=await login(data.email,data.password);
    if(!success){
      setLoginState({
        error:true,
        loading:false,
      })
      return;
    }
    navigate('/vet/dashboard');
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="h-12 w-12 text-red-400" />
              <h1 className="text-4xl font-bold">VetSystem</h1>
            </div>
            <p className="text-xl leading-relaxed max-w-md">
              La plataforma más completa para la gestión de clínicas veterinarias modernas
            </p>
            <div className="mt-8 space-y-2">
              <p className="text-lg">✓ Gestión de citas eficiente</p>
              <p className="text-lg">✓ Expedientes médicos digitales</p>
              <p className="text-lg">✓ Control de vacunación</p>
              <p className="text-lg">✓ Soporte profesional 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold text-gray-800">VetSystem</span>
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800">Bienvenido de regreso</CardTitle>
              <CardDescription className="text-gray-600">
                Ingresa a tu cuenta para continuar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <>
                          <FieldLabel htmlFor="email" className="text-gray-700">Correo Electrónico</FieldLabel>
                          <Input
                            id="email"
                            type="email"
                            placeholder="doctor@ejemplo.com"
                            required
                            className="h-11"
                            {...field}
                          />
                        </>
                      )}
                    />
                    {errors.email && <span className="text-red-600 text-xs">{errors.email.message}</span>}
                  </Field>
                  
                  <Field>
                    <Controller
                      control={control}
                      name="password"
                      rules={
                        {
                          required: { value: true, message: "Contraseña es requerida" },
                        }}
                      render={({ field }) => (
                        <>
                          <div className="flex items-center">
                            <FieldLabel htmlFor="password" className="text-gray-700">Contraseña</FieldLabel>
                            <a
                              href="#"
                              className="ml-auto text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline"
                            >
                              ¿Olvidaste tu contraseña?
                            </a>
                          </div>
                          <Input 
                            id="password" 
                            type="password" 
                            className="h-11"
                            placeholder="••••••••"
                            {...field} 
                            required 
                          />
                        </>
                      )}
                    />
                    {errors.password && <span className="text-red-600 text-xs">{errors.password.message}</span>}
                  </Field>
                  
                  {loginState.error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <span className="text-red-700 text-sm">Credenciales inválidas. Verifica tu email y contraseña.</span>
                    </div>
                  )}
                  
                  <Field>
                    <Button 
                      disabled={loginState.loading} 
                      type="submit" 
                      className="w-full h-11 text-base"
                      size="lg"
                    > 
                      {loginState.loading && (<Loader className="animate-spin mr-2 h-4 w-4"/>)} 
                      {loginState.loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>
                    
                    <FieldDescription className="text-center text-gray-600">
                      ¿No tienes una cuenta? <a href="#" className="text-blue-600 hover:text-blue-800 underline">Regístrate</a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
          
          <FieldDescription className="px-6 text-center mt-6 text-gray-500">
            Al continuar, aceptas nuestros <a href="#" className="text-blue-600 hover:underline">Términos de Servicio</a>{" "}
            y <a href="#" className="text-blue-600 hover:underline">Políticas de Privacidad</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  )
}
