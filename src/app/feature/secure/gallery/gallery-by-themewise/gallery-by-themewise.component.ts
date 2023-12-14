import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { GalleryAPI } from '@shared/constants/api-endpoints/gallery-api.const';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppFilterService } from '@core/services/app-filter.service';
import { PagerService } from '@core/services/pager.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { ActivityAPI } from '@shared/constants/api-endpoints/activity-api.const';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { LocalService } from '@core/services/local-storage.service';
import { Roles } from '@shared/enums/role.enum';
import { ImageInDialogComponent } from '../../common/image-in-dialog/image-in-dialog.component';

@Component({
  selector: 'app-gallery-by-themewise',
  templateUrl: './gallery-by-themewise.component.html',
  styleUrls: ['./gallery-by-themewise.component.scss'],
})
export class GalleryByThemewiseComponent implements OnInit, OnChanges {
  @Input() gallerDetails: any;
  @Input() themeName: any;
  @Input() type: any;

  currentPage: number = 0;
  totalItems: number = 0;
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any;
  gallerySearchParam: any;
  pageLimit: number = 4;
  isSelectedAllImg = false;
  isSelectedAllFeedback = false;
  galleryForm = this.fb.group({
    images: this.fb.array([]),
  });
  enableOrDisableBtn: boolean = false;
  role: any;
  constructor(
    private apiService: ApiService,
    private filterService: AppFilterService,
    private pagerService: PagerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private storageService: LocalService,
    private httpClient: HttpClient
  ) {}

  public get roleEnum() {
    return Roles;
  }

  ngOnInit(): void {
    //
    this.role = this.storageService.getData('Role');
    this.apiService.isProfileSwitched().subscribe((res) => {
      if (res) {
        this.role = this.storageService.getData('Role');
      }
    });
    this.getInitialData();
    this.imageFormArray.valueChanges.subscribe((values: any[]) => {
      const enableButton = values.some((value: any) => value === true);
      if (enableButton) {
        this.enableOrDisableBtn = true;
      } else {
        this.enableOrDisableBtn = false;
      }
    });
  }
  getInitialData() {
    this.imageFormArray.clear();
    if (Object.keys(this.gallerDetails).length > 0) {
      this.currentPage = this.gallerDetails[this.themeName].pageNo;
      this.totalItems = this.gallerDetails[this.themeName].totalElements;
      this.pager = this.pagerService.getPager(
        this.gallerDetails[this.themeName].totalElements,
        this.currentPage,
        this.pageLimit
      );
      this.gallerDetails[this.themeName].images =
        this.gallerDetails[this.themeName].images.length > 0
          ? this.gallerDetails[this.themeName].images.slice(
              this.pager.startIndex,
              this.pager.endIndex + 1
            )
          : [];

      this.pagedItems = this.gallerDetails;
      this.addImagesToForm();
      //
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.gallerDetails?.firstChange) {
      if (changes?.gallerDetails) {
        this.gallerDetails = null;
      }

      this.gallerDetails = changes?.gallerDetails?.currentValue;
      this.getInitialData();
    }
  }
  get imageFormArray() {
    return this.galleryForm.controls['images'] as FormArray;
  }

  onPageChange(event: any) {
    if (event.pager) {
      this.pager = event.pager;
      this.currentPage = this.pager.currentPage;
      this.fetchGalleryDetails();
    }
  }
  fetchGalleryDetails() {
    let filterToString = ``;
    // add : for all filters except first one
    let entryIndex = 0;
    for (let [key, value] of this.filterService.globalFilterArr.entries()) {
      if (entryIndex !== 0) filterToString += ':';
      if (key == 'themeName') {
        filterToString += `themeName=${this.themeName}`.toString().trim();
      } else {
        filterToString += `${value}`.toString().trim();
      }
      entryIndex++;
    }
    const params = new HttpParams()
      .set('imageType', 'ALL')
      .set('searchCriteria', filterToString)
      .set('pageNo', this.currentPage)
      .set('pageSize', this.pageLimit);
    const fetchUrl = `${GalleryAPI.getAllImagesUrl()}?${params} `;
    this.apiService.get(fetchUrl).subscribe({
      next: (val) => {
        if (val) {
          this.setPage(this.currentPage, val.data);
        }
      },
      error: (err: any) => {
        this.toastr.error(err);
      },
      complete: () => {
        //
      },
    });
  }

  setPage(page: number, val: any) {
    // get pager object from service
    if (Object.keys(val[this.type]).length > 0) {
      this.totalItems = val[this.type][this.themeName].totalElements;
      this.pager = this.pagerService.getPager(
        val[this.type][this.themeName].totalElements,
        page,
        this.pageLimit
      );
      this.pagedItems = val[this.type];
      this.imageFormArray.clear();
      this.addImagesToForm();
    } else {
      this.totalItems = 0;
      this.pager = this.pagerService.getPager(0, 1, this.pageLimit);
      this.pagedItems = [];
      this.imageFormArray.clear();
    }
  }
  selectAllImages(themeName: any) {
    this.isSelectedAllImg = !this.isSelectedAllImg;

    this.pagedItems[themeName].images.map((image: any, index: number) => {
      this.updateImageFormArray(index, this.isSelectedAllImg);
    });
  }

