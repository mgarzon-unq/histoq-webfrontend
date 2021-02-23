import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { UserRegistrationRequest } from 'src/app/model/user-registration-request';
import { MatDialog } from '@angular/material/dialog';
import { UsersManagementComponent } from '../users-management/users-management.component';

@Component({
  selector: 'app-users-management-button',
  templateUrl: './users-management-button.component.html',
  styleUrls: ['./users-management-button.component.css']
})
export class UsersManagementButtonComponent implements OnInit {
  private pendingRegistrationRequests: UserRegistrationRequest[];

  constructor(private userService: UserService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadPendingUserReistrationRequests();  
  }

  loadPendingUserReistrationRequests() {
    this.userService.findPendingRegistrationRequests().subscribe( requests => {
      this.pendingRegistrationRequests = requests;
    })
  }

  onUserManagement() {
    const dialogRef = this.dialog.open(UsersManagementComponent, {
      width:'80%',
      height:'70%',
      panelClass:'icon-outside',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadPendingUserReistrationRequests();
    });
  }

  getPendingNotifications(): number {
    return  this.pendingRegistrationRequests ?
            this.pendingRegistrationRequests.length :
            0;
  }

}
