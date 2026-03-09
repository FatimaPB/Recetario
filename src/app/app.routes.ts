import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IngredientesComponent } from './pages/ingredientes/ingredientes.component';
import { PlatillosComponent } from './pages/platillos/platillos.component';
import { CategoriasglobalesComponent } from './pages/categoriasglobales/categoriasglobales.component';
import { LoginComponent } from './auth/login/login.component';
import { SubcategoriasComponent } from './pages/subcategorias/subcategorias.component';
import { RecetaPlatilloComponent } from './pages/receta-platillo/receta-platillo.component';
import { ConfiguracionPreciosComponent } from './pages/configuracion-precios/configuracion-precios.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';

export const routes: Routes = [

    // Ruta pública
    { path: 'login', component: LoginComponent },

    // Rutas protegidas
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'ingredientes', component: IngredientesComponent },
            { path: 'platillos', component: PlatillosComponent },
            { path: 'categorias-globales', component: CategoriasglobalesComponent },
            { path: 'subcategorias', component: SubcategoriasComponent },
            { path: 'platillos/:id/receta', component: RecetaPlatilloComponent },
            { path: 'configuracion-precios', component: ConfiguracionPreciosComponent },
            { path: 'usuarios', component: UsuariosComponent, canActivate: [roleGuard] },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

        ]
    },

    // Ruta comodín (opcional pero recomendable)
    { path: '**', redirectTo: 'dashboard' }

];
