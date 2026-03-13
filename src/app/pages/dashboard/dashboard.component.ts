import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  totalPlatillos = 0;
  totalIngredientes = 0;
  totalCategorias = 0;
  totalSubcategorias = 0;
  totalUsuarios = 0;

  ultimosPlatillos: any[] = [];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {

    /* =========================
       ESTADÍSTICAS
    ========================= */
    this.dashboardService.getEstadisticas().subscribe({
      next: (data) => {
        this.totalPlatillos = data.platillos;
        this.totalIngredientes = data.ingredientes;
        this.totalCategorias = data.categorias;
        this.totalSubcategorias = data.subcategorias;
        this.totalUsuarios = data.usuarios;
      }
    });


    /* =========================
       ÚLTIMOS PLATILLOS
    ========================= */
    this.dashboardService.getUltimosPlatillos().subscribe({
      next: (data) => {
        this.ultimosPlatillos = data;
      }
    });
  }

}
