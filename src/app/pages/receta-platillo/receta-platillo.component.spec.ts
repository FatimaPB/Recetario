import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecetaPlatilloComponent } from './receta-platillo.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RecetaService } from '../../services/receta.service';
import { IngredienteService } from '../../services/ingrediente.service';
import { UnidadService } from '../../services/unidad.service';
import { PlatilloService } from '../../services/platillo.service';
import { ComponenteService } from '../../services/componente.service';

describe('RecetaPlatilloComponent - Gestión de receta y cálculo de costos', () => {

  let component: RecetaPlatilloComponent;
  let fixture: ComponentFixture<RecetaPlatilloComponent>;

  let recetaSpy: jasmine.SpyObj<RecetaService>;
  let ingredienteSpy: jasmine.SpyObj<IngredienteService>;
  let unidadSpy: jasmine.SpyObj<UnidadService>;
  let platilloSpy: jasmine.SpyObj<PlatilloService>;
  let componenteSpy: jasmine.SpyObj<ComponenteService>;

  beforeEach(async () => {

    recetaSpy = jasmine.createSpyObj('RecetaService', ['listarPorPlatillo', 'crear', 'eliminar']);
    ingredienteSpy = jasmine.createSpyObj('IngredienteService', ['obtenerTodos']);
    unidadSpy = jasmine.createSpyObj('UnidadService', ['obtenerTodas']);
    platilloSpy = jasmine.createSpyObj('PlatilloService', ['obtenerPorId', 'obtenerTodos']);
    componenteSpy = jasmine.createSpyObj('ComponenteService', ['listarPorPlatillo', 'crear', 'eliminar']);

    await TestBed.configureTestingModule({
      imports: [RecetaPlatilloComponent],
      providers: [
        { provide: RecetaService, useValue: recetaSpy },
        { provide: IngredienteService, useValue: ingredienteSpy },
        { provide: UnidadService, useValue: unidadSpy },
        { provide: PlatilloService, useValue: platilloSpy },
        { provide: ComponenteService, useValue: componenteSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecetaPlatilloComponent);
    component = fixture.componentInstance;
  });

  // ======================================================
  // PRUEBA 1: Inicialización del componente
  // ======================================================

  it('debe inicializar correctamente el componente de gestión de recetas', () => {
    expect(component).toBeTruthy();
  });

  // ======================================================
  // PRUEBA 2: Obtención de id desde la ruta
  // ======================================================

  it('debe obtener correctamente el identificador del platillo desde la ruta activa', () => {

    recetaSpy.listarPorPlatillo.and.returnValue(of([]));
    ingredienteSpy.obtenerTodos.and.returnValue(of([]));
    unidadSpy.obtenerTodas.and.returnValue(of([]));
    platilloSpy.obtenerTodos.and.returnValue(of([]));
    componenteSpy.listarPorPlatillo.and.returnValue(of([]));

    platilloSpy.obtenerPorId.and.returnValue(
      of({
        id_platillo: 1,
        nombre: 'Test',
        descripcion: '',
        imagen: '',
        id_subcategoria: 1,
        costo_total: 0,
        precio_venta: 0
      })
    );

    component.ngOnInit();

    expect(component.idPlatillo).toBe(1);
  });

  // ======================================================
  // PRUEBA 3: Cálculo de margen
  // ======================================================

  it('debe calcular correctamente el porcentaje de margen con base en costo y precio', () => {

    component.costoActual = 100;
    component.precioActual = 150;

    expect(component.margenPorcentaje).toBe(50);
  });

  // ======================================================
  // PRUEBA 4: Unificación de elementos
  // ======================================================

  it('debe unificar correctamente ingredientes y platillos dentro de la estructura itemsUnificados', () => {

    component.recetas = [
      {
        id_receta: 1,
        ingrediente_nombre: 'Azúcar',
        costo_unitario: 10,
        cantidad_receta: 2,
        unidad_usada: 'kg',
        costo_en_receta: 20
      } as any
    ];

    component.componentes = [
      {
        id_componente: 5,
        platillo_hijo_nombre: 'Salsa',
        costo_total: 30,
        cantidad: 1,
        costo_en_combo: 30
      } as any
    ];

    const items = component.itemsUnificados;

    expect(items.length).toBe(2);
    expect(items[0].tipo).toBe('ingrediente');
    expect(items[1].tipo).toBe('platillo');
  });

});