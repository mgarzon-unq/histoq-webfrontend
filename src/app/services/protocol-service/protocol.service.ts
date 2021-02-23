import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Protocol } from 'src/app/model/protocol';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../notification-service/notification.service';
import { BaseService } from '../base-service/base.service';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService extends BaseService {
  
  private api_findAllProtocolsContaining  = environment.protocolsApiEndPoint + '/';
    
  constructor(private http: HttpClient,
    protected translate: TranslateService,
    protected notificationService: NotificationService) { 
      super(translate,notificationService);
  }

  findAllProtocolsContaining(searchKey: string): Observable<Protocol[]> {
    const url = this.buildRequestURL(this.api_findAllProtocolsContaining+searchKey);
    return this.ifErrorNotify(this.http.get<Protocol[]>(url),
                  this.translate.instant("ProtocolService.FindAllProtocolsLike-Error"),
                  new Array());
  }

}
