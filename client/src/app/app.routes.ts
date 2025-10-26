import { Routes } from '@angular/router';
import {Layout} from '@app/features/layout/layout';
import {Profile} from '@app/features/profile/profile';
import {Projects} from '@app/features/projects/projects';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: "projects",
        component: Projects
      },
      {
        path: "profile/:id",
        component: Profile
      }
    ]
  }
];
