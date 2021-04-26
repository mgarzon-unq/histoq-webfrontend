import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { UserRegistrationRequest } from 'src/app/model/user-registration-request';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from 'src/app/services/user-service/user.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-registration-request-list',
  templateUrl: './user-registration-request-list.component.html',
  styleUrls: ['./user-registration-request-list.component.css']
})
export class UserRegistrationRequestListComponent implements OnInit {

  private selectedRequest: UserRegistrationRequest;
  public  displayedColumns: string[] = [ 'select', 'name', 'socialId', 'message', 'actionsMenu' ];
  public  requests = new MatTableDataSource<UserRegistrationRequest>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Output() requestsProcessed = new EventEmitter();
  selection = new SelectionModel<UserRegistrationRequest>(true, []);

  constructor(private userService: UserService,
              private notifications: NotificationService,
              private translate: TranslateService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.spinner.show("userRegistrationRequestListSpinner");
    this.userService.findPendingRegistrationRequests().subscribe( requests => {
      this.spinner.hide("userRegistrationRequestListSpinner");
      this.requests.data = requests;
      this.requests.paginator = this.paginator;
      this.requests.sort = this.sort;
      this.requests.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'name':
            return this.getRequestUserName(item);
          case 'socialId':
            return this.getRequestUserSocialId(item);
          default:
            return item[property];
        }
      };
    })
  }

  getRequestUserName(request: UserRegistrationRequest): string {
    return request.firstName + " " + request.lastName;
  }

  getRequestUserSocialId(request: UserRegistrationRequest): string {
    return request.socialId;
  }

  getRequestMessage(request: UserRegistrationRequest): string {
    return request.message;
  }

  onActionsMenuButonClick(event, selectedRequest: UserRegistrationRequest) {
    event.stopPropagation();
    this.selectedRequest = selectedRequest;
  }

  onRequestSelected(request: UserRegistrationRequest) {
  }

  onAcceptRequest() {
    this.acceptRequest(this.selectedRequest);
    this.selectedRequest = null;
  }

  onRejectRequest() {
    this.rejectRequest(this.selectedRequest);
    this.selectedRequest = null;
  }

  onAcceptSelectedRequests() {
    this.selection.selected.forEach( request => this.acceptRequest(request) );
    this.selection.clear();
  }

  onRejectSelectedRequests() {
    this.selection.selected.forEach( request => this.rejectRequest(request) );
    this.selection.clear();
  }

  acceptRequest(request: UserRegistrationRequest) {
    this.userService.acceptUserRegistrationRequest(request).subscribe( user => {
        if( user != null )
          this.notifications.showSuccess(this.translate.instant("UserRegistrationRequestList.RequestSuccessfullyAccepted"));
        this.selectedRequest = null;
        this.loadRequests();
        this.requestsProcessed.emit();
    });
  }

  rejectRequest(request: UserRegistrationRequest) {
    this.userService.rejectRegistrationRequest(request).subscribe( request => {
      if( request != null )
        this.notifications.showSuccess(this.translate.instant("UserRegistrationRequestList.RequestSuccessfullyRejected"));              
        this.loadRequests();
        this.requestsProcessed.emit();
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.requests.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.requests.data.forEach(row => this.selection.select(row));
  }
  
}
