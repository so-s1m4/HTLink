import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProjectsService } from '@core/services/projects.service';
import {ImageGallery} from '@shared/ui/image-gallery/image-gallery';
import {ProjectType} from '@core/types/types.constans';
import {Block} from '@shared/ui/block/block';
import { NgIcon } from "@ng-icons/core";
import { Icons } from '@core/types/icons.enum';

@Component({
  selector: 'app-main',
  imports: [
    ImageGallery,
    Block,
    NgIcon
],
  templateUrl: './main.html',
  standalone: true,
  styleUrl: './main.css'
})
export class Main implements OnInit {
  private projectService = inject(ProjectsService)
  Icons = Icons;
  constructor(private routes: ActivatedRoute) {}

  data: ProjectType | null = null

  ngOnInit() {
    this.routes.paramMap.subscribe(paramMap => {
      const projectId = paramMap.get('id');
      this.projectService.getProject(projectId).then((project: any) => {
        this.data = project;
      })
    })
  }
}
