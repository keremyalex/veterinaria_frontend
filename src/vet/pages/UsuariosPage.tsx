import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Trash2, Edit, Plus, UserPlus, Shield, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/shared/Spinner";
import { GET_USERS } from "@/graphql/queries/auth-management.queries";
import { UPDATE_USER, REMOVE_USER, SIGNUP_USER } from "@/graphql/mutations/auth-management.mutations";
import type { User, UserFormData, ValidRoles } from "@/vet/interfaces/auth-management.interface";

export const UsuariosPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState<ValidRoles | "">("");

  // Queries y Mutations
  const { data, loading, refetch } = useQuery<{ users: User[] }>(GET_USERS, {
    variables: { roles: roleFilter ? [roleFilter] : [] },
    errorPolicy: "all"
  });

  const [signupUser] = useMutation(SIGNUP_USER, {
    onCompleted: () => {
      refetch();
      setIsCreateOpen(false);
    },
    onError: (error: any) => {
      console.error("Error creando usuario:", error);
      alert("Error al crear usuario: " + error.message);
    }
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      refetch();
      setIsEditOpen(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      console.error("Error actualizando usuario:", error);
      alert("Error al actualizar usuario: " + error.message);
    }
  });

  const [removeUser] = useMutation(REMOVE_USER, {
    onCompleted: () => {
      refetch();
    },
    onError: (error: any) => {
      console.error("Error eliminando usuario:", error);
      alert("Error al eliminar usuario: " + error.message);
    }
  });

  const users = data?.users || [];
  const sortedUsers = [...users].sort((a, b) => parseInt(a.id) - parseInt(b.id));

  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const userData: UserFormData = {
      fullname: formData.get("fullname") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      roles: [formData.get("roles") as string]
    };

    signupUser({
      variables: {
        signupInput: {
          fullname: userData.fullname,
          email: userData.email,
          password: userData.password
        }
      }
    });
  };

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    
    const updateData: any = {
      id: selectedUser.id,
      fullname: formData.get("fullname") as string,
      email: formData.get("email") as string,
    };

    // Solo incluir password si no está vacío
    if (password.trim()) {
      updateData.password = password;
    }

    updateUser({
      variables: { updateUserInput: updateData }
    });
  };

  const handleDeleteUser = (user: User) => {
    if (confirm(`¿Estás seguro de eliminar al usuario ${user.fullname}?`)) {
      removeUser({
        variables: { id: parseInt(user.id) }
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema veterinario
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u: User) => u.roles.includes('admin')).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u: User) => u.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>
                {sortedUsers.length} usuario(s) encontrado(s)
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="roleFilter">Filtrar por rol:</Label>
                <NativeSelect
                  id="roleFilter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as ValidRoles | "")}
                >
                  <option value="">Todos</option>
                  <option value="admin">Administradores</option>
                  <option value="user">Usuarios</option>
                </NativeSelect>
              </div>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {sortedUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No hay usuarios</h3>
              <p className="text-muted-foreground">
                No se encontraron usuarios con los filtros aplicados.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">#{user.id}</TableCell>
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              role === 'admin'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {role === 'admin' ? 'Admin' : 'Usuario'}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Crea un nuevo usuario en el sistema
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-fullname">Nombre Completo</Label>
              <Input
                id="create-fullname"
                name="fullname"
                required
                placeholder="Juan Pérez"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                name="email"
                type="email"
                required
                placeholder="juan@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-password">Contraseña</Label>
              <Input
                id="create-password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-roles">Rol</Label>
              <NativeSelect name="roles" required>
                <option value="">Seleccionar rol</option>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </NativeSelect>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Crear Usuario</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica la información del usuario
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-fullname">Nombre Completo</Label>
                <Input
                  id="edit-fullname"
                  name="fullname"
                  required
                  defaultValue={selectedUser.fullname}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  required
                  defaultValue={selectedUser.email}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-password">Nueva Contraseña (opcional)</Label>
                <Input
                  id="edit-password"
                  name="password"
                  type="password"
                  placeholder="Dejar vacío para mantener la actual"
                />
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditOpen(false);
                    setSelectedUser(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Actualizar</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};