import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { AppFilterService } from '@core/services/app-filter.service';
import { LocalService } from '@core/services/local-storage.service';
import { Roles } from '@shared/enums';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-multi-select-search',
  templateUrl: './multi-select-search.component.html',
  styleUrls: ['./multi-select-search.component.scss'],
})
export class MultiSelectSearchComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() options: any;
  @Input() optionsCache: any;
  @Input() label: any;
  @Input() filterName: any;
  @Input() isMultiSelect: any;
  @Output() selectedLocation = new EventEmitter<any[]>();

  /** control for the selected select for multi-selection */
  public selectMultiCtrl: FormControl = new FormControl();
  multiCtrlSet = new Set();

  /** control for the MatSelect filter keyword multi-selection */
  public selectMultiFilterCtrl: FormControl = new FormControl();

  /** list of select filtered by search keyword */
  public filteredSelectMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  @ViewChild('multiSelect') multiSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  defaultLocation: any;
  role: any;

  constructor(
    private filterService: AppFilterService,
    private storageService: LocalService
  ) {
    this.defaultLocation = this.storageService.getData('d-loc');
    this.role = this.storageService.getData('Role');
  }

  async ngOnInit() {
    if (this.filterName === 'location') {
      if (this.checkLocationFilter()) {
        this.selectMultiCtrl.disable();
      }
    }
    // load the initial select list
    if (this.options) {
      //
      // this.selectMultiCtrl.setValue(this.options.length ? [this.options[0].lovValue] : []);
      // this.filterService.setFilter(this.filterName, { value: this.options[0].lovValue, selected: true }, true);
      this.options = this.options.map((item: any) =>
        item.lovValue ? item.lovValue : item
      );
      //
      if (this.filterName != 'timerequired')
        this.options.unshift(`All ${this.label}`);
      // this.options.unshift({
      //   displayOrder: '0',
      //   lovDisplayName: `All ${this.label}`,
      //   lovValue: `All ${this.label}`,
      // });

      //
      this.filteredSelectMulti.next(this.options.slice());
      await this.selectAllInitial(true);

      // after setting all filters make call to api
      let isFilterValid =
        await this.filterService.globalFilterSelectAllValidity();

      if (isFilterValid) {
        this.applyGlobalFilters();
      }
    }

    // listen for search field value changes
    this.selectMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMulti();
      });
  }

  checkLocationFilter() {
    if (this.role === Roles.CADMIN) {
      return false;
    } else if (this.role !== Roles.CADMIN && this.defaultLocation) {
      return true;
    } else {
      return false;
    }
  }

  ngAfterViewInit() {
    if (this.options) {
      this.setInitialValue();
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filtered select are loaded initially
   */
  protected setInitialValue() {
    this.filteredSelectMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect
          ? (this.multiSelect.compareWith = (a: any, b: any) =>
              a && b && a == b)
          : [];
      });
  }

  protected filterMulti() {
    if (!this.options) {
      return;
    }
    // get the search keyword
    let search = this.selectMultiFilterCtrl.value;
    if (!search) {
      this.filteredSelectMulti.next(this.options.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the selection
    this.filteredSelectMulti.next(
      this.options.filter(
        (value: any) => value.toLowerCase().indexOf(search) > -1
      )
    );
    //
  }

  selectAllInitial(isSelected: boolean) {
    //
    //

    if (isSelected) {
      let allOption: any = [];

      this.filteredSelectMulti
        .pipe(take(1), takeUntil(this._onDestroy))
        .subscribe((tag: any) => {
          // send default location only if role is not CADMIN
          if (this.filterName === 'location' && this.role !== Roles.CADMIN) {
            allOption.push(this.defaultLocation);
          } else {
            tag.map((val: any) => {
              allOption.push(val);
            });
          }

          // select first value only for single select

          if (this.isMultiSelect) {
            this.selectMultiCtrl.patchValue(allOption);
            this.multiCtrlSet = new Set(allOption);
          } else {
            this.selectMultiCtrl.patchValue(allOption[0]);
            this.multiCtrlSet = new Set([allOption[0]]);
          }
        });
    } else {
      this.selectMultiCtrl.patchValue([]);
      this.multiCtrlSet = new Set();
    }

    return this.setGlobalValue();
  }

  selectOptions(event: any) {
    let sourceValue = event.source.value;
    let isSelected = event.source._selected;

    if (event.isUserInput) {
      if (sourceValue === `All ${this.label}`) {
        // 1. select or unselect all
        this.selectAllInitial(isSelected);
      } else if (this.isMultiSelect) {
        this.updateSingleOption(sourceValue, isSelected);
      } else {
        this.multiCtrlSet.clear();
        this.updateSingleOption(sourceValue, isSelected);
      }
    }
  }

  updateSingleOption(sourceValue: string, isSelected: boolean) {
    if (isSelected) {
      this.multiCtrlSet.add(sourceValue);
    } else {
      this.multiCtrlSet.delete(`All ${this.label}`);
      this.multiCtrlSet.delete(sourceValue);
      this.selectMultiCtrl.patchValue(Array.from(this.multiCtrlSet));
    }

    this.setGlobalValue();
  }

  setGlobalValue() {
    this.multiCtrlSet.delete(`All ${this.label}`);

    if (this.filterName === 'location') {
      this.selectedLocation.emit(Array.from(this.multiCtrlSet));
    }

    let multiFilter = `${this.filterName}=${Array.from(this.multiCtrlSet)}`;
    this.filterService.setGlobalFilters(this.filterName, multiFilter);
    //
    return true;
  }

  applyGlobalFilters() {
    console.log('applyGlobalFilters');
    this.filterService.applyGlobalFilters();
    return true;
  }
}
