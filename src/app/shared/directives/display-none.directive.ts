/**
 * To make the element style display=none.
 * <div nggtDisplayNone="false"><div />
 */
import { AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[appDisplayNone]'
})
export class DisplayNoneDirective implements OnChanges, AfterViewInit {

    /* Public Properties */
    isHidden: boolean = false;

    constructor(
        private el: ElementRef
    ) { }

    @Input() set nggtDisplayNone(isHidden: boolean) {
        this.isHidden = isHidden;
    }

    /* Life Cycle Hooks */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ngOnChanges(changes: SimpleChanges): void { this.setVisibility(); }

    ngAfterViewInit(): void { this.setVisibility(); }

    /* Private Methods */
    private setVisibility(): void {
        if (this.el && this.el.nativeElement && this.el.nativeElement.style) {
            if (this.isHidden) {
                this.el.nativeElement.style.display = 'none';
            } else {
                this.el.nativeElement.style.display = 'block';
            }
        }
    }
}
