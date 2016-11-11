import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from "./main/main.component";


export const appRoutes: Routes = [

    // TODO Add all other routes and add for each class a different handler service
    { path: '**', component: MainComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
