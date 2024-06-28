import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent {
  public onClose: Subject<boolean> = new Subject();

  constructor(public bsModalRef: BsModalRef) {}

  
  stayConnected() {
    this.onClose.next(true);
    this.bsModalRef.hide();
  }

  logout() {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
