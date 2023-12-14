/**
 * To only allow decimal numbers in input field.
 * <input type="text" [nggtDecimalNumber] />
 */
import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[appDecimalNumber]'
})
export class DecimalNumberDirective implements OnInit {

  @Input()
  nggtDecimalNumber!: string;
  @Input()
  maxValue!: string;

  private element: HTMLInputElement;
  private mantissaCount: number = 9;
  private characteristicCount: number = 2;

  constructor(
    private elementRef: ElementRef,
    private control: NgControl) {
    this.element = this.elementRef.nativeElement;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    this.mantissaCount = parseInt(this.nggtDecimalNumber.split('.')[0], 10);
    this.characteristicCount = parseInt(this.nggtDecimalNumber.split('.')[1], 10);
  }

  @HostListener('input', ['$event.target.value']) onInputChange(value: any): void {

    let initalValue = value;

    if (this.characteristicCount > 0) {
      // get the first occurrence of number from input value
      initalValue = initalValue.match(/[\d.]+/g);
      initalValue = initalValue ? initalValue[0] : '';

      // take the count of periods
      const period = this.characteristicCount > 0 ? '.' : '';
      const periodCount = (initalValue.match(/\./g) || []).length;
      const parts = initalValue.split('.');

      parts[0] = parts[0].substring(0, this.mantissaCount);

      if (periodCount > 0) {
        parts[1] = parts[1].substring(0, this.characteristicCount);
        this.element.value = `${parts[0]}${period}${parts[1]}`;
      } else {
        this.element.value = parts[0];
      }
      let formatted: string | null = this.element.value;

      if (parseFloat(formatted) > parseFloat(this.maxValue)) {
        formatted = null;
      }

      this.control.control?.setValue(formatted);
    } else {
      let formatted = initalValue.replace(/[^0-9]*/g, '');
      formatted = formatted.substring(0, this.mantissaCount);

      if (parseFloat(formatted) > parseFloat(this.maxValue)) {
        formatted = null;
      }

      this.control.control?.setValue(formatted);
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: any): void {
    if (event.code === 'Period' && event.target.value.indexOf('.') > -1) {
      event.preventDefault();
    }

    if ([46, 8, 9, 27, 13, 110, 190].indexOf(event.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+C
      (event.keyCode === 67 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+V
      (event.keyCode === 86 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+X
      (event.keyCode === 88 && (event.ctrlKey || event.metaKey)) ||
      // Allow: home, end, left, right
      (event.keyCode >= 35 && event.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
    }
  }
}
