import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Image } from 'src/app/model/image';
import { MatDialog } from '@angular/material/dialog';
import { ImageService } from 'src/app/services/image-service/image.service';
import { TranslateService } from '@ngx-translate/core';
import { ShowImageDialogComponent } from '../show-image-dialog/show-image-dialog.component';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProcessJobStatusComponent } from '../process-job-status/process-job-status.component';

@Component({
  selector: 'app-images-list',
  templateUrl: './images-list.component.html',
  styleUrls: ['./images-list.component.css']
})
export class ImagesListComponent implements OnInit {
  public images = new MatTableDataSource<Image>();
  public  displayedColumns: string[] = ['id', 'name', 'measurementUnit', 'measurementFactor', 
                                        'totalArea', 'totalTissueArea', 'viableTissueArea', 
                                        'necroticTissueArea', 'necroticTissuePercentage'];  
  public processing: boolean = false;
  private _imageBatchId: number;
  @Input()
  get imageBatchId(): number { return this._imageBatchId; }
  set imageBatchId(imageBatchId: number) {
    this._imageBatchId = imageBatchId;
    if(this._imageBatchId)
      this.loadImages();
  }  
  private imageFilesListCount: number = 0;

  @Output() processFinished = new EventEmitter();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor(private imageService: ImageService,
              private translate: TranslateService,
              private dialog: MatDialog,
              private notificationService: NotificationService) { }
  
  ngOnInit(): void {    
  }

  loadImages() {
    this.imageService.findAllImagesByImageBatchId(this.imageBatchId).subscribe( images => {
        this.setImages(images);
      }
    );
  }

  getMeasurementUnit(image: Image): string {
    return (image.scaleValue?image.scaleValue.toString():"???") + " " + image.measurementUnit;
  }

  getTotalArea(image: Image): string {
    return this.formatArea(image.totalArea, image.measurementFactor, image.measurementUnit);
  }

  getTotalTissueArea(image: Image): string {
    return this.formatArea(image.totalTissueArea, image.measurementFactor, image.measurementUnit);
  }

  getViableTissueArea(image: Image): string {
    return this.formatArea(image.viableTissueArea, image.measurementFactor, image.measurementUnit);
  }

  getNecroticTissueArea(image: Image): string {
    return this.formatArea(image.necroticTissueArea, image.measurementFactor, image.measurementUnit);
  }

  getNecroticTissuePercentage(image: Image): number {
    return (image.necroticTissueArea*100)/(image.viableTissueArea+image.necroticTissueArea);
  }

  onRunBatchProcess() {
    this.processing = true;
    this.imageService.processImageBatch(this.imageBatchId).subscribe( newProcessJob => {

      const dialogRef = this.dialog.open(ProcessJobStatusComponent,
        { width:'65%',
          height:'45%',
          disableClose: true,
          data: { 
            processJob: newProcessJob
          }
        });
  
      dialogRef.afterClosed().subscribe(result => {
        this.imageService.findAllImagesByImageBatchId(this.imageBatchId).subscribe( images => {
          this.setImages(images);
          this.processing = false;
          this.processFinished.emit();
          if( result && images && images.length > 0 )
            this.notificationService.showSuccess(this.translate.instant('ImageList.NotificationProcessSuccess'));
        });
      });
    });
  }

  onImageSelect(selectedImage: Image) {
    this.dialog.open(ShowImageDialogComponent, {
      panelClass:'icon-outside',
      disableClose: true,
      data: { 
        image: selectedImage
      }
    });
  }

  formatArea(area: number, measurementFactor: number, measurementUnit: string): string {
    return (area*(Math.pow(measurementFactor,2))).toLocaleString(undefined, {maximumFractionDigits: 0}) 
    + " " + measurementUnit + "²";
  }

  hasImages(): boolean {
    return this.images.data && this.images.data.length>0;
  }

  private setImages(images: Image[]) {
    this.images.data = images;    
    this.images.paginator = this.paginator;
    this.images.sort = this.sort;
    this.images.sortingDataAccessor = (item, property) => {
      switch(property) {
      case 'id':
        return item.id;
      case 'name':
        return item.name;
      case 'totalArea':
        return this.getTotalArea(item);
      case 'totalTissueArea':
        return this.getTotalTissueArea(item);
      case 'viableTissueArea':
        return this.getViableTissueArea(item);
      case 'necroticTissueArea':
        return this.getNecroticTissueArea(item);
      case 'necroticTissuePercentage':
        return this.getNecroticTissuePercentage(item);
      default:
        return item[property];
      }
    }
  }

  disableProcessButton(): boolean {
    return !(this.imageFilesListCount>0);
  }

  onImageFilesListChanged(imageFilesListCount: number) {
    this.imageFilesListCount = imageFilesListCount;
    this.loadImages();    
  }

}
