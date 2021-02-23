import { Injectable } from '@angular/core';
import { BaseService } from '../base-service/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../notification-service/notification.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { UserRegistrationRequest } from 'src/app/model/user-registration-request';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  private api_findUserBySocialId = environment.usersApiEndPoint + "/";
  private api_findAllUsers = environment.usersApiEndPoint;
  private api_createUser = environment.usersApiEndPoint;
  private api_changeUser = environment.usersApiEndPoint;
  private api_createRegistrationRequest = environment.usersApiEndPoint + "/registration-requests";
  private api_acceptRegistrationRequest = environment.usersApiEndPoint + "/registration-requests";
  private api_rejectRegistrationRequest = environment.usersApiEndPoint + "/registration-requests/";
  private api_findPendingRegistrationRequests = environment.usersApiEndPoint + "/registration-requests";

  constructor(protected http: HttpClient,
    protected translate: TranslateService,
    protected notificationService: NotificationService) {
    super(translate,notificationService);
  }

  findUserBySocialId(socialId: string): Observable<User> {
    const url = this.buildRequestURL(this.api_findUserBySocialId + socialId);
    return this.ifErrorNotify(this.http.get<User>(url),
                              this.translate.instant('UserService.FindUserBySocialId-Error',{socialId:socialId}));
  }

  createUser(user: User): Observable<User> {
    const url = this.buildRequestURL(this.api_createUser);
    return this.ifErrorNotify(this.http.post<User>(url,user),
                              this.translate.instant('UserService.CreateUser-Error'));
  }

  changeUser(user: User): Observable<User> {
    const url = this.buildRequestURL(this.api_changeUser);
    return this.ifErrorNotify(this.http.put<User>(url,user),
                              this.translate.instant('UserService.ChangeUser-Error'));
  }

  findAllUsers(): Observable<User[]> {
    const url = this.buildRequestURL(this.api_findAllUsers);
    return this.ifErrorNotify(this.http.get<User[]>(url),
                              this.translate.instant('UserService.FindAllUsers-Error'),
                              new Array());
  }

  findPendingRegistrationRequests(): Observable<UserRegistrationRequest[]> {
    const url = this.buildRequestURL(this.api_findPendingRegistrationRequests);
    return this.ifErrorNotify(this.http.get<UserRegistrationRequest[]>(url),
                              this.translate.instant('UserService.FindPendingRegistrationRequests-Error'),
                              new Array());
  }

  createRegistrationRequest(userRegistrationRequest: UserRegistrationRequest, token: string): Observable<UserRegistrationRequest> {
    const url = this.buildRequestURL(this.api_createRegistrationRequest);
    var postParams: HttpParams = new HttpParams().set('reCaptchaToken', token);
    return this.ifErrorNotify(this.http.post<UserRegistrationRequest>(url,userRegistrationRequest,{params: postParams}),
                              this.translate.instant('UserService.CreateRegistrationRequest-Error',{socialId: userRegistrationRequest.socialId})); 
  }

  acceptUserRegistrationRequest(userRegistrationRequest: UserRegistrationRequest): Observable<User> {
    const url = this.buildRequestURL(this.api_acceptRegistrationRequest);
    return this.ifErrorNotify(this.http.put<User>(url,userRegistrationRequest),
                              this.translate.instant('UserService.AcceptRegistrationRequest-Error',{socialId: userRegistrationRequest.socialId}),
                              null); 
  }

  rejectRegistrationRequest(userRegistrationRequest: UserRegistrationRequest): Observable<UserRegistrationRequest> {
    const url = this.buildRequestURL(this.api_rejectRegistrationRequest + userRegistrationRequest.id.toString() );
    return this.ifErrorNotify(this.http.delete<UserRegistrationRequest>(url),
                              this.translate.instant('UserService.RejectRegistrationRequest-Error',{socialId: userRegistrationRequest.socialId}),
                              null); 
  }
}
