import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from "./main/main.component";

export const appRoutes: Routes = [
    { path: '**', component: MainComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
