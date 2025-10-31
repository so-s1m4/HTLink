import { Injectable } from '@angular/core';
import {ProjectType} from '@core/types/types.constans';




@Injectable({
  providedIn: 'root'
})
export class ProjectsService {


  async getProject(id: string | null): Promise<ProjectType> {
    return {
      id: id || '1',
      title: 'Sample Project',
      description: 'This is a sample project description.',
      images: [
        { url: 'https://angular.io/assets/images/logos/angular/angular.png', size: 1024 },
        { url: 'https://angular.io/assets/images/logos/angular/angular.png', size: 2048 }
      ],
      authorId: 'author123',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [{id:"1", name:'angular'},{id:"2", name:'angular'}],
      members: [],
      likes: 42
    };
  }
}
