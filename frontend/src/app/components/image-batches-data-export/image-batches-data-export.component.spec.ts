import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageBatchesDataExportComponent } from './image-batches-data-export.component';
import { FileFormat } from 'src/app/model/file-format';
import { Observable, of } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { ImageService } from 'src/app/services/image-service/image.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ImageBatchesDataExportComponent', () => {
  let component: ImageBatchesDataExportComponent;
  let fixture: ComponentFixture<ImageBatchesDataExportComponent>;
  let imageServiceMock = {
    findImageBatchesExportableData(imageBatchesIds: number[], fileFormat: FileFormat): Observable<any> {
      return null;
    },
    findAllExportableDataFileFormats(): Observable<FileFormat[]> {
      return null;
    }
  };
  let notificacionServiceMock = {
    showSuccess(message) {},
    showError(message){}
  };
  let imageService: ImageService;
  let notificationService: NotificationService;
  let imageService_findAllExportableDataFileFormatsSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
          },
          defaultLanguage: 'sp'}),
        MatDialogModule
      ],      
      declarations: [ ImageBatchesDataExportComponent ],      
      providers: [
        {
          provide: ImageService,
          useValue: imageServiceMock
        },
        {
          provide: NotificationService,
          useValue: notificacionServiceMock
        },
        {
          provide : MatDialogRef, 
          useValue : {}
        },
        {
          provide: MAT_DIALOG_DATA, 
          useValue: {} 
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    imageService = TestBed.inject(ImageService);
    notificationService = TestBed.inject(NotificationService); 

    imageService_findAllExportableDataFileFormatsSpy = spyOn(imageServiceMock, 'findAllExportableDataFileFormats')
              .and.returnValue(of(Array()));

    fixture = TestBed.createComponent(ImageBatchesDataExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should export data', () => {
    component.data.imageBatchesIds = [1,2,3];
    component.selectedFileFormat = {id:1,name:'csv',contentType:'text/csv',extension:'csv'};

    let imageService_findImageBatchesExportableDataSpy = spyOn(imageServiceMock, 'findImageBatchesExportableData')
              .and.returnValue(of(null));
    let notificationService_showSuccessSpy = spyOn(notificacionServiceMock, 'showSuccess');

    component.onExportData();

    expect(imageService_findImageBatchesExportableDataSpy).toHaveBeenCalled();
    expect(notificationService_showSuccessSpy).toHaveBeenCalled();
  });


});
