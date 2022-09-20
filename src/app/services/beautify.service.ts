import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BeautifyService {
  formatLong = [
    ' ',
    ' thousand',
    ' million',
    ' billion',
    ' trillion',
    ' quadrillion',
    ' quintillion',
    ' sextillion',
    ' septillion',
    ' octillion',
    ' nonillion'
  ];

  formatShort = [
    '',
    'k',
    'm',
    'b',
    't',
    'qa',
    'qi',
    'sx',
    'sp',
    'oc',
    'no'
  ];

  beautify(value: number, formatShort: boolean = false, cutShort: number = 0): string {
    if (!isFinite(value)) {
      return 'Infinity';
    }
    var notations = formatShort ? this.formatShort : this.formatLong;

    if(cutShort != 0 && value.toString().length > cutShort){
      var difference = Math.pow(10, value.toString().length - cutShort);
      value = Math.floor(value / difference) * difference;
    }

    var base = 0;
    while (Math.floor(value) >= 1000) {
      value /= 1000;
      base++;
    }
    if (base >= notations.length) {
      return 'Infinity';
    }

    return (Math.floor(value * 1000) / 1000) + notations[base];
  }

  constructor() {
  }
}