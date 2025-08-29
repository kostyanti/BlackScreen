import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { ContentComponent } from './pages/content/content.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'player', component: ContentComponent },
    { path: '**', component: NotFoundComponent}
];