  updateImageFormArray(index: number, status: boolean) {
    this.imageFormArray.at(index).patchValue(status);
  }

  addImagesToForm() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let image of this.pagedItems[this.themeName].images) {
      const checkboxFormControl = new FormControl(false);
      this.imageFormArray.push(checkboxFormControl);
    }
  }

  removeImageForm(index: number) {
    this.imageFormArray.removeAt(index);
  }

  publishOrUnpublishImages(status: boolean) {
    const selectedImages: any = [];

    this.pagedItems[this.themeName].images.map((image: any, index: number) => {
      const isSelected = this.imageFormArray.value[index];
      if (isSelected) {
        selectedImages.push({
          imageName: image.imageName,
          activityName: image.activityId,
          publishOrUnpublish: status,
        });
      }
    });

    if (selectedImages?.length) {
      this.publishOrUnpublishImagesToApi(selectedImages, status);
    }
  }

  publishOrUnpublishSingleImage(image: any, status: boolean) {
    this.publishOrUnpublishImagesToApi(
      [
        {
          imageName: image.imageName,
          activityName: image.activityId,
          publishOrUnpublish: status,
        },
      ],
      status
    );
  }

  publishOrUnpublishImagesToApi(selectedImages: Array<any>, status: boolean) {
    const imagesUrl = ActivityAPI.imagesUrl();

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '470px',
      data: {
        heading: `${status ? 'Publish' : 'Unpublish'} Images?`,
        message: `Are you sure you want to ${
          status ? 'Publish' : 'Unpublish'
        } the images?`,
      },
    });

    dialogRef.afterClosed().subscribe((statuss: any) => {
      if (statuss) {
        this.apiService
          .post(selectedImages, `${imagesUrl}/PublishOrUnPublish`)
          .subscribe(() => {
            this.toastr.success(
              `${
                status
                  ? 'Successfully Published Images'
                  : 'Successfully Unpublished Images'
              }`
            );
            this.currentPage = 1;
            this.fetchGalleryDetails();
          });
      }
    });
  }

  removeImages() {
    const selectedImages: any = [];

    this.pagedItems[this.themeName].images.map((image: any, index: number) => {
      const isSelected = this.imageFormArray.value[index];
      if (isSelected) {
        selectedImages.push({
          imageName: image.imageName,
          imageType: 'EMPLOYEE_UPLOAD',
          softDelete: true,
          activityId: image.activityId,
        });
      }
    });

    if (selectedImages?.length) {
      this.removeImagesToApi(selectedImages);
    }
  }

  removeSingleImage(image: any) {
    this.removeImagesToApi([
      {
        imageName: image.imageName,
        imageType: 'EMPLOYEE_UPLOAD',
        softDelete: true,
        activityId: image.activityId,
      },
    ]);
  }

  removeImagesToApi(selectedImages: Array<any>) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '470px',
      data: {
        heading: 'Delete Images?',
        message: `Are you sure you want to delete the images?`,
      },
    });

    dialogRef.afterClosed().subscribe((status: any) => {
      if (status) {
        const imagesUrl = ActivityAPI.imagesUrl();
        this.apiService
          .delete(selectedImages, `${imagesUrl}`)
          .subscribe((res: any) => {
            this.toastr.success(
              res?.data
                ? res.data
                : res?.message
                ? res.message
                : 'Image deleted successfully from gallery'
            );
            this.currentPage = 1;
            this.fetchGalleryDetails();
          });
      }
    });
  }

  getShortName(fullName: string) {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('');
  }
  downloadImg(url: any) {
    const imgName = url.substr(url.lastIndexOf('/') + 1);
    this.httpClient
      .get(url, { responseType: 'blob' as 'json' })
      .subscribe((res: any) => {
        const file = new Blob([res], { type: res.type });

        // IE
        if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
          (window.navigator as any).msSaveOrOpenBlob(file);
          return;
        }

        const blob = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blob;
        link.download = imgName;

        link.dispatchEvent(
          new MouseEvent('click', {
            // bubbles: true,
            cancelable: true,
            view: window,
          })
        );

        setTimeout(() => {
          window.URL.revokeObjectURL(blob);
          link.remove();
        }, 100);
      });
  }

  preview(url: any) {
    this.dialog.open(ImageInDialogComponent, {
      // width: '844px',
      panelClass: 'dialog-container',
      disableClose: true,
      data: {
        url,
      },
    });
  }
}
