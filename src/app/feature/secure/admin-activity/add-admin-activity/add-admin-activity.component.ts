import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { CommunicationService } from '@core/services/communication.service';
import { OverlaySidePanelService } from '@shared/components/overlay-side-panel/overlay-side-panel.service';
import { AdminActivityAPI } from '@shared/constants/api-endpoints/admin-activity.const';
import { Roles } from '@shared/enums/role.enum';
import { ToastrService } from 'ngx-toastr';

interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-admin-activity',
  templateUrl: './add-admin-activity.component.html',
  styleUrls: ['./add-admin-activity.component.scss'],
})
export class AddAdminActivityComponent implements OnInit {
  roles: Role[] = [
    { value: Roles.ADMIN, viewValue: Roles.ADMIN },
    { value: Roles.CADMIN, viewValue: Roles.CADMIN },
  ];
  searchControl: FormControl = new FormControl('');
  empDetails: any[] = [];
  adminForm: FormGroup;

  constructor(
    private communicationService: CommunicationService,
    private apiService: ApiService,
    private sidePanelService: OverlaySidePanelService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(val => {
    //   if (val) {
    //     this.getEmployeeDetailsById(val);
    //   }
    // });
    this.initAdminForm();
  }

  initAdminForm() {
    this.adminForm = this.formBuilder.group({
      employeeName: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      employeeId: [{ value: '', disabled: true }],
      locationName: [{ value: '', disabled: true }],
      role: [null, [Validators.required]],
    });
  }

  patchAdminForm(employee: any) {
    this.adminForm.patchValue({
      employeeName: employee.employeeName,
      email: employee.email,
      employeeId: employee.employeeId,
      locationName: employee.locationName,
      role: employee.role,
    });
  }

  selectEmployee($event: any) {
    this.patchAdminForm($event);
  }

  getEmployeeDetailsById() {
    let empId = this.searchControl.value;

    const params = new HttpParams().set('employeeId', empId.toString());
    this.communicationService
      .get(`${AdminActivityAPI.getEmpDetailsByIdUrl()}?${params}`, {}, true)
      .subscribe({
        next: (val: any) => {
          this.empDetails = [val.data];
          this.selectEmployee(val.data);
        },
        error: (err: any) => {
          this.adminForm.reset();
          this.toastr.error(
            err?.error?.message ? err?.error?.message : 'Employee Not Exists'
          );
          this.empDetails = [];
        },
        complete: () => {},
      });
  }

  saveAdmin() {
    const admin = this.adminForm.getRawValue();
    const newAdmin = { ...this.empDetails[0] };
    newAdmin.role = admin.role;
    if (this.adminForm.invalid) {
      this.toastr.warning('Please select a role');
    }

    if (newAdmin) {
      const params = new HttpParams().set('existingAdmin', true);
      this.communicationService
        .post(`${AdminActivityAPI.getAdminUrl()}?${params}`, newAdmin, true)
        .subscribe({
          next: (val: any) => {
            this.toastr.success(
              val?.message ? val.message : 'Admin added successfully'
            );
            this.sidePanelService.close();
            this.apiService.sidePanelClose$.next(true);
          },
          error: (err: any) => {
            this.toastr.warning(err?.error?.message || 'Something went wrong.');
          },
          complete: () => {},
        });
    } else {
      this.toastr.warning('Please select employee details');
    }
  }
  onCancelClick() {
    this.sidePanelService.close();
    // this.apiService.sidePanelClose$.next(true);
  }
}
