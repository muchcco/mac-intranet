import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/_service/session.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    // this.sessionService.start();
    console.log("sda");  // Este mensaje debería aparecer en la consola
  }
}
