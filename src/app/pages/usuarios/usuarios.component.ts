import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';


interface Toast {
  id: number;
  mensaje: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  toasts: Toast[] = [];
  private toastCounter = 0;


  usuarios: Usuario[] = [];

  nombre = '';
  email = '';
  password = '';
  rol: 'superadmin' | 'administrador' = 'administrador';

  mensaje = '';
  error = '';
  mostrarDrawer = false;

  constructor(private usuarioService: UsuarioService) { }



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
    this.mostrarDrawer = false;
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listar().subscribe({
      next: (data) => this.usuarios = data,
      error: () => this.mostrarToast('Error al cargar usuarios', 'error')
    });
  }

  crearUsuario() {
    this.usuarioService.crear({
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      rol: this.rol
    }).subscribe({
      next: () => {
        this.mostrarToast('Usuario creado correctamente', 'success');
        this.nombre = '';
        this.email = '';
        this.password = '';
        this.mostrarDrawer = false;
        this.cargarUsuarios();
      },
      error: () => this.mostrarToast('Error al crear usuario', 'error')    
    });
  }

  cambiarEstado(usuario: Usuario) {

    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';

    this.usuarioService.cambiarEstado(usuario.id, nuevoEstado).subscribe({

      next: () => {

        // Actualizar lista
        this.cargarUsuarios();

        // Mostrar toast según estado
        if (nuevoEstado === 'activo') {
          this.mostrarToast('Usuario activado correctamente', 'success');
        } else {
          this.mostrarToast('Usuario desactivado correctamente', 'warning');
        }

      },

      error: () => {
        this.mostrarToast('Error al cambiar el estado del usuario', 'error');
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

  private resetFormulario() {
    this.nombre = '';
    this.email = '';
    this.password = '';
    this.rol = 'administrador';
  }
}