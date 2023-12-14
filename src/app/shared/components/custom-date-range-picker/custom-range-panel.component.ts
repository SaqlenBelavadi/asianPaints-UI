import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDateRangePicker } from '@angular/material/datepicker';
import * as moment from 'moment';

const customPresets = [
  // 'Fixed',
  'Today',
  'Last 30 days',
  'This month',
  'This year',
  'This Financial year',
  'This Quarter',
  'Last Quarter',
] as const; // convert to readonly tuple of string literals

// equivalent to "today" | "last 7 days" | ... | "last year"
type CustomPreset = typeof customPresets[number];

@Component({
  selector: 'app-custom-range-panel',
  templateUrl: './custom-range-panel.component.html',
  styleUrls: ['./custom-range-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomRangePanelComponent<D> {
  // list of range presets we want to provide:
  readonly customPresets = customPresets;
  @HostBinding('class.touch-ui')
  readonly isTouchUi = this.picker.touchUi;

  constructor(
    private dateAdapter: DateAdapter<D>,
    private picker: MatDateRangePicker<D>
  ) {}

  // called when user selects a range preset:
  selectRange(rangeName: CustomPreset): void {
    const [start, end] = this.calculateDateRange(rangeName);

    this.picker.select(start);
    this.picker.select(end);
    this.picker.close();
  }

  private calculateDateRange(rangeName: CustomPreset): [start: D, end: D] {
    const today = this.today;
    const year = this.dateAdapter.getYear(today);
    const month = this.dateAdapter.getMonth(today);

    switch (rangeName) {
      // case 'Fixed':
      //   return this.calculateMonth(today);
      case 'Today': {
        // const start = this.dateAdapter.addCalendarDays(today, -6);
        return [today, today];
      }
      case 'Last 30 days': {
        const last30 = this.dateAdapter.addCalendarMonths(today, -1);
        return [last30, today];
      }
      case 'This month': {
        return this.calculateMonth(today);
      }
      case 'This year': {
        const start = this.dateAdapter.createDate(year, 0, 1);
        const end = this.dateAdapter.createDate(year, 11, 31);
        return [start, end];
      }
      case 'This Financial year': {
        // const start = this.dateAdapter.createDate(year, 3, 1);
        // const end = this.dateAdapter.createDate(year + 1, 2, 31);
        // const thisDayLastWeek = this.dateAdapter.addCalendarDays(today, -7);
        // return this.calculateWeek(thisDayLastWeek);
        // return [start, end];
        return this.getFinancialYear();
      }
      case 'This Quarter': {
        return this.calculateThisQuarter(today);
      }
      case 'Last Quarter': {
        return this.calculateLastQuarter(today);
      }
      default:
        // exhaustiveness check;
        // rangeName has type never, if every possible value is handled in the switch cases.
        // Otherwise, the following line will result in compiler error:
        // "Type 'string' is not assignable to type '[start: D, end: D]'"
        return rangeName;
    }
  }

  private getFinancialYear(): [start: D, end: D] {
    // Get the current date
    var currentDate = moment();

    // Determine the start and end dates of the financial year
    var startOfFinancialYear = moment()
      .month(3)
      .date(1)
      .subtract(currentDate.month() < 3 ? 1 : 0, 'years');
    var endOfFinancialYear = moment()
      .month(2)
      .date(31)
      .add(currentDate.month() >= 3 ? 1 : 0, 'years');
    const start = this.dateAdapter.createDate(
      startOfFinancialYear.year(),
      startOfFinancialYear.month(),
      startOfFinancialYear.date()
    );
    const end = this.dateAdapter.createDate(
      endOfFinancialYear.year(),
      endOfFinancialYear.month(),
      endOfFinancialYear.date()
    );
    return [start as D, end as D];
  }

  private calculateThisQuarter(forDay: D): [start: D, end: D] {
    const year = this.dateAdapter.getYear(forDay);
    const month = this.dateAdapter.getMonth(forDay) + 1;
    const quarter = Math.floor((month + 2) / 3);
    let start, end;

    if (quarter == 1) {
      start = this.dateAdapter.createDate(year, 0, 1);
      end = this.dateAdapter.createDate(year, 2, 31);
    } else if (quarter == 2) {
      start = this.dateAdapter.createDate(year, 3, 1);
      end = this.dateAdapter.createDate(year, 5, 30);
    } else if (quarter == 3) {
      start = this.dateAdapter.createDate(year, 6, 1);
      end = this.dateAdapter.createDate(year, 8, 30);
    } else if (quarter == 4) {
      start = this.dateAdapter.createDate(year, 9, 1);
      end = this.dateAdapter.createDate(year, 11, 31);
    }

    return [start as D, end as D];
  }

  private calculateLastQuarter(forDay: D): [start: D, end: D] {
    const year = this.dateAdapter.getYear(forDay);
    const month = this.dateAdapter.getMonth(forDay) + 1;
    const quarter = Math.floor((month + 2) / 3);
    let start, end;
    //

    if (quarter == 1) {
      start = this.dateAdapter.createDate(year - 1, 11, 31);
      end = this.dateAdapter.createDate(year - 1, 9, 1);
    } else if (quarter == 2) {
      start = this.dateAdapter.createDate(year, 2, 31);
      end = this.dateAdapter.createDate(year, 0, 1);
    } else if (quarter == 3) {
      start = this.dateAdapter.createDate(year, 5, 30);
      end = this.dateAdapter.createDate(year, 3, 1);
    } else if (quarter == 4) {
      start = this.dateAdapter.createDate(year, 8, 30);
      end = this.dateAdapter.createDate(year, 6, 31);
    }

    return [end as D, start as D];
  }

  private calculateMonth(forDay: D): [start: D, end: D] {
    const year = this.dateAdapter.getYear(forDay);
    const month = this.dateAdapter.getMonth(forDay);
    const start = this.dateAdapter.createDate(year, month, 1);
    const end = this.dateAdapter.addCalendarDays(
      start,
      this.dateAdapter.getNumDaysInMonth(forDay) - 1
    );
    return [start, end];
  }

  private calculateWeek(forDay: D): [start: D, end: D] {
    const deltaStart =
      this.dateAdapter.getFirstDayOfWeek() -
      this.dateAdapter.getDayOfWeek(forDay);
    const start = this.dateAdapter.addCalendarDays(forDay, deltaStart);
    const end = this.dateAdapter.addCalendarDays(start, 6);
    return [start, end];
  }

  private get today(): D {
    const today = this.dateAdapter.getValidDateOrNull(moment());
    if (today === null) {
      throw new Error('date creation failed');
    }
    return today;
  }
}
