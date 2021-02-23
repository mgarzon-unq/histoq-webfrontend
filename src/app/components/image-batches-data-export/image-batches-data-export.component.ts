import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import { ImageService } from 'src/app/services/image-service/image.service';
import { FileFormat } from 'src/app/model/file-format';
import * as fileSaver from 'file-saver';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  imageBatchesIds: number[];
}

@Component({
  selector: 'app-image-batches-data-export',
  templateUrl: './image-batches-data-export.component.html',
  styleUrls: ['./image-batches-data-export.component.css']
})
export class ImageBatchesDataExportComponent implements OnInit {
  public supportedFileFormats: FileFormat[];
  public selectedFileFormat: FileFormat;

  constructor(private imageService: ImageService,
              public dialogRef: MatDialogRef<ImageBatchesDataExportComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private notificationService: NotificationService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.imageService.findAllExportableDataFileFormats().subscribe( supportedFileFormats => {
      this.supportedFileFormats = supportedFileFormats;
    });
  }

  onExportData() {
    this.imageService.findImageBatchesExportableData(this.data.imageBatchesIds,this.selectedFileFormat).subscribe( response => {
      let blob:any = new Blob([response], { type: this.selectedFileFormat.contentType });
      fileSaver.saveAs(blob, "TissueScan-Data" + "." + this.selectedFileFormat.extension );
      this.notificationService.showSuccess(this.translate.instant("ImageBatchesDataExportDialog.DataExportSuccessful"));
      this.dialogRef.close();
    });
  }

}
