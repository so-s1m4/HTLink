import { Pipe, PipeTransform } from '@angular/core';
import {API_URL,DEFAULT_AVATAR_URL} from '@core/eviroments/config.constants';

@Pipe({
  name: 'img',
  standalone: true
})
export class ImgPipe implements PipeTransform {
  public static transform(
    value: string
  ): string {
    if (!value) {
      return DEFAULT_AVATAR_URL;
    }
    return "/public/" + value;
  }

  public transform(
    value: string
  ): string {
    return ImgPipe.transform(value);
  }
}
