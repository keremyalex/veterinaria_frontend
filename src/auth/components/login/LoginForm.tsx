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
import { Loader } from "lucide-react";
import {useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";


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
    <div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido de regreso</CardTitle>
          <CardDescription>
            Ingresa a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* <Field>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field> */}
              {/* <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator> */}
              <Field>

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <>
                      <FieldLabel htmlFor="email">Correo</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
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
                      required: { value: true, message: "Contrasena es requerido" },
                    }}
                  render={({ field }) => (
                    <>
                      <div className="flex items-center">
                        <FieldLabel htmlFor="password">Contrasena</FieldLabel>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Olvidaste tu contrasena?
                        </a>
                      </div>
                      <Input id="password" type="password" {...field} required />
                    </>
                  )}
                />

                {errors.password && <span className="text-red-600 text-xs">{errors.password.message}</span>}
              </Field>
              {loginState.error && (<span className="text-red-600 text-xs p-0">{"Credenciales invalidas,."}</span>)}
              <Field>
                <Button disabled={loginState.loading} type="submit"> {loginState.loading && (<Loader className="animate-spin"/>)} Ingresar</Button>
                <FieldDescription className="text-center">
                  No tienes una cuenta? <a href="#">Registrate</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Al continuar, aceptas nuestros <a href="#">Terminos de Servicio</a>{" "}
        y <a href="#">Politicas de Privacidad</a>.
      </FieldDescription>
    </div>
  )
}
