import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

 totalPlatillos = 0;
  totalIngredientes = 0;
  totalRecetas = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getEstadisticas().subscribe({
      next: (data) => {
        this.totalPlatillos = data.platillos;
        this.totalIngredientes = data.ingredientes;
        this.totalRecetas = data.recetas;
      }
    });
  }
}