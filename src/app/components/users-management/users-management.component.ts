import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UsersManagementComponent>) { }

  ngOnInit(): void {
  }

}
