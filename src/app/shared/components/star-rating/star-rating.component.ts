import {
  Component, AfterViewInit, Input, forwardRef,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { BaseControlValueAccessor } from './BaseControlValueAccessor';
import { NG_VALUE_ACCESSOR, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true,
    },
  ],
})
export class StarRatingComponent extends BaseControlValueAccessor<any> implements AfterViewInit {

  @Input() stars = [0, 1, 2, 3, 4]; // default is 5 stars
  @Input() messages: Array<string>; // optional text descriptors for each rating value
  @Input() label: string; // optional Label
  @Input() override value: any; // un-touched value should be null
  displayText: string;
  override disabled: boolean;
  constructor(
    private fb: FormBuilder,
    private eRef: ElementRef,
    private renderer: Renderer2
  ) {
    super();
  }
  override writeValue(val: any) {
    this.value = val;
    super.writeValue(this.value);
  }

  setRating(rating: any) {
    if (this.disabled) {
      return;
    }
    // stars & messages arrays are 0 based
    let oldVal = rating;
    this.value = oldVal + 1;

    // set the value for the control
    this.onChange(this.value);
    this.onTouched();

    // SVG STAR & DOM STUFF
    const svgs = this.eRef.nativeElement.querySelectorAll('svg.star');

    for (let i = 0, j = svgs.length; i < j; i++) {
      if (i <= rating) {
        this.renderer.addClass(svgs[i], 'active');
      } else {
        this.renderer.removeClass(svgs[i], 'active');
      }
    }
  }

  // if there's a value on init we need to apply it to the stars programatically
  // eRef has no DOM on init. We need to work with our view within AfterViewInit
  ngAfterViewInit() {
    if (this.value !== null) {
      let initialValue = this.value;
      this.setRating(--initialValue);
    }
  }

}
