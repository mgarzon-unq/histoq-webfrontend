import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService ) { }

  public showSuccess(message){
    this.toastr.success( message, "", { enableHtml: true } );
  }

  public showError(message){
    this.toastr.error( message, "", { enableHtml: true, timeOut: 5000 } );
  }
}
