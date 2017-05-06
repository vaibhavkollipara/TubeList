import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '.././authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _router: Router,private _auth : AuthenticationService) { }

  canActivate(){
    let user = this._auth.getUser();
    if(user.username) {
            // logged in so return true
            return true;
    }
        // not logged in so redirect to login page
        this._router.navigate(['/authenticate']);
        return false;
  }
}
