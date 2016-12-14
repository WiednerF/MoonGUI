import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from "./main/main.component";

export const appRoutes: Routes = [
    { path: '**', component: MainComponent }//The only used path, Routes are used for the possibility to extend the software
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
