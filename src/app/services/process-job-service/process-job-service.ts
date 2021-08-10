import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../notification-service/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseService } from '../base-service/base.service';
import { ProcessJob } from 'src/app/model/process-job';

@Injectable({
  providedIn: 'root'
})
export class ProcessJobService extends BaseService {

  private api_findProcessJobById = environment.processJobsApiEndPoint + '/';

  constructor(protected http: HttpClient,
              protected translate: TranslateService,
              protected notificationService: NotificationService) {
    super(translate,notificationService);
  }

  findProcessJobById(jobId: number): Observable<ProcessJob> {
    const url = this.buildRequestURL(this.api_findProcessJobById + jobId);
    return this.ifErrorNotify(this.http.get<ProcessJob>(url),
                              this.translate.instant('ProcessJobService.FindProcessJobById-Error',{jobId:jobId}));
  }

}