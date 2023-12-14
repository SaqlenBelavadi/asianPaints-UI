/**
 * Note : Passing activityId in the place of activityName for the multilocation change.
 * Passing in image upload section mainly
 */
import { Location } from '@angular/common';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { CommunicationService } from '@core/services/communication.service';
import { LocalService } from '@core/services/local-storage.service';
import { OverlaySidePanelService } from '@shared/components/overlay-side-panel/overlay-side-panel.service';
import { ActivityAPI } from '@shared/constants/api-endpoints/activity-api.const';
import { AdminActivityAPI } from '@shared/constants/api-endpoints/admin-activity.const';
import { Roles } from '@shared/enums';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddActivityTagComponent } from './add-activity-tag/add-activity-tag.component';

export interface FileHandle {
  file: File;
  url: SafeUrl;
  format: string;
}
@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss'],
})
export class AddActivityComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('creativeUploadInput') creativeUploadInput: any;
  @ViewChild('pastVideoInput') pastVideoInput: any;
  @ViewChild('auto', { static: true }) autoc: MatAutocomplete;
  loaded: boolean = false;
  activityForm: FormGroup | any;
  themeArray: any[] = [];
  modeArray: any[] = [];
  tagsArray: any[] = [];
  defaultLocation: any;

  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = true;
  // public minDate!: moment.Moment;
  public maxDate!: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  contentMaxLength: number = 3999; // character limit for the content fields

  editorConfig = {
    selector: 'textarea',
    plugins: 'lists link image table code help wordcount',
    menubar: false,
    statusbar: false,
    toolbar:
      'Undo Redo Bold Italic Underline Fontsize alignleft aligncenter alignright bullist numlist indent outdent link unlink',
    // toolbar:
    //   'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | fontsizeselect | alignleft aligncenter alignright alignjustify | numlist bullist | forecolor backcolor removeformat | charmap emoticons | fullscreen preview | insertfile image media template link anchor codesample | ltr rtl',
    height: 200,
    setup: (editor: any) => { // function for restrict the content limit
      editor.on('keydown', (e: any) => {
        this.contentResrictionFn(editor, e)
      });
      editor.on('paste', (e: any) => {
        this.contentResrictionFn(editor, e)
      });
      editor.on('keyup', (e: any) => {
        this.contentResrictionFn(editor, e)
      });
    }
  };
  contentResrictionFn(editor: any, e: any) {
    const content = editor.getContent();
    const contentLength = content.length;
    const maxLength = this.contentMaxLength;
    if (contentLength >= maxLength && e.keyCode !== 8 && e.keyCode !== 46) {
      const diff = contentLength - maxLength;
      editor.setContent(content.substring(0, content.length - diff));
      e.preventDefault();
      e.stopPropagation();
    }
  }

  imageUploadForm!: FormGroup;
  timeRequiredForm!: FormGroup;

  creativesUploadForm!: FormGroup;
  creativeFilesAfterUpload: any[] = [];

  pastVideoUploadForm!: FormGroup;
  pastVideoAfterUpload: any[] = [];
  disablePastUploadbtn: boolean = false;

  limit = 5;
  responseAfterImgUploads: any;

  allowedFileExtensions = [
    'jpg',
    'svg',
    'jpeg',
    'png',
    'wav',
    'mp3',
    'mp4',
    'gif',
    'mov',
    'avi',
    'mpeg',
    'WebM',
    'OGG',
  ];

  disableUploadImgbtn: boolean = false;
  isImageUploaded: boolean = false;
  isCreativeImageUploaded: boolean = false;
  isPastVideoUploaded: boolean = false;
  disableUploadCrtvbtn: boolean = false;

  dates: any;

  dateRangeForm: FormGroup;
  isEditAfterCreate: boolean = false;
  datasAfterActivityAdd: any;

  isEditMode: boolean = false;
  editData: any;

  activityImageArr: any[] = [];
  selectedCoverPhotoIndex = new FormControl('', [Validators.required]);

  minDate: any;
  financialRegxValidator: any = /^\d+(\.\d{1,2})?$/;

  locationArray: any[] = [];
  role: any;

  empDetails: any;
  empIds: any[] = [];
  adminForm: FormGroup;
  contactPersonInitialValue: any;
  isFetchEmpErr: boolean = false;
  generatedActitivtyID: any;
  selectedLocations: any;
  isPastActivityEdit: boolean = false;
  isOngoingActivityEdit: boolean = false;
  filteredOptions: string[];
  isPastUrlEntered: boolean = false;
  public height: string;
  hidePastUrlCaption: boolean = false; //this field is used for hideing caption of video url if video is uploaded.We are using same field.
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private communicationService: CommunicationService,
    private sidePanelService: OverlaySidePanelService,
    private storageService: LocalService,
    private router: Router,
    private location: Location
  ) {
    this.role = this.storageService.getData('Role');
    if (this.storageService.getData('d-loc')) {
      this.defaultLocation = this.storageService.getData('d-loc') as string;
    }

    /**time required form group */
    this.timeRequiredForm = new FormGroup({
      hours: new FormControl('', [Validators.required]),
      minutes: new FormControl('', [Validators.required]),
    });

    /**start and end date form group */
    this.dateRangeForm = new FormGroup(
      {
        startDate: new FormControl('', [Validators.required]),
        endDate: new FormControl(
          { value: '', disabled: true },
          Validators.required
        ),
      },
      { validators: dateValidator }
    );
  }

  public get roleEnum() {
    return Roles;
  }

  //Help to get all photos or videos controls as form array.
  get photosOrVideos(): FormArray {
    return this.activityForm.get('images') as FormArray;
  }
  // We will create multiple form controls inside defined form controls photos.
  createItem(data: any): FormGroup {
    return this.fb.group({
      file: [data.file],
      url: [data.url],
      format: [data.format],
      caption: [data.caption, [Validators.required, Validators.maxLength(40)]],
      isUploaded: [data.uploaded],
    });
  }
  //Help to get past videos controls as form array.
  get pastVideos(): FormArray {
    return this.activityForm.get('pastVideo') as FormArray;
  }
  // We will create multiple form controls inside defined form controls photos.
  createPastVideoItem(data: any): FormGroup {
    return this.fb.group({
      file: [data.file],
      url: [data.url],
      format: [data.format],
      caption: [data.caption],
    });
  }

  //Help to get past videos controls as form array.
  get creativeUploads(): FormArray {
    return this.activityForm.get('creativeFiles') as FormArray;
  }
  // We will create multiple form controls inside defined form controls photos.
  addCreativeItem(data: any): FormGroup {
    return this.fb.group({
      file: [data.file],
      url: [data.url],
      name: [data.name],
      isUploaded: [data.uploaded],
    });
  }

  async ngOnInit() {
    this.getAllEmployees();
    // this.activityForm.enable();
    this.isEditMode = this.apiService.isActivityEdit;
    this.editData = this.apiService.ativityEditData;

    /**form group initialization */
    this.activityForm = this.initializeFromGroup();
    this.formControlValueChanged();
    this.loaded = true;

    this.checkForPastActivityEdit();
    this.checkForOngoingActivityEdit();

    if (this.isEditMode) {
      // this.activityForm.controls.activityName.disable();
      this.getAllImageByActivity('ADMIN_UPLOAD');
      this.getAllImageByActivity('CREATIVE');
      this.getAllImageByActivity('PAST_VIDEOS');
    }

    await this.fetchLov('Themes').then((themes) => {
      this.themeArray = themes as any[];
    });

    await this.fetchLov('Modes').then((modes) => {
      this.modeArray = modes as any[];
    });

    //
    await this.fetchLov('Locations').then((locations) => {
      this.locationArray = locations as any[];
      if (this.defaultLocation && this.role !== Roles.CADMIN) {
        this.activityForm.controls.activityLocation.setValue(
          this.defaultLocation.toString().trim().split(' ')
        );
        this.activityForm.controls.activityLocation.disable();
      } else {
        if (this.editData?.activityLocation?.length) {
          this.activityForm.controls.activityLocation.setValue(
            this.editData?.activityLocation
          );
        } else if (this.defaultLocation) {
          this.activityForm.controls.activityLocation.setValue([
            this.defaultLocation.toString().trim(),
          ]);
        }
      }
    });

    this.apiService.sidePanelClose$.subscribe((status: any) => {
      if (status) {
        //
        this.activityForm.reset();
        this.apiService.isActivityEdit = false;
        this.isEditMode = false;
        this.apiService.ativityEditData = {};
        this.apiService.isPastActivityEdit = false;
        this.apiService.isOngoingActivityEdit = false;
      }
    });

    const subInfo = JSON.parse(this.storageService.getData('sub-info'));
    if (this.defaultLocation && !this.isEditMode) {
      this.contactPersonInitialValue = subInfo['name'];
      this.activityForm.controls.contactPerson.setValue(subInfo['name']);
      this.activityForm.controls.contanctEmail.setValue(subInfo['email']);
      this.activityForm.controls.csrAdminLocation.setValue(
        this.defaultLocation
      );
    } else if (this.role === Roles.CADMIN && !this.isEditMode) {
      this.contactPersonInitialValue = subInfo['name'];
      this.activityForm.controls.contactPerson.setValue(subInfo['name']);
      this.activityForm.controls.contanctEmail.setValue(subInfo['email']);
      this.activityForm.controls.csrAdminLocation.setValue(
        this.defaultLocation
      );
    }

    if (this.isEditMode) {
      if (!this.apiService.isPastActivityEdit) {
        this.dateRangeForm.controls.endDate.enable();
      }
      let time = this.editData.timeRequired
        ? this.editData.timeRequired.toString().trim().split('Hours')[0]
        : 0;
      let minute = this.editData.timeRequired
        ? this.editData.timeRequired
          .split('minutes')
          .filter(Boolean)
          .toString()
          .split('Hours')
          .pop()
        : 0;
      this.timeRequiredForm.controls.hours.patchValue(parseInt(time));
      this.timeRequiredForm.controls.minutes.patchValue(parseInt(minute));
      this.onThemeSelection();
      if (this.editData.startDate && this.editData.endDate) {
        this.dateRangeForm.controls.startDate.setValue(
          moment(this.editData.startDate, 'DD/MM/YYYY hh:mm:ss A')
        );
        this.dateRangeForm.controls.endDate.setValue(
          moment(this.editData.endDate, 'DD/MM/YYYY hh:mm:ss A')
        );
        this.dates = {
          startDate: moment(this.editData.startDate, 'DD/MM/YYYY hh:mm:ss A')
            .set({ second: 0 })
            .format('DD/MM/YYYY hh:mm:ss A'),
          endDate: moment(this.editData.endDate, 'DD/MM/YYYY hh:mm:ss A')
            .set({ second: 0 })
            .format('DD/MM/YYYY hh:mm:ss A'),
        };
        let startTime = moment(
          this.editData.startDate,
          'DD/MM/YYYY hh:mm:ss A'
        ).format('hh:mm a');
        let endTime = moment(
          this.editData.endDate,
          'DD/MM/YYYY hh:mm:ss A'
        ).format('hh:mm a');
        this.activityForm.controls.timeOfActivity.setValue(
          `${startTime} - ${endTime}`
        );
      }
    }
  }
  checkForPastActivityEdit() {
    if (this.apiService.isPastActivityEdit) {
      this.isPastActivityEdit = true;
      this.activityForm.disable();
      this.timeRequiredForm.disable();
      this.dateRangeForm.disable();
      const actualMaterialExpenseControl = <FormControl>(
        this.activityForm.get('activityFinancialDTO.actualMaterialExpense')
      );
      const actualLogisticExpenseControl = <FormControl>(
        this.activityForm.get('activityFinancialDTO.actualLogisticExpense')
      );
      const actualGratificationExpenseControl = <FormControl>(
        this.activityForm.get('activityFinancialDTO.actualGratificationExpense')
      );
      const actualOtherExpenseControl = <FormControl>(
        this.activityForm.get('activityFinancialDTO.actualOtherExpense')
      );
      this.activityForm.controls.activityFinancialDTO.controls.actualMaterialExpense.enable();
      this.activityForm.controls.activityFinancialDTO.controls.actualLogisticExpense.enable();
      this.activityForm.controls.activityFinancialDTO.controls.actualGratificationExpense.enable();
      this.activityForm.controls.activityFinancialDTO.controls.actualOtherExpense.enable();
      actualMaterialExpenseControl.setValidators([
        Validators.required,
        Validators.pattern(this.financialRegxValidator),
      ]);
      actualLogisticExpenseControl.setValidators([
        Validators.required,
        Validators.pattern(this.financialRegxValidator),
      ]);
      actualGratificationExpenseControl.setValidators([
        Validators.required,
        Validators.pattern(this.financialRegxValidator),
      ]);
      actualOtherExpenseControl.setValidators([
        Validators.required,
        Validators.pattern(this.financialRegxValidator),
      ]);
    } else {
      this.isPastActivityEdit = false;
    }
  }
  checkForOngoingActivityEdit() {
    if (this.apiService.isOngoingActivityEdit) {
      this.isOngoingActivityEdit = true;
      this.activityForm.disable();
      this.timeRequiredForm.disable();
      this.dateRangeForm.disable();

      // this.dateRangeForm.controls.endDate.enable();
    } else {
      this.isOngoingActivityEdit = false;
    }
  }

  formControlValueChanged() {
    /**check for start date value change*/
    this.dateRangeForm.controls.startDate.valueChanges.subscribe((res: any) => {
      if (res) {
        this.minDate = res;
        this.dates = {
          startDate: moment(res, 'DD/MM/YYYY hh:mm:ss A')
            .set({ second: 0 })
            .format('DD/MM/YYYY hh:mm:ss A'),
          endDate: this.dateRangeForm.controls.endDate.value
            ? this.dateRangeForm.controls.endDate
            : null,
        };
        if (!this.apiService.isPastActivityEdit) {
          this.dateRangeForm.controls.endDate.enable();
        }
      }
    });

    /**check for start date value change*/
    this.dateRangeForm.controls.endDate.valueChanges.subscribe((res: any) => {
      if (res) {
        this.dates = {
          startDate: this.dates.startDate,
          endDate: moment(res)
            .set({ second: 0 })
            .format('DD/MM/YYYY hh:mm:ss A'),
        };
        if (this.dates.startDate && this.dates.endDate) {
          let startTime = moment(
            this.dates.startDate,
            'DD/MM/YYYY hh:mm:ss A'
          ).format('hh:mm a');
          let endTime = moment(
            this.dates.endDate,
            'DD/MM/YYYY hh:mm:ss A'
          ).format('hh:mm a');
          this.activityForm.controls.timeOfActivity.setValue(
            `${startTime} - ${endTime}`
          );
        }
      }
    });

    /**form validation for need request from csr for checkbox value change*/

    const needRequestFromCCSRControl = <FormControl>(
      this.activityForm.get('needRequestFromCCSR')
    );
    const requestFromCCSRControl = <FormControl>(
      this.activityForm.get('requestFromCCSR')
    );

    needRequestFromCCSRControl.valueChanges.subscribe((value: boolean) => {
      if (value == true) {
        requestFromCCSRControl.setValidators([Validators.required]);
      } else if (value == false) {
        requestFromCCSRControl.setValidators(null);
        requestFromCCSRControl.patchValue('');
      }
      requestFromCCSRControl.updateValueAndValidity();
    });

    /**check for theme value change; Based on that showing the tags*/
    this.activityForm.controls.themeName.valueChanges.subscribe(
      (value: any) => {
        if (value) {
          this.fetchLovTags(
            'themeName',
            this.activityForm.controls.themeName.value
              .replace(/ +/g, ' ')
              .trim()
          );
        }
      }
    );

    /** Validation when testimonial person name entered */
    const testimonialPersonNameControl = <FormControl>(
      this.activityForm.get('testimonialPersonName')
    );
    const ratingControl = <FormControl>this.activityForm.get('rating');
    const testimonialControl = <FormControl>(
      this.activityForm.get('testimonial')
    );

    testimonialPersonNameControl.valueChanges.subscribe((value: any) => {
      if (value) {
        ratingControl.setValidators([Validators.required]);
        testimonialControl.setValidators([Validators.required]);
      } else {
        ratingControl.setValidators(null);
        testimonialControl.setValidators(null);
        ratingControl.patchValue('');
        testimonialControl.patchValue('');
      }
      ratingControl.updateValueAndValidity();
      testimonialControl.updateValueAndValidity();
    });
    /**END */

    // validation for past video url and caption
    /** Validation when testimonial person name entered */
    const pastVideoUrlControl = <FormControl>(
      this.activityForm.get('pastVideoUrl')
    );

    const pastVideoCaptionControl = <FormControl>(
      this.activityForm.get('pastVideoCaption')
    );

    pastVideoUrlControl.valueChanges.subscribe((value: any) => {
      if (value) {
        this.isPastUrlEntered = true;
        this.hidePastUrlCaption = false;
        pastVideoCaptionControl.setValidators([
          Validators.required,
          Validators.maxLength(40),
        ]);
      } else {
        this.isPastUrlEntered = false;
        pastVideoCaptionControl.setValidators(null);
        pastVideoCaptionControl.patchValue('');
      }
      pastVideoCaptionControl.updateValueAndValidity();
    });

    this.pastVideos.valueChanges.subscribe((values: any) => {
      if (values.length) {
        this.isPastUrlEntered = false;
        pastVideoCaptionControl.setValidators(null);
        pastVideoCaptionControl.patchValue('');
        pastVideoUrlControl.disable();
        pastVideoCaptionControl.disable();
        this.hidePastUrlCaption = true;
        let pastVideoControl = <FormArray>(
          this.activityForm.get('pastVideo').controls[0]
        );
        pastVideoControl
          ?.get('caption')
          ?.setValidators([Validators.required, Validators.maxLength(40)]);
      } else {
        // this.pastVideos.at(0).;
        this.isPastUrlEntered = false;
        this.hidePastUrlCaption = false;
        pastVideoUrlControl.enable();
        pastVideoCaptionControl.enable();
      }
    });

    this.activityForm.controls.contactPerson.valueChanges
      .pipe(
        startWith(''),
        map((value: string) => {
          // Filter the options
          if (this.empIds.length) {
            this.filteredOptions = this.empIds.filter((option) =>
              option?.toLowerCase().startsWith(value?.toLowerCase())
            );
          }
          // Recompute how big the viewport should be.
          if (this.filteredOptions && this.filteredOptions.length < 4) {
            this.height = this.filteredOptions.length * 50 + 'px';
          } else {
            this.height = '200px';
          }
        })
      )
      .subscribe();
  }
  keyDownEventForAuto(ev: KeyboardEvent) {
    if (ev.key === 'ArrowDown') {
      this.autoc?._keyManager?.activeItem?._getHostElement().scrollIntoView();
    }
  }

  async fetchLov(category: string) {
    const params = new HttpParams().set('category', category);
    const fetchUrl = `${ActivityAPI.lovUrl()}?${params.toString()}`;
    return new Promise((resolve, reject) => {
      this.apiService.get(fetchUrl).subscribe({
        next: (val: { lovResponses: any }) => {
          resolve(val.lovResponses ?? []);
        },
        error: (err: { message: string | undefined }) => {
          this.toastr.error(err.message);
          reject('Something went wrong');
        },
        complete: () => {
          //
        },
      });
    }).then((res) => {
      return res;
    });
  }
  fetchLovTags(category: string, value: any) {
    const params = new HttpParams().set(`${category}`, value);
    const fetchUrl = `${ActivityAPI.tagLovUrl()}?${params.toString()}`;
    this.apiService.get(fetchUrl).subscribe({
      next: (val: { lovResponses: never[] }) => {
        this.tagsArray = val.lovResponses ?? [];
      },
      error: (err: { error: { message: string | undefined } }) => {
        this.tagsArray = [];
        this.activityForm.controls.tagName.setValue('');
        this.activityForm.controls.tagName.updateValueAndValidity();
        this.toastr.error(err.error.message);
      },
      complete: () => {
        //
      },
    });
  }

  initializeFromGroup() {
    if (this.isEditMode) {
      if (this.editData.activityLocation) {
        let splitString = this.editData.activityLocation.split(',');
        this.editData.activityLocation = splitString;
      }
    }
    return this.fb.group({
      activityUUID: [this.isEditMode ? this.editData.activityUUID : ''],
      activityId: [this.isEditMode ? this.editData.activityId : ''],
      activityName: [
        this.isEditMode ? this.editData.activityName : '',
        [Validators.required, this.trimValidator],
      ],
      themeName: [
        this.isEditMode ? this.editData.themeName : '',
        [Validators.required],
      ],
      tagName: [
        this.isEditMode ? this.editData.tagName : '',
        [Validators.required],
      ],
      activityLocation: [
        this.isEditMode ? this.editData.activityLocation : '',
        [Validators.required],
      ],
      activityPlace: [
        this.isEditMode ? this.editData.activityPlace : '',
        [Validators.required, this.trimValidator],
      ],
      startDate: [
        this.isEditMode ? this.editData.startDate : '',
        [Validators.required],
      ],
      endDate: [
        this.isEditMode ? this.editData.endDate : '',
        [Validators.required],
      ],
      timeOfActivity: [
        {
          value: this.isEditMode ? this.editData.timeOfActivity : '',
          disabled: true,
        },
        [Validators.required],
      ],
      timeRequired: [
        this.isEditMode ? this.editData.timeRequired : '',
        [Validators.required],
      ],
      modeOfParticipation: [
        this.isEditMode ? this.editData.modeOfParticipation : '',
        [Validators.required],
      ],
      objectiveActivity: [
        this.isEditMode ? this.editData.objectiveActivity : '',
        [Validators.required, this.trimValidator],
      ],
      briefDescription: [
        this.isEditMode ? this.editData.briefDescription : '',
        [Validators.required, Validators.maxLength(this.contentMaxLength)],
      ],
      completeDescription: [
        this.isEditMode ? this.editData.completeDescription : '',
        [Validators.required, Validators.maxLength(this.contentMaxLength)],
      ],
      dosInstruction: [
        this.isEditMode ? this.editData.dosInstruction : '',
        [Validators.required, Validators.maxLength(this.contentMaxLength)],
      ],
      dontInstruction: [
        this.isEditMode ? this.editData.dontInstruction : '',
        [Validators.required, Validators.maxLength(this.contentMaxLength)],
      ],
      contactPerson: [
        this.isEditMode ? this.editData.contactPerson : '',
        [Validators.required, this.trimValidator],
      ],
      contanctEmail: [
        this.isEditMode ? this.editData.contanctEmail : '',
        [Validators.required, Validators.email, this.trimValidator],
      ],
      csrAdminLocation: [
        this.isEditMode ? this.editData.csrAdminLocation : '',
        [Validators.required, this.trimValidator],
      ],
      requestFromCCSR: [
        this.isEditMode ? this.editData.requestFromCCSR : '',
        [],
      ],
      needRequestFromCCSR: [
        this.isEditMode ? this.editData.needRequestFromCCSR : false,
        [],
      ],
      badgeToBeProvided: [
        this.isEditMode ? this.editData.badgeToBeProvided : 'false',
        [],
      ],
      activityFinancialDTO: this.returnFinanceForm(),
      created: [true, [Validators.required]],
      published: [false, [Validators.required]],
      images: this.fb.array([], [Validators.required]),
      creativeFiles: this.fb.array([]),
      testimonialPersonName: [
        this.isEditMode ? this.editData.testimonialPersonName : '',
        [this.trimValidator],
      ],
      rating: [this.isEditMode ? this.editData.rating : null],
      testimonial: [
        this.isEditMode ? this.editData.testimonial : '',
        [this.trimValidator],
      ],
      pastVideoUrl: [
        this.isEditMode ? this.editData.pastVideoUrl : '',
        [this.trimValidator],
      ],
      pastVideo: this.fb.array([]),
      pastVideoCaption: [
        this.isEditMode ? this.editData.pastVideoCaption : '',
        [],
      ],
    });
  }

  returnFinanceForm() {
    return this.fb.group({
      materialOrCreativeExpense: [
        this.isEditMode
          ? this.editData.activityFinancialDTO.materialOrCreativeExpense
          : '',
        [Validators.required, Validators.pattern(this.financialRegxValidator)],
      ],
      logisticExpense: [
        this.isEditMode
          ? this.editData.activityFinancialDTO.logisticExpense
          : '',
        [Validators.required, Validators.pattern(this.financialRegxValidator)],
      ],
      gratificationExpense: [
        this.isEditMode
          ? this.editData.activityFinancialDTO.gratificationExpense
          : '',
        [Validators.required, Validators.pattern(this.financialRegxValidator)],
      ],
      otherExpense: [
        this.isEditMode ? this.editData.activityFinancialDTO.otherExpense : '',
        [Validators.required, Validators.pattern(this.financialRegxValidator)],
      ],
      actualMaterialExpense: new FormControl(
        {
          value: this.isEditMode
            ? this.editData.activityFinancialDTO.actualMaterialExpense
            : null,
          disabled: this.isEditAfterCreate ? false : true,
        },
        [Validators.pattern(this.financialRegxValidator)]
      ),
      actualLogisticExpense: new FormControl(
        {
          value: this.isEditMode
            ? this.editData.activityFinancialDTO.actualLogisticExpense
            : null,
          disabled: this.isEditAfterCreate ? false : true,
        },
        [Validators.pattern(this.financialRegxValidator)]
      ),
      actualGratificationExpense: new FormControl(
        {
          value: this.isEditMode
            ? this.editData.activityFinancialDTO.actualGratificationExpense
            : null,
          disabled: this.isEditAfterCreate ? false : true,
        },
        [Validators.pattern(this.financialRegxValidator)]
      ),
      actualOtherExpense: new FormControl(
        {
          value: this.isEditMode
            ? this.editData.activityFinancialDTO.actualOtherExpense
            : null,
          disabled: this.isEditAfterCreate ? false : true,
        },
        [Validators.pattern(this.financialRegxValidator)]
      ),
    });
  }
  trimValidator(control: FormControl) {
    if (control && control.value && control.value.startsWith(' ')) {
      return {
        trimError: { value: 'Please remove the sapce before the content' },
      };
    }
    if (control && control.value && control.value.endsWith(' ')) {
      return {
        trimError: { value: 'Please remove the sapce after the content' },
      };
    }

    return null;
  }

  onFileSelection(event: any, type: any) {
    //
    const files = event.target.files;

    let caption = '';
    if (files.length > 0) {
      this.disableUploadImgbtn = false;
      this.disableUploadCrtvbtn = false;
      let format = '',
        name = '';
      if (files.length > 5 && type != 'pastvideo') {
        this.toastr.info('Max allowed no of files is 5');
        this.fileInput.nativeElement.value = '';
        this.creativeUploadInput.nativeElement.value = '';
        return false;
      }
      for (var i = 0; i < files.length; i++) {
        const file = files[i];
        if (this.fileInputValidation(file, type)) {
          if (file.type.indexOf('image') > -1) {
            format = 'image';
          } else if (file.type.indexOf('video') > -1) {
            format = 'video';
          }
          if (type == 'imageOrvideo') {
            const url = this.sanitizer.bypassSecurityTrustUrl(
              window.URL.createObjectURL(file)
            );
            this.photosOrVideos.push(
              this.createItem({
                file,
                url,
                format,
                caption,
                uploaded: false,
              })
            );
            if (files.length - 1 == i) {
              this.fileInput.nativeElement.value = '';
              this.isImageUploaded = false;
              return true;
            }
            // this.fileInput.nativeElement.value = '';
          } else if (type == 'creative') {
            name = file.name;
            const url = window.URL.createObjectURL(file);
            this.creativeUploads.push(
              this.addCreativeItem({
                file,
                url,
                name,
                uploaded: false,
              })
            );
            if (files.length - 1 == i) {
              this.creativeUploadInput.nativeElement.value = '';
              this.isCreativeImageUploaded = false;
              return true;
            }
            // this.creativeUploadInput.nativeElement.value = '';
          } else if (type == 'pastvideo') {
            const url = this.sanitizer.bypassSecurityTrustUrl(
              window.URL.createObjectURL(file)
            );
            this.pastVideos.push(
              this.createPastVideoItem({
                file,
                url,
                format,
                caption,
              })
            );
            if (files.length - 1 == i) {
              this.pastVideoInput.nativeElement.value = '';
              this.isPastVideoUploaded = false;
              return true;
            }
          }
          // this.pastVideoInput.nativeElement.value = '';
        }
      }
      return true;
    } else {
      return false;
    }
  }

  fileInputValidation(file: any, type: any) {
    const fileSizeLimit = 5 * 1024 * 1024;
    if (type == 'imageOrvideo') {
      if (this.photosOrVideos.value.length > this.limit - 1) {
        this.toastr.info('Max allowed no of files is 5');
        this.fileInput.nativeElement.value = '';
        return false;
      }
      if (
        this.photosOrVideos.value.find((item: any) =>
          item.file.name
            ? item.file.name.indexOf(file.name) !== -1
            : item.file.imageName.indexOf(file.name) !== -1
        )
      ) {
        this.toastr.info('Duplicate file name');
        this.fileInput.nativeElement.value = '';
        return false;
      }
    } else if (type == 'creative') {
      if (
        this.creativeUploads.value.find((item: any) =>
          item.name
            ? item.name.indexOf(file.name) !== -1
            : item.file.imageName.indexOf(file.name) !== -1
        )
      ) {
        this.toastr.info('Duplicate file name');
        this.creativeUploadInput.nativeElement.value = '';
        return false;
      }
    } else if (type == 'pastvideo') {
      if (this.pastVideos.value.length > 1) {
        this.toastr.info('Max allowed no of files is 1');
        this.pastVideoInput.nativeElement.value = '';
        return false;
      }
    }
    if (file.size > fileSizeLimit) {
      this.toastr.info('Maximum allowed file size is 5mb');
      return false;
    }

    if (type == 'imageOrvideo') {
      return this.validateImageOrVideoExtensions(file);
    } else if (type == 'pastvideo') {
      if (file.type.indexOf('video') > -1) {
      } else {
        this.toastr.warning('Invalid Format. Only videos allowed.');
      }
    }
    return true;
  }
  validateImageOrVideoExtensions(file: any) {
    try {
      // for (var i = 0; i < arrInputs.length; i++) {
      var oInput = file;
      var sFileName = oInput.name;
      if (sFileName.length > 0) {
        var blnValid = false;
        for (var j = 0; j < this.allowedFileExtensions.length; j++) {
          var sCurExtension = this.allowedFileExtensions[j];
          if (
            sFileName.substr(sFileName.lastIndexOf('.') + 1).toLowerCase() ==
            sCurExtension.toLowerCase()
          ) {
            blnValid = true;
            break;
          }
        }
        if (!blnValid) {
          this.toastr.warning(
            'Sorry, ' +
            sFileName +
            ' is invalid, allowed extensions are: ' +
            this.allowedFileExtensions.join(', ')
          );
          return false;
        }
      } else {
        return false;
      }
      // }
    } catch (err) { }

    return true;
  }

  clearImage(index: number, type: any) {
    try {
      if (type == 'imageOrvideo') {
        this.disableUploadImgbtn = false;
        if (this.isImageUploaded) {
          let itemToDelete = this.photosOrVideos.value[index];
          this.removeImageFromServer(itemToDelete.file, type);
          this.photosOrVideos.removeAt(index);
        } else {
          if (this.isEditMode) {
            let itemToDelete = this.photosOrVideos.value[index];
            //
            if (itemToDelete.file.imageName) {
              this.removeImageFromServer(itemToDelete.file, type);
            }
            this.photosOrVideos.removeAt(index);
          } else {
            this.photosOrVideos.removeAt(index);
          }
        }
        if (this.photosOrVideos.length == 0) this.isImageUploaded = false;
        if (
          this.photosOrVideos.value.length > 0 &&
          this.photosOrVideos.value.every((item: any) => item.isUploaded)
        )
          this.isImageUploaded = true;
      } else if (type == 'creative') {
        this.disableUploadCrtvbtn = false;
        if (this.isCreativeImageUploaded) {
          let itemToDelete = this.creativeUploads.value[index];
          this.removeImageFromServer(itemToDelete.file, type);
          this.creativeUploads.removeAt(index);
        } else {
          if (this.isEditMode) {
            let itemToDelete = this.creativeUploads.value[index];
            if (itemToDelete.imageName) {
              this.removeImageFromServer(itemToDelete.file, type);
            }
            this.creativeUploads.removeAt(index);
          } else {
            this.creativeUploads.removeAt(index);
          }
        }
        if (this.creativeUploads.length == 0)
          this.isCreativeImageUploaded = false;
        if (
          this.creativeUploads.value.length > 0 &&
          this.creativeUploads.value.every((item: any) => item.isUploaded)
        )
          this.isCreativeImageUploaded = true;
      } else if (type == 'pastvideo') {
        this.disablePastUploadbtn = false;
        // this.isPastUrlEntered = false;
        if (this.isPastVideoUploaded) {
          let itemToDelete = this.pastVideos.value[index];
          this.removeImageFromServer(itemToDelete.file, type);
          this.pastVideos.removeAt(index);
        } else {
          if (this.isEditMode) {
            let itemToDelete = this.pastVideos.value[index];
            if (itemToDelete.imageName) {
              this.removeImageFromServer(itemToDelete.file, type);
            }
            this.pastVideos.removeAt(index);
          } else {
            this.pastVideos.removeAt(index);
          }
        }
        if (this.pastVideos.length == 0) this.isPastVideoUploaded = false;
      }
    } catch (err) { }
  }
  filesDropped(evt: any, type: any): void {
    try {
      for (let i = 0; i < evt.dataTransfer!.files.length; i++) {
        let format,
          caption = '',
          name = '';
        const file = evt.dataTransfer!.files[i];
        if (this.fileInputValidation(file, type)) {
          if (file.type.indexOf('image') > -1) {
            format = 'image';
          } else if (file.type.indexOf('video') > -1) {
            format = 'video';
          }
          if (type == 'imageOrvideo') {
            this.disableUploadImgbtn = false;
            const url = this.sanitizer.bypassSecurityTrustUrl(
              window.URL.createObjectURL(file)
            );
            this.photosOrVideos.push(
              this.createItem({
                file,
                url,
                format,
                caption,
                uploaded: false,
              })
            );
            if (evt.dataTransfer!.files.length - 1 == i)
              this.fileInput.nativeElement.value = '';
            this.isImageUploaded = false;
          } else if (type == 'creative') {
            this.disableUploadCrtvbtn = false;
            name = file.name;
            const url = window.URL.createObjectURL(file);
            this.creativeUploads.push(
              this.addCreativeItem({
                file,
                url,
                name,
                uploaded: false,
              })
            );
            if (evt.dataTransfer!.files.length - 1 == i)
              this.creativeUploadInput.nativeElement.value = '';
            this.isCreativeImageUploaded = false;
          } else if (type == 'pastvideo') {
            this.disablePastUploadbtn = false;
            const url = window.URL.createObjectURL(file);
            this.pastVideos.push(
              this.createPastVideoItem({
                file,
                url,
                format,
                caption,
              })
            );
            if (evt.dataTransfer!.files.length - 1 == i)
              this.pastVideoInput.nativeElement.value = '';
            this.isPastVideoUploaded = false;
          }
        }
      }
    } catch (err) { }
  }

  onThemeSelection() {
    this.fetchLovTags(
      'themeName',
      this.activityForm.controls.themeName.value.replace(/ +/g, ' ').trim()
    );
  }

  addNewTagOpenDialog(event: any) {
    if (event.value == 'new') {
      this.dialog.openDialogs.pop();

      const dialogRef = this.dialog.open(AddActivityTagComponent, {
        width: '300px',
        data: {
          label: 'Add',
          data: {
            theme: this.activityForm.controls.themeName.value.toString().trim(),
          },
        },
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result.status) {
          this.fetchLovTags(
            'themeName',
            this.activityForm.controls.themeName.value
              .replace(/ +/g, ' ')
              .trim()
          );
          this.activityForm.controls.tagName.setValue(result.option);
        }
      });
    }
  }
  activityPost(type: string) {
    //
    //
    //
    if (type == 'publish') {
      this.activityForm.controls.published.setValue(true);
      this.activityForm.controls.created.setValue(false);
    }
    if (this.isFetchEmpErr) {
      this.activityForm.controls.contactPerson.setValue(
        this.contactPersonInitialValue
      );
    }

    if (this.isEditAfterCreate) {
      this.activityForm.controls.activityUUID.setValue(
        this.datasAfterActivityAdd.activityUUID
      );
      this.activityForm.controls.activityId.setValue(
        this.datasAfterActivityAdd.activityId
      );
    }

    if (this.isEditMode) {
      this.activityForm.controls.activityUUID.setValue(
        this.editData.activityUUID
      );
      this.activityForm.controls.activityId.setValue(this.editData.activityId);
      this.activityImageArr = [];
      this.photosOrVideos.value.map((item: any, index: any) => {
        if (item.file.imageName) {
          this.activityImageArr.push({
            activityName: this.activityForm.controls.activityId.value,
            imageName: item.file.imageName,
            coverPhoto:
              this.selectedCoverPhotoIndex.value == index ? true : false,
            caption: item.caption,
          });
        } else {
          this.activityImageArr.push({
            activityName: this.activityForm.controls.activityId.value,
            imageName: item.file.name,
            coverPhoto:
              this.selectedCoverPhotoIndex.value == index ? true : false,
            caption: item.caption,
          });
        }
      });
    }
    if (this.pastVideos.value.length > 0) {
      this.hidePastUrlCaption = true;
      this.activityForm.controls.pastVideoCaption.setValue(
        this.pastVideos.value[0].caption
      );
    }

    this.activityForm.markAllAsTouched();
    this.timeRequiredForm.markAllAsTouched();
    this.dateRangeForm.markAllAsTouched();

    let requiredTime = `${this.timeRequiredForm.controls.hours.value} Hours ${this.timeRequiredForm.controls.minutes.value} minutes`;
    this.activityForm.controls.timeRequired.setValue(requiredTime);
    if (this.dates && this.dates.startDate && this.dates.endDate) {
      this.activityForm.controls.startDate.setValue(this.dates.startDate);
      this.activityForm.controls.endDate.setValue(this.dates.endDate);
    }

    if (this.photosOrVideos.value.length && !this.isImageUploaded) {
      this.activityForm.markAllAsTouched();
      this.toastr.warning(
        'Please upload images or videos before create or remove from selection'
      );
      return;
    }

    if (this.creativeUploads.value.length && !this.isCreativeImageUploaded) {
      this.activityForm.markAllAsTouched();
      this.toastr.warning('Please upload creatives before create or remove from selection');
      return
    }
    if (
      this.activityForm.valid &&
      this.selectedCoverPhotoIndex.valid &&
      this.isImageUploaded
    ) {
      const body = this.returnBodyObj();
      if (type == 'publish') {
        const url = this.returnActivityLinkUrl(this.datasAfterActivityAdd);
        Object.assign(body, { activityUrl: url });
        // body.activityUrl = url;
      }
      this.communicationService
        .post(ActivityAPI.ActivityUrl(), body, {}, true)
        .subscribe({
          next: (val: any) => {
            //
            // if (val.data.created) {
            if (!this.isEditMode && !this.isEditAfterCreate) {
              this.toastr.success(val.message);
              this.isEditAfterCreate = true;
              this.datasAfterActivityAdd = val.data;
            } else if (this.isEditAfterCreate && type !== 'publish') {
              this.toastr.success('Activity Successfully Updated');
            } else {
              if (type == 'publish') {
                this.toastr.success('Activity published');
                this.isEditAfterCreate = false;
                this.apiService.createdActivity = val.data || {};
                this.sidePanelService.close();
                this.apiService.sidePanelClose$.next(true);
              } else {
                this.toastr.success('Activity Successfully Updated');
                this.isEditAfterCreate = false;
                this.sidePanelService.close();
                this.apiService.createdActivity = val.data || {};
                this.apiService.sidePanelClose$.next(true);
              }
            }

            // }
          },
          error: (err: any) => {
            // this.activityForm.controls.activityName.enable();
            this.toastr.error(
              err.error.message ? err.error.message : 'Something went wrong !'
            );
          },
          complete: () => { },
        });
    } else {
      this.activityForm.markAllAsTouched();
      this.toastr.warning('Please fill all the required fields!');
    }
  }

  returnBodyObj() {
    return {
      activityUUID: this.isEditAfterCreate
        ? this.datasAfterActivityAdd.activityUUID
        : this.isEditMode
          ? this.editData.activityUUID
          : '',
      activityId: this.isEditAfterCreate
        ? this.datasAfterActivityAdd.activityId
        : this.isEditMode
          ? this.editData.activityId
          : this.generatedActitivtyID,
      activityName: this.activityForm.controls.activityName.value,
      themeName: this.activityForm.controls.themeName.value,
      tagName: this.activityForm.controls.tagName.value,
      activityLocation: this.activityForm.controls.activityLocation.value
        .toString()
        .trim(),
      modeOfParticipation: this.activityForm.controls.modeOfParticipation.value,
      startDate: this.activityForm.controls.startDate.value,
      endDate: this.activityForm.controls.endDate.value,
      timeOfActivity: this.activityForm.controls.timeOfActivity.value,
      timeRequired: this.activityForm.controls.timeRequired.value,
      completeDescription: this.activityForm.controls.completeDescription.value,
      briefDescription: this.activityForm.controls.briefDescription.value,
      dosInstruction: this.activityForm.controls.dosInstruction.value,
      dontInstruction: this.activityForm.controls.dontInstruction.value,
      contactPerson: this.activityForm.controls.contactPerson.value,
      contanctEmail: this.activityForm.controls.contanctEmail.value,
      needRequestFromCCSR: this.activityForm.controls.needRequestFromCCSR.value,
      requestFromCCSR: this.activityForm.controls.requestFromCCSR.value,
      csrAdminLocation: this.activityForm.controls.csrAdminLocation.value,
      badgeToBeProvided: this.activityForm.controls.badgeToBeProvided.value,
      activityPlace: this.activityForm.controls.activityPlace.value,
      objectiveActivity: this.activityForm.controls.objectiveActivity.value,
      created: this.isEditMode
        ? this.editData.created
        : this.activityForm.controls.created.value,
      published: this.isEditMode
        ? this.editData.published
        : this.activityForm.controls.published.value,
      testimonial: this.activityForm.controls.testimonial.value,
      testimonialPersonName:
        this.activityForm.controls.testimonialPersonName.value,
      rating: this.activityForm.controls.rating.value,
      pastVideoCaption: this.activityForm.controls.pastVideoCaption.value,
      pastVideoUrl: this.activityForm.controls.pastVideoUrl.value,
      activityFinancialDTO:
        this.activityForm.controls.activityFinancialDTO.getRawValue(),
      images: this.activityImageArr,
    };
  }
  async uploadPictureOrVideos(type: any) {
    try {
      if (
        this.activityForm.controls.activityName.value &&
        this.activityForm.controls.themeName.value &&
        this.activityForm.controls.tagName.value &&
        this.dateRangeForm.controls.startDate.value &&
        this.dateRangeForm.controls.endDate.value &&
        this.activityForm.controls.timeOfActivity.value &&
        this.activityForm.controls.modeOfParticipation.value
      ) {
        if (type == 'imageOrvideo') {
          if (!this.generatedActitivtyID && !this.isEditMode) {
            const { generatedActitivtyID } = await this.generateActivityIdToApi(
              this.activityForm.controls.themeName.value,
              this.activityForm.controls.activityLocation.value
                .toString()
                .trim()
            );
            if (generatedActitivtyID) {
              this.callUploadImagesFn(type);
            }
          } else {
            this.callUploadImagesFn(type);
          }
        } else {
          this.callUploadImagesFn(type);
        }
      } else {
        this.toastr.info(
          'Please fill the follwing fields before upload: Activity Name, Theme Name, Tag Name, Start Date, End Date, Mode of Participation'
        );
      }
    } catch (err) { }
  }

  callUploadImagesFn(type: any) {
    try {
      var formData = new FormData();
      if (type == 'imageOrvideo') {
        this.disableUploadImgbtn = true;
        if (this.isEditMode) {
          this.photosOrVideos.value.map((item: any, index: any) => {
            if (item.file.imageName) {
              this.activityImageArr.push({
                activityName: this.editData.activityId,
                imageName: item.file.imageName,
                coverPhoto:
                  this.selectedCoverPhotoIndex.value == index ? true : false,
                caption: item.caption,
              });
            } else {
              this.activityImageArr.push({
                activityName: this.editData.activityId,
                imageName: item.file.name,
                coverPhoto:
                  this.selectedCoverPhotoIndex.value == index ? true : false,
                caption: item.caption,
              });
            }
          });
        } else {
          this.activityImageArr = [];
          this.photosOrVideos.value.map((item: any, index: any) => {
            this.activityImageArr.push({
              activityName: this.generatedActitivtyID,
              imageName: item.file.name,
              coverPhoto:
                this.selectedCoverPhotoIndex.value == index ? true : false,
              caption: item.caption,
            });
          });
        }
        // if (
        //   this.responseAfterImgUploads &&
        //   this.responseAfterImgUploads.length > 0
        // ) {
        //   this.responseAfterImgUploads.forEach((item: any) => {
        //     this.photosOrVideos.value.forEach((innerItem: any) => {
        //       if (item != innerItem.file.name) {
        //         imagesForUpload.push(innerItem);
        //       }
        //     });
        //   });
        // } else {
        //   imagesForUpload = this.photosOrVideos.value;
        // }
        for (const [index, image] of this.photosOrVideos.value.entries()) {
          if (!image.file.imageName && !image.isUploaded) {
            formData.append('images', image.file);
            this.photosOrVideos
              .at(index)
              .patchValue({ ...image, isUploaded: true });
          }
        }
        formData.append('imageType', 'ADMIN_UPLOAD');
        //
      } else if (type == 'creative') {
        this.disableUploadCrtvbtn = true;
        for (const [index, file] of this.creativeUploads.value.entries()) {
          if (!file.file.fileName && !file.isUploaded) {
            formData.append('images', file.file);
            this.creativeUploads
              .at(index)
              .patchValue({ ...file, isUploaded: true });
          }
        }
        formData.append('imageType', 'CREATIVE');
      } else if (type == 'pastvideo') {
        this.disablePastUploadbtn = true;
        this.hidePastUrlCaption = true;
        this.activityForm.controls.pastVideoCaption.setValue(
          this.pastVideos.value[0].caption
        );
        for (const image of this.pastVideos.value) {
          if (!image.file.imageName) {
            formData.append('images', image.file);
          }
        }
        formData.append('imageType', 'PAST_VIDEOS');
      }
      formData.append(
        'activityName',
        this.isEditMode ? this.editData.activityId : this.generatedActitivtyID // passing activityID
      );
      formData.append(
        'activityTheme',
        this.activityForm.controls.themeName.value
      );
      formData.append('activityTag', this.activityForm.controls.tagName.value);
      let start = moment(
        this.dateRangeForm.controls.startDate.value,
        'DD/MM/YYYY hh:mm:ss A'
      )
        .set({ second: 0 })
        .format('DD/MM/YYYY hh:mm:ss A');
      let end = moment(
        this.dateRangeForm.controls.endDate.value,
        'DD/MM/YYYY hh:mm:ss A'
      )
        .set({ second: 0 })
        .format('DD/MM/YYYY hh:mm:ss A');
      formData.append('startDate', start);
      formData.append('endDate', end);
      formData.append(
        'activityLocation',
        this.activityForm.controls.activityLocation.value.toString().trim()
      );
      formData.append(
        'mode',
        this.activityForm.controls.modeOfParticipation.value
      );

      this.uploadImages(formData, type).then((res: any) => {
        if (res) {
          if (type == 'imageOrvideo') {
            this.responseAfterImgUploads = res.data;
            this.isImageUploaded = true;
          } else if (type == 'creative') {
            this.isCreativeImageUploaded = true;
          } else if (type == 'pastvideo') {
            this.isPastVideoUploaded = true;
          }
        }
      });
    } catch (err) { }
  }

  uploadImages(formData: FormData, type: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'undefined',
      }),
    };

    return new Promise((resolve, reject) => {
      if (formData) {
        this.communicationService
          .post(ActivityAPI.uploadImagesUrl(), formData, options, true)
          .subscribe({
            next: (val: any) => {
              this.toastr.success(val.message);
              resolve(val);
            },
            error: (err: { error: { message: string | undefined } }) => {
              if (type == 'imageOrvideo') {
                this.isImageUploaded = false;
                this.disableUploadImgbtn = false;
              } else if (type == 'creative') {
                this.isCreativeImageUploaded = false;
              } else {
                this.isPastVideoUploaded = false;
              }
              this.toastr.error(err.error.message);
              reject(err);
            },
            complete: () => { },
          });
      } else {
        resolve([]);
      }
    });
  }
  removeImageFromServer(file: any, type: any) {
    let imageType =
      type == 'imageOrvideo'
        ? 'ADMIN_UPLOAD'
        : type == 'creative'
          ? 'EMPLOYEE_UPLOAD'
          : 'PAST_VIDEOS';
    let bodyObj = [
      {
        imageName: file.name ? file.name : file.imageName,
        imageType: imageType,
        activityId: this.activityForm.controls.activityId.value,
        softDelete: false,
      },
    ];
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: bodyObj,
    };
    this.communicationService
      .delete(ActivityAPI.imagesUrl(), options)
      .subscribe((res: any) => {
        if (res) {
          if (type == 'imageOrvideo') {
            this.toastr.success('Image removed successfully');
          } else if (type == 'creative') {
            this.toastr.success('File removed successfully');
          } else {
            this.toastr.success('Video removed successfully');
          }
        }
      });
  }

  goToLink(url: any) {
    window.open(url, '_blank');
  }

  getAllImageByActivity(type: any) {
    const params = new HttpParams()
      .set('imageType', type)
      .set('searchCriteria', `activityId=${this.editData.activityId}`);
    const fetchUrl = `${ActivityAPI.imagesUrl()}?${params.toString()}`;
    this.apiService.get(fetchUrl).subscribe((res: { data: any }) => {
      if (res.data) {
        if (type == 'ADMIN_UPLOAD') {
          this.getImagesOrVideos(res.data, 'imageOrvideo');
        }
        if (type == 'CREATIVE') {
          this.getImagesOrVideos(res.data, 'creatives');
        }
        if (type == 'PAST_VIDEOS') {
          this.getImagesOrVideos(res.data, 'pastvideo');
        }
      }
    });
  }
  getImagesOrVideos(files: any, type: any) {
    for (var i = 0; i < files.length; i++) {
      let format,
        caption = '';
      const file = files[i];
      const fileName = file.imageName;
      if (/\.(gif|jpg|jpeg|png|svg)$/i.test(fileName)) {
        format = 'image';
      } else if (/\.(mp3|mp4|wav|avi)$/i.test(fileName)) {
        format = 'video';
      }
      const url = file.imageUrl;
      if (type == 'imageOrvideo') {
        if (this.isEditMode) {
          caption = file.caption;
          if (file.coverPhoto == true) {
            this.selectedCoverPhotoIndex.setValue(i);
          }
        }
        this.photosOrVideos.push(
          this.createItem({ file, url, format, caption, uploaded: true })
        );
        this.isImageUploaded = true;
      }
      if (type == 'creatives') {
        this.creativeUploads.push(
          this.addCreativeItem({ file, url, name: fileName, uploaded: true })
        );
        this.isCreativeImageUploaded = true;
      }
      if (type == 'pastvideo') {
        if (this.isEditMode) {
          caption = this.editData.pastVideoCaption;
        }
        this.pastVideos.push(
          this.createPastVideoItem({ file, url, format, caption })
        );
        this.isPastVideoUploaded = true;
      }
    }
  }
  getAllEmployees() {
    this.communicationService
      .get(`${AdminActivityAPI.getEmpDetailsByIdUrl()}`, {}, true)
      .subscribe({
        next: (val: any) => {
          this.empIds = val?.data ? val.data : [];
        },
        error: () => {
          this.isFetchEmpErr = true;
        },
        complete: () => { },
      });
  }

  @ViewChild('select1') select: MatSelect;
  allSelected = false;

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }

  getEmployeeDetailsById(empcode: any) {
    let empId = empcode.toString().trim();
    const params = new HttpParams().set('employeeId', empId.toString());
    this.communicationService
      .get(`${AdminActivityAPI.getEmpDetailsByIdUrl()}?${params}`, {}, true)
      .subscribe({
        next: (val: any) => {
          this.empDetails = [val.data];
          this.activityForm.controls.contanctEmail.setValue(val.data.email);
          this.activityForm.controls.contactPerson.setValue(
            val?.employeeName
              ? val.employeeName
              : `${val.data.firstName} ${val.data.lastName}`
          );
          this.activityForm.controls.csrAdminLocation.setValue(
            val.data.locationName
          );
          // this.activityForm.controls.contanctEmail.disable();
          // this.activityForm.controls.csrAdminLocation.disable();
          this.isFetchEmpErr = false;
        },
        error: () => {
          this.isFetchEmpErr = true;
        },
        complete: () => { },
      });
  }
  selectEmployee(empId: any) {
    this.getEmployeeDetailsById(empId);
  }
  goToActivityDetail() {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree(['activity/activity-detail'], {
          queryParams: {
            activityUUID: btoa(this.datasAfterActivityAdd.activityUUID),
            activityId: btoa(this.datasAfterActivityAdd.activityId),
            location: btoa(this.datasAfterActivityAdd.activityLocation),
            p: 1, //for preview
          },
        })
      )
    );
    window.open(url, '_blank');
  }
  async onThemeSelectionChange(event: any) {
    if (
      this.defaultLocation &&
      !this.isEditMode &&
      this.role !== Roles.CADMIN
    ) {
      await this.generateActivityIdToApi(event.value, [this.defaultLocation]);
    }
  }
  async generateActivityIdToApi(themeName: any, locations: any) {
    const params = new HttpParams()
      .set('themeName', themeName)
      .set('location', locations.toString());
    const apiUrl = `${ActivityAPI.generateActivityIdUrl()}?${params
      .toString()
      .trim()}`;
    return new Promise((resolve, reject) => {
      this.apiService.post({}, apiUrl).subscribe(
        (res: any) => {
          if (res && res.data) {
            this.generatedActitivtyID = res.data;
            resolve(res.data);
          }
        },
        (err) => {
          reject(err);
        }
      );
    }).then((res) => {
      return {
        generatedActitivtyID: res,
      };
    });
  }
  returnActivityLinkUrl(data: any) {
    const url =
      environment.webUrl +
      this.location.prepareExternalUrl(
        this.router.serializeUrl(
          this.router.createUrlTree(['activity/activity-detail'], {
            queryParams: {
              activityUUID: btoa(data.activityUUID),
              activityId: btoa(data.activityId),
              p: 1, //for preview
            },
          })
        )
      );
    return url;
  }
}

export const dateValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const sTime = control.get('startDate');
  const eTime = control.get('endDate');
  if (sTime?.value && eTime?.value) {
    const start = moment(sTime?.value).valueOf();
    const end = moment(eTime?.value).valueOf();
    return start <= end ? null : { dateValid: true };
  }
  return null;
};
