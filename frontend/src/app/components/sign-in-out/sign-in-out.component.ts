import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in-out',
  templateUrl: './sign-in-out.component.html',
  styleUrls: ['./sign-in-out.component.css']
})
export class SignInOutComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, 
              private router: Router) { 
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
    this.onUserLogOut();
  }

  private onUserLogOut() {
    this.router.navigateByUrl('login');
  }

}
