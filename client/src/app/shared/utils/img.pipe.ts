import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'img',
})
export class ImgPipe implements PipeTransform {
  public transform(
    value: { path: string; [key: string]: any } | undefined
  ): string {
    return "";
    // if (!value) {
    //   return DEFAULT_AVATAR_URL;
    // }
    // return API_PUBLIC_URL + "/" + value.path;
  }
}
