export interface Receta {
  id_receta?: number;
  id_platillo: number;
  id_ingrediente: number;
  cantidad: number;
  id_unidad?: number;

  // 🔥 Campos que vienen del backend (JOIN)
  ingrediente_nombre?: string;
  unidad_base?: string;
  unidad_usada?: string;
  costo_presentacion?: number;
  cantidad_presentacion?: number;

  cantidad_receta?: number;   // 🔥 ESTE FALTABA
  costo_unitario?: number;
  costo_en_receta?: number;
}
