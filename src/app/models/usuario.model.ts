export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'superadmin' | 'administrador';
  estado: 'activo' | 'inactivo';
  created_at: string;
}