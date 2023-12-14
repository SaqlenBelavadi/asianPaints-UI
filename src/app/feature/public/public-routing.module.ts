import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PublicComponent } from './public.component';

const routes: Routes = [
    {
        path: '',
        component: PublicComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: '',
                redirectTo: 'login', pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: 'login', pathMatch: 'full'
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PublicRoutingModule { }
