import { Injectable } from '@angular/core';
import { Http , Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/mergeMap';
import { AuthenticationService } from '.././authentication.service';
import { PlaylistDetail } from '.././models/playlistdetail';
import { Video } from '.././models/video';

@Injectable()
export class MyplaylistdetailService{

    private options : RequestOptions;
    constructor(private _http: Http,
                private _auth : AuthenticationService){
        this.options = this._auth.getUserRequestOptions();
    }

    getDetails(id: number){

        return this._http.get(this._auth.server_url+'/api/playlist/'+id+'/',this.options)
                .map(res => res.json())
                .catch(err => {
                    return err.json();
                });
    }

    getVideo(id){
        return this._http.get(this._auth.server_url+'/api/video/'+id+'/',this.options)
                .map(res => res.json())
                .catch(err => {
                    return err.json();
                });
    }

    updatePlaylist(id,data){
        return this._http.patch(this._auth.server_url+'/api/playlist/'+id+'/',JSON.stringify(data),this.options )
                            .map(res => res.json())
                            .catch(err => {
                                return err.json()
                            });
    }

    deletePlaylist(id){
           return this._http.delete(this._auth.server_url+'/api/playlist/'+id+'/',this.options )
                            .map(res => res.json())
                            .catch(err => {
                                return err.json()
                            });
    }

    newVideo(id,data){
        return this._http.post(this._auth.server_url+'/api/playlist/'+id+'/newvideo/',JSON.stringify(data),this.options )
                            .map(res => res.json())
                            .catch(err => {
                                return err.json()
                            });
    }

    deleteVideo(id){
        return this._http.delete(this._auth.server_url+'/api/video/'+id+'/',this.options )
                            .map(res => res.json())
                            .catch(err => {
                                return err.json()
                            });
    }
}
