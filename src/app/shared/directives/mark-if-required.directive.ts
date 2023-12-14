/**
 * To add required symbol to form control label.
 * <input type="text" nggtMarkIfRequired="firstName" />
 */
import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

@Directive({
  selector: '[apptMarkIfRequired]',
})
export class MarkIfRequiredDirective implements AfterViewInit {

  @Input() famsMarkIfRequired: string = '';

  private readonly requiredText = '&nbsp;<span style="color:red">*</span>';

  constructor(
    private ngControl: NgControl,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngAfterViewInit() {
    const required = this.hasRequiredValidator(this.ngControl.control);
    if (required) {
      this.addRequiredSymbol();
    }
  }

  private hasRequiredValidator(control: AbstractControl | null): boolean {
    if (control?.validator) {
      const validator = control.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    return false;
  }

  private addRequiredSymbol(): void {

    let isLabelAvailable = false;
    let hasSymbol = false;

    if (this.famsMarkIfRequired === '') {
      const parent = this.renderer.parentNode(this.el.nativeElement);
      isLabelAvailable = parent.getElementsByTagName('LABEL').length > 0;

      if (isLabelAvailable) {
        const innerHTML = parent.getElementsByTagName('LABEL')[0].innerHTML as string;
        hasSymbol = innerHTML.includes(this.requiredText);
      }

      if (isLabelAvailable && !hasSymbol) {
        parent.getElementsByTagName('LABEL')[0].innerHTML += this.requiredText;
      }
    }
    else {
      const label = document.getElementById(this.famsMarkIfRequired);
      if (label) {
        hasSymbol = label.innerHTML.includes(this.requiredText);
        if (!hasSymbol) {
          label.innerHTML = label.innerHTML += this.requiredText;
        }
      }
    }
  }
}
