import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser  } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/model/user';
import { UserService } from '../user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  private socialUser: SocialUser;
  private observableUser = new Subject<User>();
  private loggedUser: User;
  private waitingAuthServerResponse: boolean = false;
  private userService: UserService;
  
  constructor(private authService: SocialAuthService) {}
  
  public isSocialUserLoggedIn(): boolean {
    return (this.socialUser != null);
  }

  public isBussinessUserLoggedIn(): boolean {
    return (this.loggedUser != null);
  }
  
  public signInWithGoogle(): void {
    this.signOut();
    this.waitingAuthServerResponse = true;
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).catch( 
      (error) => {
        this.signOut();
      }
    );
  }
 
  public signInWithFacebook(): void {
    this.signOut();
    this.waitingAuthServerResponse = true;
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).catch( 
      (error) => {        
        this.signOut();
      }
    );
  }
 
  public signOut(): void {
    if(this.isSocialUserLoggedIn()) {
      this.authService.signOut().catch( 
        (error) => {
        }
      );
    }
    this.waitingAuthServerResponse = false;
  }

  public getSocialUserProvider(): string {
    return this.isSocialUserLoggedIn() ? this.socialUser.provider : null;
  }

  public getSocialUserToken(): string {
    return this.isSocialUserLoggedIn() ? this.getToken(this.socialUser) : null;
  }

  public getUserName(): String {    
    return this.isBussinessUserLoggedIn() ? this.loggedUser.firstName : "" ;
  }

  public getUserAvatar(): String {
    return this.isBussinessUserLoggedIn() ? this.loggedUser.avatar : "" ;
  }

  public getUserSocialId(): String {
    return this.isBussinessUserLoggedIn() ? this.loggedUser.email : "" ;
  }

  public isLoggedBussinessUserAdmin(): boolean {
    return this.isBussinessUserLoggedIn() ? this.loggedUser.admin : false;
  }

  public setUserService(userService: UserService) {
    this.followUserState(userService);
  }

  public getObservableUser(): Observable<User> {    
    return this.observableUser.pipe();
  }

  public waitingAuthorizationServerResponse(): boolean {
    return this.waitingAuthServerResponse;
  }

  private followUserState(userService: UserService) {
    this.userService = userService;

    this.authService.authState.subscribe((user) => {      
      if( user != null )
        this.onUserLogIn(user);
      else
        this.onUserLogOut();              
    });
  }

  private onUserLogIn(user: SocialUser) {
    this.socialUser = user;

    this.userService.findUserBySocialId(user.email).subscribe( businessUser => {
      if( businessUser != null )
        this.onBusinessUserAuthenticated(businessUser);
      else
        this.onUserLogOut();      
    })    
  }

  private onBusinessUserAuthenticated(user: User) {
    this.loggedUser = user;
    this.loggedUser.avatar = this.getAvatarUrl(this.socialUser);
    this.loggedUser.provider = user.provider;
    this.loggedUser.token = this.getToken(this.socialUser);
    localStorage.setItem("user",JSON.stringify(this.loggedUser));
    this.observableUser.next(this.loggedUser);
    this.waitingAuthServerResponse = false;
  }

  private onUserLogOut() {
    this.socialUser = null;
    this.loggedUser = null;
    localStorage.removeItem("user");
    this.observableUser.next(null);
    this.waitingAuthServerResponse = false;
  }

  private getToken(socialUser: SocialUser): string {
    switch(socialUser.provider) {
      case GoogleLoginProvider.PROVIDER_ID: return socialUser.idToken;
      case FacebookLoginProvider.PROVIDER_ID: return socialUser.authToken;
    }
    return null;
  }

  private getAvatarUrl(socialUser: SocialUser): string {
    switch(socialUser.provider) {
      case GoogleLoginProvider.PROVIDER_ID: 
            return socialUser.photoUrl;
      case FacebookLoginProvider.PROVIDER_ID: 
            return socialUser.response.picture.data.url;
    }
    return null;    
  }

}
