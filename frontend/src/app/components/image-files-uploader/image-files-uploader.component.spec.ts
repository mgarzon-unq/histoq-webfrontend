import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageFilesUploaderComponent } from './image-files-uploader.component';
import { HttpClient, HttpResponse, HttpEvent, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { ImageService } from 'src/app/services/image-service/image.service';
import { of, Observable } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ImageFilesUploaderComponent', () => {
  let component: ImageFilesUploaderComponent;
  let fixture: ComponentFixture<ImageFilesUploaderComponent>;
  let imageServiceMock = {
                            uploadImageFile: (batchId: number, file: File): Observable<HttpEvent<any>> => {
                              return null;
                            }  
                          };
  let notificacionServiceMock = {
                            showSuccess(message) {},
                            showError(message){}
                          };
  let imageService: ImageService;
  let notificationService: NotificationService;
  let validFiles: File[] = [{name:'a.jpg',type:'image.*',lastModified:null,size:null,stream:null,slice:null,text:null,arrayBuffer:null},
                        {name:'b.jpg',type:'image.*',lastModified:null,size:null,stream:null,slice:null,text:null,arrayBuffer:null},
                        {name:'c.jpg',type:'image.*',lastModified:null,size:null,stream:null,slice:null,text:null,arrayBuffer:null}];
  let invalidFiles: File[] = [{name:'a.jpg',type:'image.*',lastModified:null,size:null,stream:null,slice:null,text:null,arrayBuffer:null},
                        {name:'b.jpg',type:'image.*',lastModified:null,size:null,stream:null,slice:null,text:null,arrayBuffer:null},
                        {name:'c.jpg',type:'text.*',lastModified:null,size:null,stream:null,slice:null,text:null,arrayBuffer:null}];


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
          defaultLanguage: 'sp'})
      ],
      declarations: [ ImageFilesUploaderComponent ],
      providers: [
        {
          provide: ImageService,
          useValue: imageServiceMock
        },
        {
          provide: NotificationService,
          useValue: notificacionServiceMock
        }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    imageService = TestBed.inject(ImageService);
    notificationService = TestBed.inject(NotificationService);    

    fixture = TestBed.createComponent(ImageFilesUploaderComponent);
    component = fixture.componentInstance;
        
    fixture.detectChanges();
  });

  it('should create', () => {    
    expect(component).toBeTruthy();
  });

  it('should start with no selected files', () => {
    expect(component.selectedFiles.size).toEqual(0);
  });

  it('should accept valid files', () => {
    component.onSelectFiles({addedFiles: validFiles, source: null, rejectedFiles: null});    
    expect(component.selectedFiles.size).toEqual(validFiles.length);
  });

  it('should ignore invalid files', () => {
    let notificationService_showErrorSpy = spyOn(notificacionServiceMock, 'showError');
    component.onSelectFiles({addedFiles: invalidFiles, source: null, rejectedFiles: null});    
    expect(notificationService_showErrorSpy).toHaveBeenCalled();
    expect(component.selectedFiles.size).toEqual(0);
  });

  it('should upload selected files', () => {     
    component.imageBatchId = 1;
    component.onSelectFiles({addedFiles: validFiles, source: null, rejectedFiles: null});
    expect(component.selectedFiles.size).toEqual(validFiles.length);    

    let imageService_uploadImaegeFileSpy = spyOn(imageServiceMock, 'uploadImageFile')
              .and.returnValue(of(new HttpResponse({ status: 200, statusText: 'Uploaded' })));
    let notificationService_showSuccessSpy = spyOn(notificacionServiceMock, 'showSuccess');
    
    component.onUploadFiles();

    expect(imageService_uploadImaegeFileSpy).toHaveBeenCalled();
    expect(notificationService_showSuccessSpy).toHaveBeenCalled();    
  });

  it('should remove selected file', () => {    
    component.onSelectFiles({addedFiles: validFiles, source: null, rejectedFiles: null});
    expect(component.selectedFiles.size).toEqual(validFiles.length);    
    component.onRemoveFile(validFiles[1]);
    expect(component.selectedFiles.size).toEqual(validFiles.length-1);
  });
});
