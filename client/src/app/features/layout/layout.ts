import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {SvgIconComponent} from '@shared/utils/svg.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    SvgIconComponent,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  standalone: true
})
export class Layout {

  readonly pages = [
    { label: 'Feed', path: '/feed', icon: 'home' },
    { label: 'Projects', path: '/projects', icon: 'projects' },
    { label: 'Marketplace', path: '/marketplace', icon: 'marketplace' },
    { label: 'News', path: '/news', icon: 'news' },
    { label: 'Profile', path: '/profile/me', icon: 'profile' }
  ];

  isActive(path: string) {
    return window.location.href.includes(path);
  }
}
