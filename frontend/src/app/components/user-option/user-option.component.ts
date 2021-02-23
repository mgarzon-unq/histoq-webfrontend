import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class UserOpionDialogData {
  title: string;
  message: string;
  okLabel: string;
  cancelLabel: string;
}

@Component({
  selector: 'app-user-option',
  templateUrl: './user-option.component.html',
  styleUrls: ['./user-option.component.css']
})
export class UserOptionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UserOptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserOpionDialogData) { }

  ngOnInit(): void {
  }

}
