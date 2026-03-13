import { Component, OnInit } from '@angular/core';
import { Ingrediente } from '../../models/ingrediente.model';
import { IngredienteService } from '../../services/ingrediente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


interface Toast {
  id: number;
  mensaje: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
}


@Component({
  selector: 'app-ingredientes',
  imports: [FormsModule, CommonModule],
  templateUrl: './ingredientes.component.html',
  styleUrl: './ingredientes.component.css'
})
export class IngredientesComponent implements OnInit {


  toasts: Toast[] = [];
  private toastCounter = 0;


  ingredientes: Ingrediente[] = [];

  ingrediente: Ingrediente = {
    nombre: '',
    unidad_base: '',
    costo_presentacion: 0,
    cantidad_presentacion: 0
  };

  editando = false;
  mostrarDrawer: boolean = false;

  filtro = '';
  menuAbierto: number | null = null;

  constructor(private ingredienteService: IngredienteService) { }

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
    console.log('mostrarDrawer al iniciar:', this.mostrarDrawer);
    this.cargarIngredientes();
  }

  cargarIngredientes() {
    this.ingredienteService.obtenerTodos().subscribe({
      next: (data) => {
        this.ingredientes = [...data];
      },
      error: (err) => {
        console.error('Error cargando ingredientes', err);
      }
    });
  }

  abrirDrawer() {
    this.resetFormulario();
    this.mostrarDrawer = true;
  }

  cerrarDrawer() {
    this.mostrarDrawer = false;
    this.resetFormulario(); // opcional pero recomendable
  }

  guardar() {

    if (this.editando && this.ingrediente.id_ingrediente) {

      this.ingredienteService
        .actualizar(this.ingrediente.id_ingrediente, this.ingrediente)
        .subscribe({
          next: () => {
            this.mostrarToast('Ingrediente actualizado correctamente', 'info');
            this.cargarIngredientes();
            this.cerrarDrawer();
          },
          error: (err) => {
            const mensaje = err.error?.mensaje || 'Error al actualizar ingrediente';
            this.mostrarToast(mensaje, 'error');
          }
        });

    } else {

      this.ingredienteService
        .crear(this.ingrediente)
        .subscribe({
          next: () => {
            this.mostrarToast('Ingrediente creado correctamente', 'success');
            this.cargarIngredientes();
            this.cerrarDrawer();
          },
          error: (err) => {
            const mensaje = err.error?.mensaje || 'Error al crear ingrediente';
            this.mostrarToast(mensaje, 'error');
          }
        });

    }

  }

  editar(ingrediente: Ingrediente) {
    this.ingrediente = { ...ingrediente };
    this.editando = true;
    this.mostrarDrawer = true;
    this.cerrarMenu();
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar ingrediente?')) {
      this.ingredienteService.eliminar(id).subscribe(() => {
        this.mostrarToast('Ingrediente eliminado correctamente', 'warning');
        this.cargarIngredientes();
      });
    }
  }

  resetFormulario() {
    this.ingrediente = {
      nombre: '',
      unidad_base: '',
      costo_presentacion: 0,
      cantidad_presentacion: 0
    };
    this.editando = false;
  }

  toggleMenu(id: number) {
    this.menuAbierto = this.menuAbierto === id ? null : id;
  }

  cerrarMenu() {
    this.menuAbierto = null;
  }

  get ingredientesFiltrados(): Ingrediente[] {
    if (!this.filtro.trim()) return this.ingredientes;

    return this.ingredientes.filter(i =>
      i.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

}