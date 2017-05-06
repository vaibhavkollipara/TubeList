import { Injectable } from '@angular/core';
import { Http , Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/mergeMap';
import { AuthenticationService} from '.././authentication.service';

@Injectable()
export class DetailService{

    private header : Headers = new Headers({'Content-Type':'application/json'})
    constructor(private _http: Http,
                private _auth : AuthenticationService){
    }

    getDetails(id: number){

        return this._http.get(this._auth.server_url+'/public/playlist/'+id+'/',this.header)
                .map(res => res.json())
                .catch(err => {
                    return err.json();
                });
    }

    getVideo(id){
        return this._http.get(this._auth.server_url+'/public/video/'+id+'/',this.header)
                .map(res => res.json())
                .catch(err => {
                    return err.json();
                });
    }
}
