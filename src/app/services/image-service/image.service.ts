import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Image } from 'src/app/model/image';
import { ImageFile } from 'src/app/model/image-file';
import { ImageBatch } from '../../model/image-batch';
import { NotificationService } from '../notification-service/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseService } from '../base-service/base.service';
import { FileFormat } from 'src/app/model/file-format';

@Injectable({
  providedIn: 'root'
})
export class ImageService extends BaseService {

  private api_findAllImageBatches = environment.imageBatchesApiEndPoint;
  private api_findImageBatchById = environment.imageBatchesApiEndPoint + '/';
  private api_findAllImageFilesByImageBatchId = environment.imageFilesApiEndPoint + '/';
  private api_findAllImagesByImageBatchId = environment.imagesApiEndPoint + '/';
  private api_downloadImageFile = environment.imageFileApiEndPoint + '/';
  private api_downloadImage = environment.imageApiEndPoint + '/';
  private api_downloadImagePreview = environment.imageApiEndPoint + '/preview/';
  private api_uploadImageFile = environment.imageFilesApiEndPoint + '/';
  private api_updateImageFile = environment.imageFilesApiEndPoint + '/';  
  private api_createImageBatch = environment.imageBatchesApiEndPoint + '/';
  private api_processImageBatch = environment.imageBatchesApiEndPoint + '/process/';
  private api_findAllDefaultProcessingParameters = environment.imageBatchesApiEndPoint + '/processing-default-parameters/';
  private api_findImageBatchesExportableData = environment.imageBatchesDataExportApiEndPoint;
  private api_findAllExportableDataFileFormats = environment.imageBatchesDataExportApiEndPoint + '/file-formats/';
  private api_deleteImageBatchById = environment.imageBatchesApiEndPoint + '/';
  private api_deleteImageFileById = environment.imageFileApiEndPoint + '/';

  constructor(protected http: HttpClient,
              protected translate: TranslateService,
              protected notificationService: NotificationService) {
    super(translate,notificationService);
  }

  findAllImageBatches(): Observable<ImageBatch[]> {
    const url = this.buildRequestURL(this.api_findAllImageBatches);
    return this.ifErrorNotify(this.http.get<ImageBatch[]>(url),
                              this.translate.instant('ImageService.FindAllImageBatches-Error'),
                              new Array());
  }

  findImageBatchById(batchId: number): Observable<ImageBatch> {
    const url = this.buildRequestURL(this.api_findImageBatchById + batchId);
    return this.ifErrorNotify(this.http.get<ImageBatch>(url),
                              this.translate.instant('ImageService.FindImageBatchById-Error',{batchId:batchId}));
  }

  findAllImageFilesByImageBatchId(batchId: number): Observable<ImageFile[]> {
    const url = this.buildRequestURL(this.api_findAllImageFilesByImageBatchId + batchId);
    return this.ifErrorNotify(this.http.get<ImageFile[]>(url),
                              this.translate.instant('ImageService.FindAllImageFilesByImageBatchId-Error',{batchId:batchId}),
                              new Array());
  }

  findAllImagesByImageBatchId(batchId: number): Observable<Image[]> {
    const url = this.buildRequestURL(this.api_findAllImagesByImageBatchId + batchId);
    return this.ifErrorNotify(this.http.get<Image[]>(url),
                              this.translate.instant('ImageService.FindAllImagesByImageBatchId-Error',{batchId:batchId}),
                              new Array());
  }

  findAllDefaultProcessingParameters(): Observable<Map<string,string>> {
    const url = this.buildRequestURL(this.api_findAllDefaultProcessingParameters);
    return this.ifErrorNotify(this.http.get<Map<string,string>>(url),
                              this.translate.instant('ImageService.FindAllDefaultProcessingParameters-Error'),
                              null);
  }

  findAllExportableDataFileFormats(): Observable<FileFormat[]> {
    const url = this.buildRequestURL(this.api_findAllExportableDataFileFormats);
    return this.ifErrorNotify(this.http.get<FileFormat[]>(url),
                              this.translate.instant('ImageService.FindAllExportableDataFileFormats-Error'),
                              new Array());
  }

  findImageBatchesExportableData(imageBatchesIds: number[], fileFormat: FileFormat): Observable<any> {
    const url = this.buildRequestURL(this.api_findImageBatchesExportableData);
    var queryParams: HttpParams = new HttpParams()
                                .set('imageBatchesIds', JSON.stringify(imageBatchesIds))
                                .set('fileFormat', JSON.stringify(fileFormat));
    return this.ifErrorNotify(this.http.get(url, { params: queryParams, responseType: 'blob' }),
                              this.translate.instant('ImageService.FindImageBatchesExportableData-Error'));
  }

  createImageBatch(imageBatch: ImageBatch): Observable<ImageBatch> {
    const url = this.buildRequestURL(this.api_createImageBatch);
    return this.ifErrorNotify(this.http.post<ImageBatch>(url,imageBatch),
                              this.translate.instant('ImageService.CreateImageBatch-Error'));
  }

  processImageBatch(imageBatchId: number): Observable<Image[]> {
    const url = this.buildRequestURL(this.api_processImageBatch + imageBatchId);
    return this.ifErrorNotify(this.http.post<Image[]>(url,null), 
                              this.translate.instant('ImageService.ProcessImageBatch-Error'),
                              new Array());
  }

  deleteImageBachById(batchId: number) {
    const url = this.buildRequestURL(this.api_deleteImageBatchById + batchId);
    return this.ifErrorNotify(this.http.delete(url),
                                this.translate.instant('ImageService.DeleteImageBatch-Error'));
  }

  uploadImageFile(batchId: number, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', this.buildRequestURL(this.api_uploadImageFile + batchId), formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  updateImageFile(imageFile: ImageFile): Observable<ImageFile> {
    const url = this.buildRequestURL(this.api_updateImageFile);
    return this.ifErrorNotify(this.http.put<ImageFile>(url,imageFile), 
                              this.translate.instant('ImageService.UpdateImageFile-Error'),
                              null);
  }

  deleteImageFileById(fileId: number) {
    const url = this.buildRequestURL(this.api_deleteImageFileById + fileId);
    return this.ifErrorNotify(this.http.delete(url),
                                this.translate.instant('ImageService.DeleteImageFile-Error'));
  }

  getImageFileURL(imageFile: ImageFile): string {
    return this.buildRequestURL(this.api_downloadImageFile + imageFile.id);
  }

  getImageURL(image: Image): string {
    return this.buildRequestURL(this.api_downloadImage + image.id);
  }

  getImagePreviewURL(imageFile: ImageFile): string {
    return this.buildRequestURL(this.api_downloadImagePreview + imageFile.id + "/" + Math.random().toString());
  }

}
