import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SvgIconComponent} from '@shared/utils/svg.component';

@Component({
  selector: 'app-tag',
  imports: [
    SvgIconComponent
  ],
  templateUrl: './tag.html',
  standalone: true,
  styleUrl: './tag.css'
})
export class Tag {
  @Input() removable: boolean = false;
  @Output() remove = new EventEmitter<unknown>();

}
