import { Injectable } from '@angular/core';
import { Http , Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class AuthenticationService {
  loginstatus : boolean = false;
  userRequestOptions :  RequestOptions;

  public server_url = 'https://tubelistapi.herokuapp.com';

  constructor(private _http : Http) {   }


  register(userDetails){

    let headers : Headers = new Headers({ 'Content-Type': 'application/json '});
    let options : RequestOptions = new RequestOptions({'headers': headers});

    return this._http.post(this.server_url+"/api/register/",JSON.stringify(userDetails),options)
              .map((res : Response) => res.json())
              .catch( ( errorRes: Response ) => {
                     return Observable.throw( errorRes.json() );
                 });

  }

  login(userCredentials){

    let headers : Headers = new Headers({ 'Content-Type': 'application/json '});
    let options : RequestOptions = new RequestOptions({'headers': headers});

    return this._http.post(this.server_url+"/api/authenticate/",JSON.stringify(userCredentials),options)
              .map((res : Response) => res.json())
              .toPromise()
              .catch( ( errorRes: Response ) => {
                     //console.log('Error : '+ JSON.stringify(errorRes.json()));
                     throw(new Observable(errorRes.json()));
                 }).then(res => {
                   if(res && res.token){
                     localStorage.setItem('token',res.token);
                     let headers : Headers = new Headers({ 'Content-Type': 'application/json '});
                     headers.append('Authorization','JWT '+res.token);
                     this.userRequestOptions = new RequestOptions({'headers': headers});
                     return this._http.get(this.server_url+'/api/user/',this.userRequestOptions)
                                   .map(res => res.json())
                                   .toPromise()
                                   .catch( ( errorRes: Response ) => {
                     console.log('Error : '+ JSON.stringify(errorRes.json()));
                     return false;
                 })
                                   .then(res => {
                                     if(res && res.username){
                                       localStorage.setItem('user',JSON.stringify(res));
                                       this.loginstatus = true;
                                       return true;
                                     }else{
                                       return false;
                                     }
                                   },
                                   err =>{ return false; });
                   }
                 },
                 err =>{ return false; });
          }

  getUser(){

    if(this.loginstatus){
      return JSON.parse(localStorage.getItem('user'));
    }else{
      return {"error" : "Invalid"};
    }
  }

  getUserRequestOptions(){
    if(this.loginstatus){
      return this.userRequestOptions;
    }else{
      return null;
    }
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userRequestOptions = null;
    this.loginstatus = false;
  }

}
