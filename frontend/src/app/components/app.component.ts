import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { UserService } from '../services/user-service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private translate: TranslateService,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
    this.initializeLanguages();
  }

  ngOnInit(): void {
    this.authenticationService.setUserService(this.userService);
  }

  private initializeLanguages() {
    this.translate.addLangs(['sp','en','pr']);
    this.translate.setDefaultLang('sp');
    this.translate.use('sp');
  }

  public isLoggedBussinessUserAdmin(): boolean {
    return this.authenticationService.isLoggedBussinessUserAdmin();
  }

  
}
