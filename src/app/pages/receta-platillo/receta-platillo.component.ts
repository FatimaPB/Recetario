import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Receta } from '../../models/receta.model';
import { RecetaService } from '../../services/receta.service';
import { Ingrediente } from '../../models/ingrediente.model';
import { IngredienteService } from '../../services/ingrediente.service';
import { UnidadService, Unidad } from '../../services/unidad.service';
import { PlatilloService } from '../../services/platillo.service';
import { ComponenteService, Componente } from '../../services/componente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-receta-platillo',
  imports: [FormsModule, CommonModule],
  templateUrl: './receta-platillo.component.html',
  styleUrl: './receta-platillo.component.css'
})
export class RecetaPlatilloComponent implements OnInit {

  idPlatillo!: number;
  nombrePlatillo: string = '';

  tipoSeleccionado: 'ingrediente' | 'platillo' = 'ingrediente';


  recetas: Receta[] = [];
  ingredientes: Ingrediente[] = [];
  unidades: Unidad[] = [];

  receta: Receta = {
    id_platillo: 0,
    id_ingrediente: 0,
    cantidad: 0,
    id_unidad: 0
  };

  componentes: Componente[] = [];
  platillos: any[] = [];

  componente: Componente = {
    id_platillo_padre: 0,
    id_platillo_hijo: 0,
    cantidad: 1
  };

  costoActual: number = 0;
  precioActual: number = 0;

  constructor(
    private route: ActivatedRoute,
    private recetaService: RecetaService,
    private ingredienteService: IngredienteService,
    private platilloService: PlatilloService,
    private unidadService: UnidadService,
    private componenteService: ComponenteService
  ) { }

  ngOnInit(): void {
    this.idPlatillo = Number(this.route.snapshot.paramMap.get('id'));
    this.receta.id_platillo = this.idPlatillo;

    this.cargarTodo();
  }

  cargarUnidades() {
    this.unidadService.obtenerTodas()
      .subscribe(data => {
        this.unidades = data;
      });
  }
  
  cargarPlatillos() {
    this.platilloService.obtenerTodos()
      .subscribe(data => {
        this.platillos = data.filter(p => p.id_platillo !== this.idPlatillo);
      });
  }

  cargarComponentes() {
    this.componenteService.listarPorPlatillo(this.idPlatillo)
      .subscribe(data => this.componentes = data);
  }



  cargarTodo() {
    this.cargarPlatillo();
    this.cargarReceta();
    this.cargarIngredientes();
    this.cargarUnidades();
    this.cargarPlatillos();      // 🔥 nuevo
    this.cargarComponentes();    // 🔥 nuevo
  }

  cargarPlatillo() {
    this.platilloService.obtenerPorId(this.idPlatillo)
      .subscribe(data => {
        this.nombrePlatillo = data.nombre;
        this.costoActual = data.costo_total || 0;
        this.precioActual = data.precio_venta || 0;
      });
  }

  cargarReceta() {
    this.recetaService.listarPorPlatillo(this.idPlatillo)
      .subscribe(data => this.recetas = data);
  }

  cargarIngredientes() {
    this.ingredienteService.obtenerTodos()
      .subscribe(data => this.ingredientes = data);
  }


  agregar() {
    if (!this.receta.id_ingrediente ||
      !this.receta.cantidad ||
      !this.receta.id_unidad) return;

    this.recetaService.crear(this.receta)
      .subscribe(() => {
        this.cargarReceta();
        this.cargarPlatillo();
        this.resetFormulario();
      });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar ingrediente de la receta?')) {
      this.recetaService.eliminar(id)
        .subscribe(() => {
          this.cargarReceta();
          this.cargarPlatillo(); // 🔥 recalcula automático
        });
    }
  }

  get margenPorcentaje(): number {
    if (!this.costoActual) return 0;
    return ((this.precioActual - this.costoActual) / this.costoActual) * 100;
  }

  resetFormulario() {
    this.receta = {
      id_platillo: this.idPlatillo,
      id_ingrediente: 0,
      cantidad: 0,
      id_unidad: 0
    };
  }

  agregarComponente() {
    if (!this.componente.id_platillo_hijo || !this.componente.cantidad) return;

    this.componente.id_platillo_padre = this.idPlatillo;

    this.componenteService.crear(this.componente)
      .subscribe(() => {
        this.cargarComponentes();
        this.cargarPlatillo(); // recalcula costo y precio
        this.resetComponente();
      });
  }

  eliminarComponente(id: number) {
    if (confirm('¿Eliminar componente del combo?')) {
      this.componenteService.eliminar(id)
        .subscribe(() => {
          this.cargarComponentes();
          this.cargarPlatillo();
        });
    }
  }
  resetComponente() {
    this.componente = {
      id_platillo_padre: this.idPlatillo,
      id_platillo_hijo: 0,
      cantidad: 1
    };
  }
  get itemsUnificados() {

    const ingredientes = this.recetas.map(r => ({
      tipo: 'ingrediente' as const,
      nombre: r.ingrediente_nombre ?? '',
      costo_unitario: r.costo_unitario ?? 0,
      cantidad: r.cantidad_receta ?? 0,
      unidad: r.unidad_usada ?? '',
      costo_total: r.costo_en_receta ?? 0,
      id: r.id_receta ?? 0
    }));

    const platillos = this.componentes.map(c => ({
      tipo: 'platillo' as const,
      nombre: c.platillo_hijo_nombre ?? '',
      costo_unitario: c.costo_total ?? 0,
      cantidad: c.cantidad ?? 0,
      unidad: '',
      costo_total: c.costo_en_combo ?? 0,
      id: c.id_componente ?? 0
    }));

    // 🔥 Ordena: ingredientes primero
    return [...ingredientes, ...platillos];
  }



}