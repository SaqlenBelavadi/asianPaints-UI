import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { AppFilterService } from '@core/services/app-filter.service';
import { LocalService } from '@core/services/local-storage.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  role: any;
  showAgent = false;
  selectedGroup: any;
  selectedAgent: any;
  // startDate: any = new Date();
  // endDate: any = new Date();
  optionSelected: number = 1; // used for pass this value to child component by selecting the button option.
  dates: any;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  locationList: string[] = ['Bangalore', 'Mumbai', 'Gujarat', 'Pune'];
  locations = new FormControl('');




  constructor(private apiservice: ApiService, private filterService: AppFilterService, private storageService: LocalService) {
    let addDays = function (days: any) {
      var date = new Date();
      date.setDate(date.getDate() + days);
      return date;
    }

    var date = new Date();
    this.range.controls.start.patchValue(date);
    this.range.controls.end.patchValue(addDays(10));
  }


  ngOnInit(): void {
    this.role = this.storageService.getData('Role');
    this.dates = {
      startDate: this.range.value.start,
      endDate: this.range.value.end,
    }
    this.range.controls.start.valueChanges.subscribe(res => {
      if (res) {
        this.dates = {
          startDate: res,
          endDate: this.range.value.end,
        }
      }

    })
    this.range.controls.end.valueChanges.subscribe(res => {
      if (res) {
        this.dates = {
          startDate: this.range.value.start,
          endDate: res,
        }
      }

    })

    this.filterService.getdrpdwnValues().subscribe((filters: any) => {
      //

      // update component based on the changes in filters object
      if (filters) {
        // let filterss = this.filterService.returnFilterParms(filters.value);

        this.filterService.filterValue = filters;
        // this.fetchActivity();
      }
      // count++;

    });
  }

  chooseGroup(name: any) {
    this.showAgent = true;
    this.selectedGroup = name;
  }

  chooseAgent(name: any) {
    this.selectedAgent = name;
  }

  chooseButtonValue(value: any) {
    this.optionSelected = value;
  }

}
