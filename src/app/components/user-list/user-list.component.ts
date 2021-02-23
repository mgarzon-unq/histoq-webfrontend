import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/model/user';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from 'src/app/services/user-service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDataComponent } from '../user-data/user-data.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public  displayedColumns: string[] = [ 'name', 'socialId', 'isAdmin', 'status' ];
  public  users = new MatTableDataSource<User>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private translate: TranslateService,
              private userService: UserService,
              private dialog: MatDialog,
              private authenticationService: AuthenticationService,
              private notifications: NotificationService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.findAllUsers().subscribe( users => {
      this.users.data = users;
      this.users.paginator = this.paginator;
      this.users.sort = this.sort;
      this.users.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'name':
            return this.getUserName(item);
          case 'socialId':
            return this.getUserSocialId(item);
          case 'isAdmin':
            return this.getUserIsAdministrator(item);
          case 'status':
            return this.getUserStatus(item);
          default:
            return item[property];
        }
      };
    })
  }

  getUserName(user: User): string {
    return user.firstName + " " + user.lastName;
  }

  getUserSocialId(user: User): string {
    return user.email;
  }

  getUserStatus(user: User): string {
    return this.translate.instant(user.active?"Common.Enabled":"Common.Disabled");
  }

  getUserIsAdministrator(user: User): string {
    return this.translate.instant(user.admin?"Common.Yes":"Common.No");
  }

  onUserSelected(user: User) {
    let editableUser = Object.assign({}, user);
    
    const dialogRef = this.dialog.open(UserDataComponent, {
      panelClass:'icon-outside',
      disableClose: true,
      data: { 
        user: editableUser,
        allowChange: this.authenticationService.getUserSocialId()!=this.getUserSocialId(user),
        okButtonLabel: this.translate.instant("UserData.ChangeUserLabel")
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if( result ) {
        this.userService.changeUser(editableUser).subscribe( changedUser => {
          if( changedUser != null ) {
            this.notifications.showSuccess(this.translate.instant("UserData.UserSuccessfullyChanged",{socialId:editableUser.email}));
            this.loadUsers();
          }
        });
      }
    });
  }

  onAddNewUser() {
    let editableUser = new User();
    
    const dialogRef = this.dialog.open(UserDataComponent, {
      panelClass:'icon-outside',
      disableClose: true,
      data: { 
        user: editableUser,
        allowChange: true,
        okButtonLabel: this.translate.instant("UserData.CreateUserLabel")
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if( result ) {
        this.userService.createUser(editableUser).subscribe( newUser => {
          if( newUser != null ) {
            this.notifications.showSuccess(this.translate.instant("UserData.UserSuccessfullyCreated",{socialId:editableUser.email}));
            this.loadUsers();
          }
        });
      }
    });
  }



}
