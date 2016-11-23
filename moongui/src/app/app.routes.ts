import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from "./main/main.component";
import {HistoryListComponent} from "./history/history-list/history-list.component";


export const appRoutes: Routes = [
    { path: 'history', component: HistoryListComponent},
    { path: '**', component: MainComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
