import { Injectable } from '@angular/core';
import { Http , Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/mergeMap';

import { AuthenticationService } from '.././authentication.service';
import { Playlist } from '.././models/playlist';


@Injectable()
export class MyplaylistService {

    private options : RequestOptions;

    constructor(private _http: Http,
                private _auth : AuthenticationService) {
        this.options = this._auth.getUserRequestOptions();
    }


    getMyPlaylists(){
        return this._http.get(this._auth.server_url+'/api/playlists/',this.options)
                .map(res => res.json());
    }

     newPlaylist(playListDetails){
        return this._http.post(this._auth.server_url+'/api/newplaylist/', JSON.stringify(playListDetails), this.options)
                                .map(res => res.json());
    }

    loadMorePlaylists(url){
        return this._http.get(url,this.options)
                .map(res => res.json());
    }
}
