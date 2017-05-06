import { Injectable } from '@angular/core';
import { Http , Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/mergeMap';

import { Playlist } from '.././models/playlist';
import { AuthenticationService} from '.././authentication.service';

@Injectable()
export class HomeService{

    constructor(private _http: Http,
                private _auth : AuthenticationService){
    }

    getPublicPlayLists(){
        let header : Headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this._auth.server_url+'/public/playlists/',header)
                .map(res => res.json());
    }

    loadMorePlaylists(url){
        let header : Headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(url,header)
                .map(res => res.json());
    }
}
