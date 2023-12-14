import { Component, OnInit, Input } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppFilterService } from '@core/services/app-filter.service';
import { ApiService } from '@core/services/api.service';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { PagerService } from '@core/services/pager.service';
import { ConfirmationDialogComponent } from 'src/app/feature/secure/common/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GalleryAPI } from '@shared/constants/api-endpoints/gallery-api.const';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { CommunicationService } from '@core/services/communication.service';

@Component({
  selector: 'app-creative-details',
  templateUrl: './creative-details.component.html',
  styleUrls: ['./creative-details.component.scss'],
})
export class CreativeDetailsComponent implements OnInit {
  @Input() tagDetails: any;
  @Input() tagName: any;

  currentPage: number = 1;
  totalItems: number = 0;
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any;
  tagSearchParam: any;
  pageLimit: number = 4;
  isSelectedAllImg = false;
  tagForm = this.fb.group({
    images: this.fb.array([]),
  });
  enableOrDisableBtn: boolean = false;
  searchControl: FormControl = new FormControl('');

  constructor(
    private filterService: AppFilterService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private pagerService: PagerService,
    private dialog: MatDialog,
    private http: HttpClient,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private communicationService: CommunicationService
  ) {}

  ngOnInit(): void {
    // if (Object.keys(this.tagDetails).length > 0) {
    //   this.currentPage = this.tagDetails[this.tagName].pageNo;
    //   this.totalItems = this.tagDetails[this.tagName].totalElements;
    //   console.log('this.totalItems', this.totalItems);
    //   this.pager = this.pagerService.getPager(
    //     this.tagDetails[this.tagName].totalElements,
    //     this.currentPage,
    //     this.pageLimit
    //   );

    //   this.pagedItems = this.tagDetails;

    //   this.imageFormArray.clear();
    //   this.addImagesToForm();
    // }
    this.fetchTagDetails();
    this.imageFormArray.valueChanges.subscribe((values: any) => {
      const enableButton = values.some((value: any) => value === true);
      if (enableButton) {
        this.enableOrDisableBtn = true;
      } else {
        this.enableOrDisableBtn = false;
      }
    });
  }
  get imageFormArray() {
    return this.tagForm.controls['images'] as FormArray;
  }
  onPageChange(event: any) {
    if (event.pager) {
      this.pager = event.pager;
      this.currentPage = this.pager.currentPage;
      this.fetchTagDetails();
    }
  }
  fetchTagDetails(search = false) {
    let fetchUrl,
      filterToString = ``;
    // add : for all filters except first one
    let entryIndex = 0;
    for (let [key, value] of this.filterService.globalFilterArr.entries()) {
      if (entryIndex !== 0) filterToString += ':';
      if (key == 'tagName') {
        filterToString += `tagName=${this.tagName}`.toString().trim();
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
    if (search) {
      fetchUrl = `${GalleryAPI.getImagesUrl()}?searchCriteria=tagName=${
        this.tagName
      }:imageName=${this.searchControl.value}:pageNo=${
        this.currentPage
      }:pageSize=${this.pageLimit}`;
    } else {
      fetchUrl = `${GalleryAPI.getAllImagesUrl()}?${params} `;
    }
    //http:{{hostname}}:{{port}}/api/evp/v1/Activity/Image?searchCriteria=tagName=Tag 3:imageName=SP_ background.jpg
    this.apiService.get(fetchUrl).subscribe({
      next: (val) => {
        if (val) {
          this.totalItems =
            val.data['creativeImages'][this.tagName]?.totalElements;
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
    if (Object.keys(val['creativeImages']).length > 0) {
      this.pager = this.pagerService.getPager(
        this.totalItems,
        page,
        this.pageLimit
      );
      this.pagedItems = val['creativeImages'];
      this.imageFormArray.clear();
      this.addImagesToForm();
    } else {
      this.pager = this.pagerService.getPager(0, 1, this.pageLimit);
      this.pagedItems = null;
    }
  }
  selectAllImages(tagName: any) {
    this.isSelectedAllImg = !this.isSelectedAllImg;
    //

    this.pagedItems[tagName].images.map((image: any, index: number) => {
      this.updateImageFormArray(index, this.isSelectedAllImg);
    });
  }
  updateImageFormArray(index: number, status: boolean) {
    this.imageFormArray.at(index).patchValue(status);
  }
  addImagesToForm() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let image of this.pagedItems[this.tagName].images) {
      const checkboxFormControl = new FormControl(false);
      this.imageFormArray.push(checkboxFormControl);
    }
  }
  downloadImages() {
    const selectedImages: any = [];

    this.pagedItems[this.tagName].images.map((image: any, index: number) => {
      const isSelected = this.imageFormArray.value[index];
      if (isSelected) {
        selectedImages.push({
          url: image.imageUrl,
          imageName: image.imageName,
        });
      }
    });

    if (selectedImages?.length) {
      this.downloadImagesByUrl(selectedImages);
    }
  }
  downloadSingleImage(image: any) {
    this.downloadImagesByUrl([
      {
        url: image.imageUrl,
        imageName: image.imageName,
      },
    ]);
  }

  downloadImagesByUrl(selectedImages: Array<any>) {
    //

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '470px',
      data: {
        heading: `Download Confirmation`,
        message: `Are you sure you want to download the images?`,
      },
    });

    dialogRef.afterClosed().subscribe((status: any) => {
      if (status) {
        selectedImages.forEach(async (img: any) => {
          if (img.url) {
            const options = {
              headers: new HttpHeaders({
                'Content-Type': 'download',
              }),
              responseType: 'blob',
            };
            this.communicationService
              .get(img.url, options)
              .subscribe((res: any) => {
                const blob = new Blob([res as Blob], { type: res.type });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = img.imageName; // set the file name as needed
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              });

            // this.apiService.downloadFile(img.url, img.imageName);
          } else {
            this.toastr.warning('Invalid File url');
          }
        });
      }
    });
  }
  searchTags() {
    if (this.searchControl.value) {
      this.fetchTagDetails(true);
      this.currentPage = 1;
      // this.isSearch = true;
    }
  }
  onChangeState() {
    if (!this.searchControl.value) {
      // this.isSearch = false;
      this.currentPage = 1;
      this.fetchTagDetails();
    }
  }
  closeSearch() {
    this.searchControl.setValue('');
    // this.isSearch = false;
    this.currentPage = 1;
    this.fetchTagDetails();
  }
  isImageFile(filename: string) {
    const imageExtensions = [
      'jpg',
      'jpeg',
      'png',
      'gif',
      'bmp',
      'svg',
      'mpeg',
      'webm',
      'ogg',
    ];
    const fileExtension = filename.split('.')?.pop()?.toLowerCase();
    return imageExtensions.includes(fileExtension as string);
  }
  isDoc(filename: string) {
    return filename.endsWith('.doc') || filename.endsWith('.docx');
  }
  isPdf(filename: string) {
    return filename.endsWith('.pdf');
  }
}
