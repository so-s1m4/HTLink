// app-update.service.ts
import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  constructor(private updates: SwUpdate) {
    this.updates.versionUpdates.subscribe(event => {
      if (event.type === 'VERSION_READY') {
        console.log('Новая версия доступна. Перезагружаю...');
        document.location.reload();
      }
    });
  }
}
