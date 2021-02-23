import { Component, OnInit } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { UserService } from 'src/app/services/user-service/user.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { TranslateService } from '@ngx-translate/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { UserRegistrationRequest } from 'src/app/model/user-registration-request';
import { InputErrorStateMatcher } from '../common/input-error-state-matcher';


@Component({
  selector: 'app-registration-request',
  templateUrl: './registration-request.component.html',
  styleUrls: ['./registration-request.component.css']
})
export class RegistrationRequestComponent implements OnInit {
  message: string = "";
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  firstNameFormControl = new FormControl('', [
    Validators.required
  ]);
  lastNameFormControl = new FormControl('', [
    Validators.required
  ]);
  matcher = new InputErrorStateMatcher();


  constructor(private recaptchaV3Service: ReCaptchaV3Service,
              private userService: UserService,
              private notificationService: NotificationService,
              private translate: TranslateService) { }

  ngOnInit(): void {
  }

  onRequestRegistration(): void {
    this.requestRegistration();
  }

  disableRequestRegistraion(): boolean {
    return  this.firstNameFormControl.hasError('required') ||
            this.lastNameFormControl.hasError('required') ||
            this.emailFormControl.hasError('required') || 
            this.emailFormControl.hasError('email');
  }

  requestRegistration(): void {
    this.recaptchaV3Service.execute('requestUserRegistration')
      .subscribe(
        (token) => {          
          var userRegistrationRequest = new UserRegistrationRequest();
          userRegistrationRequest.firstName = this.firstNameFormControl.value;
          userRegistrationRequest.lastName = this.lastNameFormControl.value;
          userRegistrationRequest.socialId = this.emailFormControl.value;
          userRegistrationRequest.message = this.message;
          
          this.userService.createRegistrationRequest(userRegistrationRequest,token).subscribe( request => {
              if( request != null )
                this.notificationService.showSuccess(this.translate.instant('RegistrationRequestDialog.RequestSuccess'));
            });
        },
        (error) => {
          this.notificationService.showError(this.translate.instant('RegistrationRequestDialog.ReCaptchaError',{errorMessage:error.error}));
        }
    );
  }

}
