import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/tasks/pages/tasks-page/tasks-page').then((page) => page.TasksPage),
  },
  { path: '**', redirectTo: '' },
];
