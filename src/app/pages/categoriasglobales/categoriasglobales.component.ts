import { Component, OnInit } from '@angular/core';
import { CategoriaGlobal } from '../../models/categoria-global.model';
import { CategoriaGlobalService } from '../../services/categoria-global.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


interface Toast {
  id: number;
  mensaje: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
}




@Component({
  selector: 'app-categoriasglobales',
  imports: [FormsModule, CommonModule],
  templateUrl: './categoriasglobales.component.html',
  styleUrl: './categoriasglobales.component.css'
})
export class CategoriasglobalesComponent {


  toasts: Toast[] = [];
  private toastCounter = 0;
  categorias: CategoriaGlobal[] = [];

  categoria: CategoriaGlobal = {
    nombre: ''
  };

  editando = false;
  mostrarDrawer = false;

  filtro = '';

  constructor(private categoriaService: CategoriaGlobalService) { }


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
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaService.listar().subscribe({
      next: (data) => {
        this.categorias = [...data];
      },
      error: (err) => {
        this.mostrarToast('Error al cargar categorías globales', 'error');
        console.error('Error cargando categorías', err);
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

  if (this.editando && this.categoria.id_categoria_global) {

    this.categoriaService
      .actualizar(this.categoria.id_categoria_global, this.categoria)
      .subscribe({
        next: () => {
          this.mostrarToast('Categoría global actualizada correctamente', 'info');
          this.cargarCategorias();
          this.cerrarDrawer();
        },
        error: (err) => {
          const mensaje = err.error?.mensaje || 'Error al actualizar categoría';
          this.mostrarToast(mensaje, 'error');
        }
      });

  } else {

    this.categoriaService
      .crear(this.categoria)
      .subscribe({
        next: () => {
          this.mostrarToast('Categoría global creada correctamente', 'success');
          this.cargarCategorias();
          this.cerrarDrawer();
        },
        error: (err) => {
          const mensaje = err.error?.mensaje || 'Error al crear categoría';
          this.mostrarToast(mensaje, 'error');
        }
      });

  }

}


  editar(categoria: CategoriaGlobal) {
    this.categoria = { ...categoria };
    this.editando = true;
    this.mostrarDrawer = true;
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar categoría global?')) {
      this.categoriaService.eliminar(id).subscribe(() => {
        this.cargarCategorias();
        this.mostrarToast('Categoría global eliminada correctamente', 'warning');
      });
    }
  }

  resetFormulario() {
    this.categoria = {
      nombre: ''
    };
    this.editando = false;
  }

  get categoriasFiltradas(): CategoriaGlobal[] {

    if (!this.filtro.trim()) return this.categorias;

    return this.categorias.filter(c =>
      c.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

}
