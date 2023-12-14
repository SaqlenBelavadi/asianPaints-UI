import { HttpHeaders } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommunicationService } from '@core/services/communication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-import-bulk',
  templateUrl: './import-bulk.component.html',
  styleUrls: ['./import-bulk.component.scss'],
})
export class ImportBulkComponent implements OnInit {
  fileName: any;
  @ViewChild('fileDropRef', { static: false }) fileDropEl!: ElementRef;
  @ViewChild('file') file: ElementRef | any;
  type: any;
  public files: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<ImportBulkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private communicationService: CommunicationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.type = this.data.type;
  }

  onFileSelected(file: File[]) {
    this.files = Object.keys(file).map((key: any) => file[key]);
    this.fileName = this.files[0].name;
    //
  }
  fileDropped(file: File[]) {
    this.files = Object.keys(file).map((key: any) => file[key]);
    this.fileName = this.files[0].name;
  }

  chooseFile() {
    this.file.nativeElement.click();
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals: number = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  upload() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'undefined',
      }),
    };
    const fd = new FormData();
    fd.append('file', this.files[0], this.files[0].name);
    if (this.data) {
      const url = this.data.url;
      this.communicationService.post(url, fd, options, true).subscribe({
        next: (val: any) => {
          let message = val?.data?.message
            ? val?.data?.message
            : `Data Uploaded`;
          this.toastr.success(message);
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          this.toastr.error(
            err?.error?.data
              ? err?.error?.data
              : err?.error?.message
              ? err?.error?.message
              : 'Something went wrong'
          );
        },
        complete: () => {},
      });
    }
  }
}
