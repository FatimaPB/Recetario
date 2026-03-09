export interface Platillo {
  id_platillo?: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  id_subcategoria: number;
  subcategoria?: string;
  activo?: boolean;
  costo_total?: number;
  precio_venta?: number;
}
