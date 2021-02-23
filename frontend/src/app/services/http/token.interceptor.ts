import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { Observable } from 'rxjs';
import { RootApiEndPoint } from '../../../environments/environment';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
    var customRequest: HttpRequest<any>;
    var currenProvider = this.authenticationService.getSocialUserProvider();
    var currentToken = this.authenticationService.getSocialUserToken();
    
    //if it is a request for the Backend API and there is a logged social user...
    if( request.url.includes(RootApiEndPoint)  &&
        currentToken != null  ) {      // add the authorization token to the request...  
      customRequest = request.clone( { headers: request.headers.set( 'Authorization', `${currenProvider + "," + currentToken}` ) } ); 
    }
    else
      customRequest = request;

    return next.handle(customRequest);
  }
  
}