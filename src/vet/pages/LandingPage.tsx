import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Calendar, 
  Users, 
  Stethoscope, 
  Shield, 
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { Link } from "react-router";
import image1 from "@/assets/1.webp";
import image2 from "@/assets/2.webp";
import image4 from "@/assets/4.webp";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header/Navigation */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-gray-800">VetSystem</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-800 transition-colors">Características</a>
            <a href="#services" className="text-gray-600 hover:text-gray-800 transition-colors">Servicios</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-800 transition-colors">Testimonios</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-800 transition-colors">Contacto</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/auth/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                Sistema de Gestión 
                <span className="text-blue-600"> Veterinaria</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Optimiza tu clínica veterinaria con nuestro sistema integral de gestión. 
                Administra citas, expedientes médicos, inventario y más desde una sola plataforma.
              </p>
              <div className="flex justify-start">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link to="/auth/login">
                    Comenzar Ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
                <img 
                  src={image2} 
                  alt="Tecnología veterinaria" 
                  className="rounded-lg shadow-lg hover:shadow-xl transition-shadow w-full"
                />
                <img 
                  src={image4} 
                  alt="Cuidado de mascotas" 
                  className="rounded-lg shadow-lg hover:shadow-xl transition-shadow w-full"
                />
              </div>
              {/* Elementos decorativos */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-green-200 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar tu clínica veterinaria de manera eficiente
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle>Gestión de Citas</CardTitle>
                <CardDescription>
                  Programa y administra citas de manera eficiente con recordatorios automáticos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Stethoscope className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle>Expedientes Médicos</CardTitle>
                <CardDescription>
                  Mantén historiales médicos completos y detallados de cada mascota
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-500 mb-4" />
                <CardTitle>Gestión de Clientes</CardTitle>
                <CardDescription>
                  Administra información de clientes y sus mascotas en un solo lugar
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-500 mb-4" />
                <CardTitle>Control de Vacunas</CardTitle>
                <CardDescription>
                  Seguimiento completo del programa de vacunación de cada mascota
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-orange-500 mb-4" />
                <CardTitle>Horarios Flexibles</CardTitle>
                <CardDescription>
                  Configura horarios de atención personalizados para tu clínica
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-pink-500 mb-4" />
                <CardTitle>Tratamientos</CardTitle>
                <CardDescription>
                  Registra y da seguimiento a todos los tratamientos médicos
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${image1})` 
          }}
        />
        <div className="relative z-10 container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Soluciones completas para modernizar tu práctica veterinaria
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">
                ¿Por qué elegir VetSystem?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Fácil de usar</h4>
                    <p className="text-gray-200">Interfaz intuitiva diseñada específicamente para veterinarios</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Seguro y confiable</h4>
                    <p className="text-gray-200">Tus datos están protegidos con los más altos estándares de seguridad</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Soporte 24/7</h4>
                    <p className="text-gray-200">Nuestro equipo está disponible para ayudarte cuando lo necesites</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Actualizaciones constantes</h4>
                    <p className="text-gray-200">Mejoras continuas basadas en feedback de veterinarios</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-6 bg-white/90 backdrop-blur-sm border-white/20">
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-700">Clínicas Activas</div>
                </CardContent>
              </Card>
              <Card className="text-center p-6 bg-white/90 backdrop-blur-sm border-white/20">
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
                  <div className="text-gray-700">Mascotas Registradas</div>
                </CardContent>
              </Card>
              <Card className="text-center p-6 bg-white/90 backdrop-blur-sm border-white/20">
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                  <div className="text-gray-700">Tiempo de Actividad</div>
                </CardContent>
              </Card>
              <Card className="text-center p-6 bg-white/90 backdrop-blur-sm border-white/20">
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-orange-600 mb-2">4.9★</div>
                  <div className="text-gray-700">Calificación</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Testimonios reales de veterinarios que han transformado su práctica
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "VetSystem ha revolucionado la forma en que manejo mi clínica. 
                  La gestión de citas es increíblemente eficiente."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    DR
                  </div>
                  <div>
                    <div className="font-semibold">Dr. Roberto Martínez</div>
                    <div className="text-sm text-gray-500">Clínica Veterinaria San José</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "El sistema es muy intuitivo y el soporte técnico es excelente. 
                  No podría imaginar mi práctica sin él."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    AL
                  </div>
                  <div>
                    <div className="font-semibold">Dra. Ana López</div>
                    <div className="text-sm text-gray-500">Hospital Veterinario Central</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "La funcionalidad de expedientes médicos es fantástica. 
                  Tengo toda la información que necesito al alcance de un click."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    CG
                  </div>
                  <div>
                    <div className="font-semibold">Dr. Carlos García</div>
                    <div className="text-sm text-gray-500">Clínica VetCare</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Contáctanos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ¿Listo para transformar tu clínica veterinaria? Estamos aquí para ayudarte
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Información de Contacto
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Phone className="h-6 w-6 text-blue-500" />
                  <div>
                    <div className="font-semibold">Teléfono</div>
                    <div className="text-gray-600">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6 text-blue-500" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-600">contacto@vetsystem.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-6 w-6 text-blue-500" />
                  <div>
                    <div className="font-semibold">Dirección</div>
                    <div className="text-gray-600">123 Veterinary Street, Ciudad, País</div>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Solicita Información</CardTitle>
                <CardDescription>
                  Descubre cómo VetSystem puede transformar tu clínica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nombre Completo</label>
                    <input 
                      type="text" 
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Dr. Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input 
                      type="email" 
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="doctor@clinica.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Clínica</label>
                    <input 
                      type="text" 
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nombre de tu clínica"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mensaje</label>
                    <textarea 
                      rows={4}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Cuéntanos sobre tu clínica y cómo podemos ayudarte"
                    />
                  </div>
                  <Button className="w-full">
                    Enviar Información
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-red-500" />
                <span className="text-xl font-bold">VetSystem</span>
              </div>
              <p className="text-gray-400">
                La solución completa para la gestión de clínicas veterinarias modernas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 VetSystem. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}