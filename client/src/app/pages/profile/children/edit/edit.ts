import { Component } from '@angular/core';
import {SvgIconComponent} from '@shared/utils/svg.component';
import {Block} from '@shared/ui/block/block';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-edit',
  imports: [
    SvgIconComponent,
    Block,
    RouterLink
  ],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class Edit {

}
