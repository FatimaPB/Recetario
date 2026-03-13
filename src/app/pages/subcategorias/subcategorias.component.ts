import { Component, OnInit } from '@angular/core';
import { Subcategoria } from '../../models/subcategoria.model';
import { CategoriaGlobal } from '../../models/categoria-global.model';
import { SubcategoriaService } from '../../services/subcategoria.service';
import { CategoriaGlobalService } from '../../services/categoria-global.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'


interface Toast {
  id: number;
  mensaje: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
}


@Component({
  selector: 'app-subcategorias',
  imports: [FormsModule, CommonModule],
  templateUrl: './subcategorias.component.html',
  styleUrl: './subcategorias.component.css'
})
export class SubcategoriasComponent {




  toasts: Toast[] = [];
  private toastCounter = 0;

  subcategorias: Subcategoria[] = [];
  categoriasGlobales: CategoriaGlobal[] = [];

  subcategoria: Subcategoria = {
    nombre: '',
    id_categoria_global: 0
  };

  editando = false;
  mostrarDrawer = false;
  filtro = '';

  constructor(
    private subcategoriaService: SubcategoriaService,
    private categoriaService: CategoriaGlobalService
  ) { }



  mostrarToast(mensaje: string, tipo: Toast['tipo']) {
    const id = this.toastCounter++;
    const duracion = 2000;

    this.toasts.push({ id, mensaje, tipo });

    setTimeout(() => {
      this.cerrarToast(id);
    }, duracion);
  }

  cerrarToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  ngOnInit(): void {
    this.cargarSubcategorias();
    this.cargarCategoriasGlobales();
  }

  cargarSubcategorias() {
    this.subcategoriaService.listar().subscribe({
      next: (data) => this.subcategorias = [...data],
      error: (err) => {
        console.error('Error cargando subcategorías', err);
        this.mostrarToast('Error al cargar subcategorías', 'error');
      }
    });
  }

  cargarCategoriasGlobales() {
    this.categoriaService.listar().subscribe({
      next: (data) => this.categoriasGlobales = data,
      error: (err) => {
        console.error('Error cargando categorías globales', err);
        this.mostrarToast('Error al cargar categorías globales', 'error');
      }
    });
  }

  abrirDrawer() {
    this.resetFormulario();
    this.mostrarDrawer = true;
  }

  cerrarDrawer() {
    this.mostrarDrawer = false;
  }

guardar() {

  if (this.editando && this.subcategoria.id_subcategoria) {

    this.subcategoriaService
      .actualizar(this.subcategoria.id_subcategoria, this.subcategoria)
      .subscribe({
        next: () => {
          this.mostrarToast('Subcategoría actualizada correctamente', 'info');
          this.cargarSubcategorias();
          this.cerrarDrawer();
        },
        error: (err) => {
          const mensaje = err.error?.mensaje || 'Error al actualizar subcategoría';
          this.mostrarToast(mensaje, 'error');
        }
      });

  } else {

    this.subcategoriaService
      .crear(this.subcategoria)
      .subscribe({
        next: () => {
          this.mostrarToast('Subcategoría creada correctamente', 'success');
          this.cargarSubcategorias();
          this.cerrarDrawer();
        },
        error: (err) => {
          const mensaje = err.error?.mensaje || 'Error al crear subcategoría';
          this.mostrarToast(mensaje, 'error');
        }
      });

  }

}

  editar(subcategoria: Subcategoria) {
    this.subcategoria = { ...subcategoria };
    this.editando = true;
    this.mostrarDrawer = true;
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar subcategoría?')) {
      this.subcategoriaService.eliminar(id).subscribe(() => {
        this.cargarSubcategorias();
        this.mostrarToast('Subcategoría eliminada correctamente', 'warning');
      });
    }
  }

  resetFormulario() {
    this.subcategoria = {
      nombre: '',
      id_categoria_global: 0
    };
    this.editando = false;
  }

  get subcategoriasFiltradas(): Subcategoria[] {

    if (!this.filtro.trim()) return this.subcategorias;

    return this.subcategorias.filter(s =>
      s.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
      s.categoria_global_nombre?.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }




}