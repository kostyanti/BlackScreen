import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { ContentComponent } from './pages/content/content.component';

export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: ':id', component: ContentComponent },
];
