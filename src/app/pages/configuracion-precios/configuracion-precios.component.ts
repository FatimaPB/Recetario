import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionPreciosService } from '../../services/configuracion-precios.service';
import { ConfiguracionPrecios } from '../../models/configuracion-precios.model';

interface Toast {
  id: number;
  mensaje: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
}



@Component({
  selector: 'app-configuracion-precios',
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion-precios.component.html',
  styleUrl: './configuracion-precios.component.css'
})
export class ConfiguracionPreciosComponent implements OnInit {


  toasts: Toast[] = [];
  private toastCounter = 0;


  configuracion: ConfiguracionPrecios = {
    ganancia_porcentaje: 0,
    iva_porcentaje: 0,
    servicio_porcentaje: 0
  };

  cargando = false;

  constructor(private configService: ConfiguracionPreciosService) { }


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
    this.cargarConfiguracion();
  }

  cargarConfiguracion() {
    this.configService.obtener().subscribe(data => {
      if (data) {
        this.configuracion = data;
      }
    });
  }

  guardar() {
    this.cargando = true;

    this.configService.guardar(this.configuracion)
      .subscribe(() => {
        this.cargando = false;
        this.mostrarToast('Configuración guardada correctamente', 'success');
      });
  }

}