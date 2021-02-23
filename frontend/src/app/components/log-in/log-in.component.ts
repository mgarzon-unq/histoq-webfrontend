import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationRequestComponent } from '../registration-request/registration-request.component';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private dialog: MatDialog) {
    this.matIconRegistry.addSvgIcon(
      "google",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/images/google.svg")
    );
   }

   ngOnInit(): void {    
    this.authenticationService.getObservableUser().subscribe((user) => {
      this.onUserStatusChange();
    });
    this.onUserStatusChange();
  }

  isUserLoggedIn(): boolean {
    return this.authenticationService.isBussinessUserLoggedIn();
  }

  signInWithGoogle(): void {
    this.authenticationService.signInWithGoogle();
  }
 
  signInWithFacebook(): void {
    this.authenticationService.signInWithFacebook();
  }
 
  signOut(): void {
    this.authenticationService.signOut();
  }
  
  getUserName(): String {    
    return this.authenticationService.getUserName();
  }

  getUserAvatar(): String {
    return this.authenticationService.getUserAvatar();
  }

  private onUserStatusChange() {
    if( this.authenticationService.isBussinessUserLoggedIn() ) this.onUserLogIn();
    else this.onUserLogOut();
  }

  private onUserLogIn() {
    this.router.navigateByUrl('home');
  }

  private onUserLogOut() {
    this.router.navigateByUrl('login');
  }

  waitingAuthorizationServerResponse(): boolean {
    return this.authenticationService.waitingAuthorizationServerResponse();
  }
  
  accessRequest() {
    this.dialog.open(RegistrationRequestComponent, {
      width:'40%',
      panelClass:'icon-outside',
      disableClose: true
    });    
  }

}
