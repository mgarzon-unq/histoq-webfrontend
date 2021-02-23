import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { InputErrorStateMatcher } from '../common/input-error-state-matcher';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {

  firstNameFormControl: FormControl;
  lastNameFormControl: FormControl;
  emailFormControl: FormControl;
  matcher = new InputErrorStateMatcher();

  constructor(public dialogRef: MatDialogRef<UserDataComponent>,
             @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {    
    this.firstNameFormControl = new FormControl( {value: this.data.user.firstName, disabled: !this.data.allowChange},
      [
        Validators.required
      ]);
    this.lastNameFormControl = new FormControl( {value: this.data.user.lastName, disabled: !this.data.allowChange},
      [
        Validators.required
      ]);
    this.emailFormControl = new FormControl( {value: this.data.user.email, disabled: !this.data.allowChange},
      [
        Validators.required,
        Validators.email,
      ]);
  }  

  disableOkButton(): boolean {
    return  !this.data.allowChange ||
            this.firstNameFormControl.hasError('required') ||
            this.lastNameFormControl.hasError('required') ||
            this.emailFormControl.hasError('required') || 
            this.emailFormControl.hasError('email');
  }

  onOkButton() {
    this.data.user.firstName  = this.firstNameFormControl.value;
    this.data.user.lastName   = this.lastNameFormControl.value;
    this.data.user.email      = this.emailFormControl.value;
  }

}
