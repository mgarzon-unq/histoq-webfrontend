import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ImageService } from 'src/app/services/image-service/image.service';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ImageBatchComponent } from '../image-batch/image-batch.component';
import { ImageBatch } from 'src/app/model/image-batch';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ImageBatchesDataExportComponent } from '../image-batches-data-export/image-batches-data-export.component';
import { UserOptionComponent } from '../user-option/user-option.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-image-batch-list',
  templateUrl: './image-batch-list.component.html',
  styleUrls: ['./image-batch-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ImageBatchListComponent implements OnInit {
actionsMenu
  public displayedColumns: string[];
  imageBatches = new MatTableDataSource<ImageBatch>();
  selection = new SelectionModel<ImageBatch>(true, []);
  selectedImageBatch: ImageBatch;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private imageService: ImageService,
              private dialog: MatDialog,
              private translate: TranslateService,
              private notification: NotificationService,
              private authenticationService: AuthenticationService ) { }

  ngOnInit(): void {
    if( this.isLoggedBussinessUserAdmin() )
      this.displayedColumns = ['select', 'id', 'date', 'user', 'protocol', 'fileCount', 'actionsMenu'];
    else
      this.displayedColumns = ['select', 'id', 'date', 'protocol', 'fileCount', 'actionsMenu'];
    this.loadImageBatches();
  }

  loadImageBatches() {
    this.imageService.findAllImageBatches().subscribe( imageBatches => {
      this.imageBatches.data = imageBatches;
      this.imageBatches.paginator = this.paginator;
      this.imageBatches.sort = this.sort;
      this.imageBatches.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'id':
            return item.id;          
          case 'user':
            return this.getUser(item);
          case 'protocol':
            return this.getIndividualLabel(item);
          default:
            return item[property];
        }
      };
    })
  }

  getImageBatchDate(imageBatch: ImageBatch): string {
    return formatDate( imageBatch.date,
                        this.translate.instant('Common.DateTimeFormatTemplate'),
                        this.translate.instant('Common.DateTimeFormatLocale'));
  }

  getUser(imageBatch: ImageBatch): string {
    return imageBatch.userFirstName + " " + imageBatch.userLastName + " (" + imageBatch.userEmail + ")";
  }

  getIndividualLabel(imageBatch: ImageBatch): string {
    return imageBatch.individualFullyQualifiedLabel;
  }

  getImageFileCount(imageBatch: ImageBatch): string {    
    return imageBatch.fileCount.toString();
  }

  onItemSelect(imageBatch: ImageBatch) {
    this.manageImageBatch(imageBatch);
  }

  onNewImageBatch() {
    this.manageImageBatch(new ImageBatch);
  }

  manageImageBatch(imageBatch: ImageBatch) {
    const dialogRef = this.dialog.open(ImageBatchComponent,
      { width:'95%',
        height:'80%',
        disableClose: true,
        data: { 
        imageBatch: imageBatch
      }});

      dialogRef.afterClosed().subscribe(result => {
        this.loadImageBatches();
      });    
  }

  onExportSelectedImageBatches() {
    this.exportImageBatches(this.selection.selected.map(batch=>batch.id));
  }

  onExportSelectedImageBatch() {    
    this.exportImageBatches([this.selectedImageBatch.id]);
  }

  exportImageBatches(imageBatchesIds: number[]) {
    const dialogRef = this.dialog.open(ImageBatchesDataExportComponent,
      { 
        disableClose: true,
        data: { 
          imageBatchesIds: imageBatchesIds
      }});
  }

  onDeleteImageBatch() {
    const dialogRef = this.dialog.open(UserOptionComponent,
      { 
        disableClose: true,
        data: { 
          title: this.translate.instant("ImageBatchesList.DeleteImageBatchUserOptionDialogTitle"),
          message:this.translate.instant("ImageBatchesList.DeleteImageBatchUserOptionDialogMessage"),
          okLabel: this.translate.instant("UserOptionDialog.AcceptLabel"),
          cancelLabel: this.translate.instant("UserOptionDialog.CancelLabel")
      }});

      dialogRef.afterClosed().subscribe(result => {
        if( result ) {
          this.imageService.deleteImageBachById(this.selectedImageBatch.id).subscribe( () => {
            this.notification.showSuccess(this.translate.instant("ImageBatchesList.DeleteImageBatchSuccess"));
            this.loadImageBatches();
          });
        }
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.imageBatches.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.imageBatches.data.forEach(row => this.selection.select(row));
  }

  onActionsMenuButonClick(event, selectedImageBatch: ImageBatch) {
    event.stopPropagation();
    this.selectedImageBatch = selectedImageBatch;
  }
  
  isLoggedBussinessUserAdmin(): boolean {
    return this.authenticationService.isLoggedBussinessUserAdmin();
  }

  getImageBatchListTitle(): string {
    return  this.isLoggedBussinessUserAdmin() ? 
            this.translate.instant('ImageBatchesList.AdministratorTitle') :
            this.translate.instant('ImageBatchesList.Title');
  }

}
