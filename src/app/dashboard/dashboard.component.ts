import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '.././authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    title = "TubeList";
    user : any;

  constructor(private _auth : AuthenticationService,
              private _route : Router) { }

  ngOnInit() {
      this.user = this._auth.getUser();
      if(this.user.error){
        alert("Need to login for access");
        this._route.navigate(['/authenticate']);
      }
  }

  logout(){
      this._auth.logout();
      this._route.navigate(['/authenticate']);
  }

}
