import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientesComponent } from './ingredientes.component';
import { IngredienteService } from '../../services/ingrediente.service';
import { of } from 'rxjs';
import { Ingrediente } from '../../models/ingrediente.model';

describe('IngredientesComponent', () => {

  let component: IngredientesComponent;
  let fixture: ComponentFixture<IngredientesComponent>;
  let ingredienteServiceSpy: jasmine.SpyObj<IngredienteService>;

  beforeEach(async () => {

    ingredienteServiceSpy = jasmine.createSpyObj('IngredienteService', [
      'obtenerTodos',
      'crear',
      'actualizar',
      'eliminar'
    ]);

    await TestBed.configureTestingModule({
      imports: [IngredientesComponent],
      providers: [
        { provide: IngredienteService, useValue: ingredienteServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientesComponent);
    component = fixture.componentInstance;
  });

  // ✅ 1. Inicialización del componente
  it('debe inicializar correctamente el componente de gestión de ingredientes', () => {
    expect(component).toBeTruthy();
  });

  // ✅ 2. Ejecución de ngOnInit
  it('debe ejecutar el método cargarIngredientes al inicializar el componente (ngOnInit)', () => {
    const spy = spyOn(component, 'cargarIngredientes');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  // ✅ 3. Carga de ingredientes
  it('debe cargar correctamente la lista de ingredientes desde el servicio', () => {

    const mock: Ingrediente[] = [
      {
        id_ingrediente: 1,
        nombre: 'Azúcar',
        unidad_base: 'kg',
        costo_presentacion: 20,
        cantidad_presentacion: 1
      }
    ];

    ingredienteServiceSpy.obtenerTodos.and.returnValue(of(mock));

    component.cargarIngredientes();

    expect(component.ingredientes.length).toBe(1);
    expect(component.ingredientes[0].nombre).toBe('Azúcar');
  });

  // ✅ 4. Creación de ingrediente
  it('debe crear un nuevo ingrediente cuando no se encuentra en modo edición', () => {

    componentePreparado();

    ingredienteServiceSpy.crear.and.returnValue(of({}));
    ingredienteServiceSpy.obtenerTodos.and.returnValue(of([]));

    component.editando = false;

    component.guardar();

    expect(ingredienteServiceSpy.crear)
      .toHaveBeenCalledWith(component.ingrediente);
  });

  // ✅ 5. Actualización de ingrediente
  it('debe actualizar un ingrediente cuando se encuentra en modo edición', () => {

    componentePreparado();

    component.editando = true;
    component.ingrediente.id_ingrediente = 1;

    ingredienteServiceSpy.actualizar.and.returnValue(of({}));
    ingredienteServiceSpy.obtenerTodos.and.returnValue(of([]));

    component.guardar();

    expect(ingredienteServiceSpy.actualizar)
      .toHaveBeenCalledWith(1, component.ingrediente);
  });

  // ✅ 6. Activación del modo edición
  it('debe activar correctamente el modo de edición al seleccionar un ingrediente', () => {

    const ingrediente: Ingrediente = {
      id_ingrediente: 1,
      nombre: 'Sal',
      unidad_base: 'kg',
      costo_presentacion: 15,
      cantidad_presentacion: 1
    };

    component.editar(ingrediente);

    expect(component.editando).toBeTrue();
    expect(component.mostrarDrawer).toBeTrue();
    expect(component.ingrediente.nombre).toBe('Sal');
  });

  // ✅ 7. Eliminación de ingrediente
  it('debe eliminar un ingrediente cuando la confirmación del usuario es aceptada', () => {

    spyOn(window, 'confirm').and.returnValue(true);

    ingredienteServiceSpy.eliminar.and.returnValue(of({}));
    ingredienteServiceSpy.obtenerTodos.and.returnValue(of([]));

    component.eliminar(1);

    expect(ingredienteServiceSpy.eliminar).toHaveBeenCalledWith(1);
  });

  // ✅ 8. Filtrado de ingredientes
  it('debe filtrar correctamente los ingredientes por nombre', () => {

    component.ingredientes = [
      {
        id_ingrediente: 1,
        nombre: 'Azucar',
        unidad_base: 'kg',
        costo_presentacion: 20,
        cantidad_presentacion: 1
      },
      {
        id_ingrediente: 2,
        nombre: 'Sal',
        unidad_base: 'kg',
        costo_presentacion: 10,
        cantidad_presentacion: 1
      }
    ];

    component.filtro = 'azu';

    const resultado = component.ingredientesFiltrados;

    expect(resultado.length).toBe(1);
    expect(resultado[0].nombre).toBe('Azucar');
  });

  // 🔹 Helper
  function componentePreparado() {
    component.ingrediente = {
      nombre: 'Test',
      unidad_base: 'kg',
      costo_presentacion: 10,
      cantidad_presentacion: 1
    };
  }

});