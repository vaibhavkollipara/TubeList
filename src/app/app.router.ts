import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { MyplaylistsComponent } from './myplaylists/myplaylists.component';
import { DetailComponent } from './detail/detail.component';
import { MyplaylistdetailComponent } from './myplaylistdetail/myplaylistdetail.component';
import { AuthGuard } from './guards/auth.guard';

export const router: Routes = [
    {path : '', redirectTo : 'dashboard', pathMatch : 'full' },
    {path : 'authenticate', component : AuthenticationComponent},
    {path : 'dashboard', component : DashboardComponent, canActivate : [AuthGuard],
        children :[
            {path: '', component : HomeComponent},
            {path: 'detail/:id', component : DetailComponent},
            {path : 'myplaylists', component : MyplaylistsComponent},
            {path : 'myplaylistdetail/:id' , component : MyplaylistdetailComponent}
        ]},
];


export const routes : ModuleWithProviders = RouterModule.forRoot(router);
