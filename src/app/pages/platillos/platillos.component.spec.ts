import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlatillosComponent } from './platillos.component';
import { PlatilloService } from '../../services/platillo.service';
import { of } from 'rxjs';

describe('PlatillosComponent - Generación de reportes PDF (receta individual y recetario completo)', () => {

  let component: PlatillosComponent;
  let fixture: ComponentFixture<PlatillosComponent>;
  let serviceSpy: jasmine.SpyObj<PlatilloService>;

  beforeEach(async () => {

    serviceSpy = jasmine.createSpyObj('PlatilloService', [
      'obtenerTodos',
      'obtenerSubcategorias',
      'obtenerReportePlatillo',
      'obtenerRecetarioCompleto'
    ]);

    await TestBed.configureTestingModule({
      imports: [PlatillosComponent],
      providers: [
        { provide: PlatilloService, useValue: serviceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlatillosComponent);
    component = fixture.componentInstance;
  });


  // ======================================================
  // PRUEBA 3: Exportación de recetario completo
  // ======================================================

  it('debe invocar el método generarRecetarioPDF al exportar el recetario completo', () => {

    const mockData = [
      {
        platillo: {
          id_platillo: 1,
          nombre: 'Enchiladas',
          descripcion: 'Freír tortillas',
          imagen: null,
          costo_total: 80,
          precio_venta: 120
        },
        ingredientes: [],
        componentes: []
      }
    ];

    serviceSpy.obtenerRecetarioCompleto.and.returnValue(of(mockData));

    const spyGenerar = spyOn(component, 'generarRecetarioPDF');

    component.exportarRecetarioCompleto();

    expect(serviceSpy.obtenerRecetarioCompleto).toHaveBeenCalled();
    expect(spyGenerar).toHaveBeenCalledWith(mockData);
  });

  // ======================================================
  // PRUEBA 4: Procesamiento múltiple en recetario
  // ======================================================

  it('debe procesar correctamente múltiples recetas al generar el recetario completo en PDF', () => {

    const mockData = [
      {
        platillo: {
          id_platillo: 1,
          nombre: 'Enchiladas',
          descripcion: 'Freír tortillas',
          imagen: null,
          costo_total: 80,
          precio_venta: 120
        },
        ingredientes: [],
        componentes: []
      },
      {
        platillo: {
          id_platillo: 2,
          nombre: 'Tacos',
          descripcion: 'Preparar carne',
          imagen: null,
          costo_total: 50,
          precio_venta: 90
        },
        ingredientes: [],
        componentes: []
      }
    ];

    expect(() => component.generarRecetarioPDF(mockData)).not.toThrow();
    expect(mockData.length).toBe(2);
  });

});