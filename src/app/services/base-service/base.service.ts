import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../notification-service/notification.service';
import { HttpError } from '../http/http-error';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class BaseService{
  constructor(protected translate: TranslateService,
              protected notificationService: NotificationService) { }

  protected buildRequestURL(request: string): string {
    return `${request + this.language()}`;
  }
  
  protected ifErrorNotify(observable: Observable<any>, message: String, result?: any): Observable<any> {
    return observable.pipe(catchError(this.handleError(message, result)));
  }
    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param localMessage - locally built error message
   * @param result - optional value to return as the observable result
   */
  protected handleError<T> (localMessage: String, result?: T) {
    return (error: any): Observable<T> => {

      //console.error(error); 

      if( error instanceof HttpErrorResponse ) {
        switch( error.status )
        {
          case HttpError.NotFound:            
            break;
          case HttpError.Forbidden:
          default:
            this.notificationService.showError( localMessage + "</br>" + error.error );
        }
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private language(): String {
    return "?lang=" + this.translate.currentLang;    
  }

}