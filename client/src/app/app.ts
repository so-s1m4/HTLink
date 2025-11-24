import {Component, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AppUpdateService} from '@core/services/app-update.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {
  constructor(private UpdateService: AppUpdateService) {
  }
  protected readonly title = signal('HTLink');
}
