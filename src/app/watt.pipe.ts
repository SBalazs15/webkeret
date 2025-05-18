import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'watt'
})
export class Watt implements PipeTransform {

  transform(value: number): string {
    if (value == null) {
      return '';
    }
    return `${value} W`;
  }

}
