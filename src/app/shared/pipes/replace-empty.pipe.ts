import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceEmpty'
})
export class ReplaceEmptyPipe implements PipeTransform {

  transform(value: string, replacementStr: string): string {
    if (!value) {
      return replacementStr ? replacementStr : '--';
    }
    return value;
  }
}
