import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'guardarSesion']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ✅ 1. Inicialización del componente
  it('debe inicializar correctamente el componente de autenticación', () => {
    expect(component).toBeTruthy();
  });

  // ✅ 2. Invocación del servicio de autenticación
  it('debe invocar el servicio de autenticación con las credenciales proporcionadas', () => {

    component.email = 'admin@hotel.com';
    component.password = '123456';

    authServiceSpy.login.and.returnValue(of({}));

    component.iniciarSesion();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'admin@hotel.com',
      password: '123456'
    });
  });

  // ✅ 3. Inicio de sesión exitoso
  it('debe almacenar la sesión y redirigir al panel principal cuando el inicio de sesión es exitoso', () => {

    const mockResponse = {
      token: 'fake-token',
      usuario: { id: 1, nombre: 'Admin', rol: 'ADMIN' }
    };

    component.email = 'admin@hotel.com';
    component.password = '123456';

    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.iniciarSesion();

    expect(authServiceSpy.guardarSesion).toHaveBeenCalledWith(mockResponse);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  // ✅ 4. Manejo de error en autenticación
  it('debe mostrar un mensaje de error cuando el proceso de autenticación falla', () => {

    component.email = 'admin@hotel.com';
    component.password = 'incorrecta';

    authServiceSpy.login.and.returnValue(
      throwError(() => new Error('Error'))
    );

    component.iniciarSesion();

    expect(component.error).toBe('Correo o contraseña incorrectos');
  });

});