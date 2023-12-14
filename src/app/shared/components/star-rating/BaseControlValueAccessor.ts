import { ControlValueAccessor } from '@angular/forms';

export class BaseControlValueAccessor<T> implements ControlValueAccessor {
  public disabled = false;

  /**
   * Call when value has changed programmatically
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onChange(newVal: T) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onTouched(_?: any) {}
  public value: T;

  /**
   * Model -> View changes
   */
  public writeValue(obj: T): void { this.value = obj; } // called on initial value, or setValue/patchValue
  public registerOnChange(fn: any): void { this.onChange = fn; }
  public registerOnTouched(fn: any): void { this.onTouched = fn; }
  public setDisabledState?(isDisabled: boolean): void { this.disabled = isDisabled; }
}
