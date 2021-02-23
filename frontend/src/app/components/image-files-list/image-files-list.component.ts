import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ImageFile } from 'src/app/model/image-file';
import { ImageService } from 'src/app/services/image-service/image.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ShowImageDialogComponent } from '../show-image-dialog/show-image-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserOptionComponent } from '../user-option/user-option.component';
import { NotificationService } from 'src/app/services/notification-service/notification.service';

@Component({
  selector: 'app-image-files-list',
  templateUrl: './image-files-list.component.html',
  styleUrls: ['./image-files-list.component.css']
})
export class ImageFilesListComponent implements OnInit {
  public  imageFiles = new MatTableDataSource<ImageFile>();
  public  selectedImageFile: ImageFile;
  public  displayedColumns: string[] = ['id', 'name', 'isStitched', 'actionsMenu'];
  private _imageBatchId: number;
  @Input()
  get imageBatchId(): number { return this._imageBatchId; }
  set imageBatchId(imageBatchId: number) {
    this._imageBatchId = imageBatchId;
    if(this._imageBatchId)
      this.loadImageFiles();
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @Output() imageFilesListChanged = new EventEmitter();


  constructor(private imageService: ImageService,
              private translate: TranslateService,
              private dialog: MatDialog,
              private notification: NotificationService) { }

  ngOnInit(): void {
  }

  loadImageFiles() {
    this.imageService.findAllImageFilesByImageBatchId(this.imageBatchId).subscribe( imageFiles => {
      this.imageFiles.data = imageFiles;
      this.imageFilesListChanged.emit();
      this.imageFiles.paginator = this.paginator;
      this.imageFiles.sort = this.sort;
      this.imageFiles.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'id':
            return item.id;
          case 'name':
            return item.name;
          case 'isStitched':
            return this.getIsStitched(item);
          default:
            return item[property];
        }
      };      
    })
  }

  onImageFileSelect(selectedImageFile: ImageFile) {
    this.dialog.open(ShowImageDialogComponent, {
      panelClass:'icon-outside',      
      width: "70%",
      height: "80%",
      disableClose: true,
      data: { 
        imageFile: selectedImageFile
      }
    });
  }

  getIsStitched(imageFile: ImageFile): string {
    return this.translate.instant( imageFile.stitched ? "Common.Yes" : "Common.No" );
  }

  onDeleteImageFile() {
    const dialogRef = this.dialog.open(UserOptionComponent,
      { 
        disableClose: true,
        data: { 
          title: this.translate.instant("ImageFilesList.DeleteImageFileUserOptionDialogTitle"),
          message:this.translate.instant("ImageFilesList.DeleteImageFileUserOptionDialogMessage"),
          okLabel: this.translate.instant("UserOptionDialog.AcceptLabel"),
          cancelLabel: this.translate.instant("UserOptionDialog.CancelLabel")
      }});

      dialogRef.afterClosed().subscribe(result => {
        if( result ) {
          this.imageService.deleteImageFileById(this.selectedImageFile.id).subscribe( () => {
            this.notification.showSuccess(this.translate.instant("ImageFilesList.DeleteImageFileSuccess"));
            this.loadImageFiles();
          });
        }
      });
  }

  onActionsMenuButonClick(event, selectedImageFile: ImageFile) {
    event.stopPropagation();
    this.selectedImageFile = selectedImageFile;
  }

  getImageFilesCount(): number {
    return this.imageFiles.data!=null? this.imageFiles.data.length : 0 ;
  }

}
