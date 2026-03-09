import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosComponent } from './usuarios.component';
import { UsuarioService } from '../../services/usuarios.service';
import { of, throwError } from 'rxjs';
import { Usuario } from '../../models/usuario.model';

describe('UsuariosComponent', () => {

  let component: UsuariosComponent;
  let fixture: ComponentFixture<UsuariosComponent>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;

  beforeEach(async () => {

    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', [
      'listar',
      'crear',
      'cambiarEstado'
    ]);

    await TestBed.configureTestingModule({
      imports: [UsuariosComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosComponent);
    component = fixture.componentInstance;
  });

  // ✅ 1. Inicialización del componente
  it('debe inicializar correctamente el componente de gestión de usuarios', () => {
    expect(component).toBeTruthy();
  });

  // ✅ 2. ngOnInit ejecución
  it('debe ejecutar el método cargarUsuarios al inicializar el componente (ngOnInit)', () => {
    const spy = spyOn(component, 'cargarUsuarios');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  // ✅ 3. cargarUsuarios éxito
  it('debe cargar correctamente la lista de usuarios desde el servicio', () => {

    const mockUsuarios: Usuario[] = [
      { id: 1, nombre: 'Admin', email: 'admin@test.com', rol: 'administrador', estado: 'activo', created_at: '2026-01-01' }
    ];

    usuarioServiceSpy.listar.and.returnValue(of(mockUsuarios));

    component.cargarUsuarios();

    expect(component.usuarios).toEqual(mockUsuarios);
    expect(component.error).toBe('');
  });

  // ✅ 4. cargarUsuarios error
  it('debe mostrar un mensaje de error cuando falla la carga de usuarios', () => {

    usuarioServiceSpy.listar.and.returnValue(
      throwError(() => new Error('Error'))
    );

    component.cargarUsuarios();

    expect(component.error).toBe('Error al cargar usuarios');
  });

  // ✅ 5. crearUsuario éxito
  it('debe crear correctamente un usuario y limpiar el formulario después del registro', () => {

    usuarioServiceSpy.crear.and.returnValue(of({}));
    usuarioServiceSpy.listar.and.returnValue(of([]));

    component.nombre = 'Nuevo';
    component.email = 'nuevo@test.com';
    component.password = '123456';
    component.rol = 'administrador';
    component.mostrarDrawer = true;

    component.crearUsuario();

    expect(usuarioServiceSpy.crear).toHaveBeenCalledWith({
      nombre: 'Nuevo',
      email: 'nuevo@test.com',
      password: '123456',
      rol: 'administrador'
    });

    expect(component.mensaje).toBe('Usuario creado correctamente');
    expect(component.nombre).toBe('');
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.mostrarDrawer).toBeFalse();
  });

  // ✅ 6. crearUsuario error
  it('debe mostrar un mensaje de error cuando falla la creación de un usuario', () => {

    usuarioServiceSpy.crear.and.returnValue(
      throwError(() => new Error('Error'))
    );

    component.crearUsuario();

    expect(component.error).toBe('Error al crear usuario');
  });

  // ✅ 7. cambiarEstado éxito
  it('debe cambiar correctamente el estado del usuario de activo a inactivo', () => {

    const usuario: Usuario = {
      id: 1,
      nombre: 'Admin',
      email: 'admin@test.com',
      rol: 'administrador',
      estado: 'activo',
      created_at: '2026-01-01'
    };

    usuarioServiceSpy.cambiarEstado.and.returnValue(of({}));
    usuarioServiceSpy.listar.and.returnValue(of([]));

    component.cambiarEstado(usuario);

    expect(usuarioServiceSpy.cambiarEstado)
      .toHaveBeenCalledWith(1, 'inactivo');
  });

  // ✅ 8. cambiarEstado error
  it('debe mostrar un mensaje de error cuando falla el cambio de estado del usuario', () => {

    const usuario: Usuario = {
      id: 1,
      nombre: 'Admin',
      email: 'admin@test.com',
      rol: 'administrador',
      estado: 'activo',
      created_at: '2026-01-01'
    };

    usuarioServiceSpy.cambiarEstado.and.returnValue(
      throwError(() => new Error('Error'))
    );

    component.cambiarEstado(usuario);

    expect(component.error).toBe('Error al cambiar estado');
  });

});