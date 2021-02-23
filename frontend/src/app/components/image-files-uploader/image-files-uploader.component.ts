import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ImageService } from 'src/app/services/image-service/image.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { NgxDropzoneChangeEvent  } from 'ngx-dropzone';
import { FileSet } from 'src/app/model/file-set';
import { NotificationService } from 'src/app/services/notification-service/notification.service';

@Component({
  selector: 'app-image-files-uploader',
  templateUrl: './image-files-uploader.component.html',
  styleUrls: ['./image-files-uploader.component.css']
})
export class ImageFilesUploaderComponent implements OnInit {
  
  @Input()  imageBatchId: number;
  @Output() filesUploaded = new EventEmitter();

  selectedFiles: FileSet = new FileSet();
  currentFile: number;
  currentFileProgressValue: number;
  totalProgressValue: number;
  uploading: boolean = false;
  
  constructor(private imageService: ImageService,
              private translate: TranslateService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  onSelectFiles(event: NgxDropzoneChangeEvent): void {    
    if( event.addedFiles.length>0 &&
        this.validateSelectedFiles(event.addedFiles) ) {
          this.selectedFiles.addFiles(event.addedFiles);
    }
  }

  onRemoveFile(file: File): void {    
    this.selectedFiles.delete(file);
  }
  
  onUploadFiles(): void {
    this.uploading = true;    
    this.currentFile = 0;
    this.uploadNextImageFile();
  }

  uploadNextImageFile() {    
    this.totalProgressValue = Math.round(100 * this.currentFile / this.selectedFiles.size);

    if( this.currentFile < this.selectedFiles.size )
    {
      this.uploadImageFile(this.selectedFiles.getAt(this.currentFile));
      this.currentFile++;
    }
    else {
      this.filesUploaded.emit();
      this.selectedFiles.clear();
      this.currentFile = 0;
      this.totalProgressValue = 0;
      this.currentFileProgressValue = 0;
      this.uploading = false;
    }
  }

  uploadImageFile(file: File): void {
    this.currentFileProgressValue = 0;

    this.imageService.uploadImageFile(this.imageBatchId,file).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.currentFileProgressValue = Math.round(100 * event.loaded / event.total);
        }
        else if(event instanceof HttpResponse)
        {
          this.notificationService.showSuccess(this.translate.instant('ImageFileUploader.NotificationUploadSuccess', {fileName: file.name}));
          this.uploadNextImageFile();
        }
      },
      err => {     
        this.notificationService.showError(this.translate.instant('ImageFileUploader.NotificationUploadError', {fileName: file.name, errorMessage: err.error}));
        this.uploadNextImageFile();
      });
  }

  validateSelectedFiles(selectedFiles: File[]): boolean {
    var result: boolean = true;
    selectedFiles.forEach( file => {
        if( !file.type.match('image.*') ) {
          result = false;
          this.notificationService.showError(this.translate.instant('ImageFileUploader.NotificationFileIsnotImageType', {fileName: file.name}));
        }
    })
    return result;   
  }

  progressBarsMode(): ProgressBarMode {
    if( this.uploading )
      return "determinate";
    return "buffer";
  }


}
