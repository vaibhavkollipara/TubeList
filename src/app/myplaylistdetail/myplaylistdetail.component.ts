import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MyplaylistdetailService } from './myplaylistdetail.service';
import { MyPlaylistDetail } from '.././models/myplaylistdetail';
import { Video } from '.././models/video';
import { Playlist } from '.././models/playlist';
import { FadeInOut } from '.././animations/fadeinout';

@Component({
  selector: 'app-myplaylistdetail',
  templateUrl: './myplaylistdetail.component.html',
  styleUrls: ['./myplaylistdetail.component.css'],
  providers: [MyplaylistdetailService],
  animations: [
    FadeInOut.animation
  ]
})
export class MyplaylistdetailComponent implements OnInit {
    private id:number;
    private detailSub : any;
    private videoSub : any;
    public playlist : MyPlaylistDetail;
    private video_source : string;
    private video_detail : Video;
    private selected_video_id : number;

    playlistUpdateSub : any;
    playlistDeleteSub : any;
    videoDeleteSub : any;
    playlistForm : FormGroup;
    videoForm : FormGroup;
    loading : boolean = false;
    videoModalVisibility : boolean = false;
    playlistModalVisibility : boolean = false;

  constructor(private _route : ActivatedRoute,
              private _router : Router,
              private _detail : MyplaylistdetailService,
              public sanitizer: DomSanitizer,
              private _formBuilder : FormBuilder) { }

  ngOnInit() {
      this._route.params.subscribe((params : Params) => {
          this.id = (params['id']);
      });
      this.loadData();
      this.initilizeForms();
  }

  ngOnDestroy(){
      if(this.detailSub){
          this.detailSub.unsubscribe();
      }
      if(this.videoSub){
        this.videoSub.unsubscribe();
      }
      if(this.playlistUpdateSub){
        this.playlistUpdateSub.unsubscribe();
      }
      if(this.playlistDeleteSub){
        this.playlistDeleteSub.unsubscribe();
      }
      if(this.videoDeleteSub){
        this.videoDeleteSub.unsubscribe();
      }
  }


  initilizePlaylistForm(){
        if(this.playlist){
          this.playlistForm = this._formBuilder.group({
              name :[this.playlist.name,[Validators.required,Validators.minLength(6)]],
              description : [this.playlist.description,[Validators.required,Validators.minLength(6)]],
              image_url : [this.playlist.image_url,[Validators.required]]
          });
        }else{
          this.playlistForm = this._formBuilder.group({
              name :['',[Validators.required,Validators.minLength(6)]],
              description : ['',[Validators.required,Validators.minLength(6)]],
              image_url : ['',[Validators.required]]
          });
      }

  }

  initilizeVideoForm(){
      this.videoForm = this._formBuilder.group({
        youtube_url : ['',[Validators.required , Validators.pattern('^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$')]]
      });
  }

  initilizeForms(){
    this.initilizePlaylistForm();
    this.initilizeVideoForm();
  }

  loadData(){
      this.detailSub = this._detail.getDetails(this.id)
                          .subscribe(res =>{
                              this.playlist = res;
                              this.initilizePlaylistForm();
                          },
                          err =>{
                              alert("Something Wrong...");
                          });
  }

   goBack(){
    let selected_id = this.id ? this.id : null;
    this._router.navigate(['/dashboard/myplaylists',{id : selected_id}]);
  }

  playVideo(id){
      this.selected_video_id = id;
        if(this.selected_video_id){
          this.videoSub = this._detail.getVideo(this.selected_video_id).subscribe(res => {
                            this.video_detail = res;
                            this.video_source = 'https://www.youtube.com/embed/'+ this.video_detail.youtube_url+'?&autoplay=1';
                          },err => {
                            alert('ERROR : Something wrong');
                          });
      }

  }

  getVideoSource(){
    if(this.video_source){
      return this.video_source;
    }
  }

  updatePlaylist(){
    this.loading = true;
      let data = this.playlistForm.value;
      let playlist_details = {
          'name' : data.name,
          'description' : data.description,
          'image_url' : data.image_url,
          'is_public' : false
      }
    this.playlistUpdateSub = this._detail.updatePlaylist(this.id,data)
                                  .subscribe(res => {
                                    if(res && res.name){
                                      alert('Updated Successful');
                                      this.loadData();
                                    }else{
                                      alert('Prolem Updating Playlist');
                                    }
                                    this.loading = false;
                                  },
                                  err => {
                                    alert('Error : Problem Updating playlist');
                                    this.loading = false;
                                  });
  }

  deletePlaylist(){
    this.playlistDeleteSub = this._detail.deletePlaylist(this.id)
                                         .subscribe(res => {
                                           this._router.navigate(['/dashboard/myplaylists']);
                                         },err => {
                                           alert('ERROR : Problem Deleting Playlist');
                                         });
  }

  isSelectedVideo(id){
    return id == this.selected_video_id;
  }

  isPlaylistFormSubmitable(){
    return !(this.playlistForm.valid && !this.loading);
  }

    makePrivate(){
      this.playlistUpdateSub = this._detail.updatePlaylist(this.id,{'is_public' : false})
                                          .subscribe(res => {
                                              if(res && !res.is_public){
                                                this.playlist.is_public = false;
                                              }else{
                                                alert('Problem making playlist private');
                                              }
                                          },
                                          err => {
                                            alert('ERROR :Problem making playlist private');
                                          });
    }

    makePublic(){
      if(this.playlist.videos.length < 2){
        alert("Playlist should have atleast 2 videos to make it public\nAdd 2 Videos and try again");
      }else{
          this.playlistUpdateSub = this._detail.updatePlaylist(this.id,{'is_public' : true})
                                          .subscribe(res => {
                                              if(res && res.is_public){
                                                this.playlist.is_public = true;
                                              }else{
                                                alert('Problem making playlist public');
                                              }
                                          },
                                          err => {
                                            alert('ERROR : Problem making playlist public');
                                          });
      }

    }

    addVideo(){
      this.loading = true;
      let data = {
        "youtube_url" : this.videoForm.value.youtube_url
      }

      this.videoSub = this._detail.newVideo(this.id,data)
                                   .subscribe(res => {
                                      if(res && res.youtube_url){
                                        this.videoForm.reset();
                                        this.loadData();
                                      }else{
                                        alert('Problem Adding Video');
                                      }
                                      this.loading = false;
                                   },
                                   err => {
                                     alert('ERROR : Problem Adding Video');
                                     this.loading = false;
                                   });

    }

    deleteVideo(vid:number){
      if(this.selected_video_id == vid){

        if(this.videoSub){
              this.videoSub.unsubscribe();
          }
          this.video_detail = null;
          this.selected_video_id = null;
          this.video_source = null;
      }
        this.videoDeleteSub = this._detail.deleteVideo(vid)
                                   .subscribe(res => {
                                     this.loadData();
                                   },err => {
                                     alert('Problem Deleting Video');
                                   });
    }

    isVideoFormSubmitable(){
        return !(this.videoForm.valid && !this.loading)
    }

    showVideoModal(){
      this.videoModalVisibility = true;
    }

    hideVideoModal(){
      this.videoModalVisibility = false;
    }

    showPlaylistModal(){
      this.playlistModalVisibility = true;
    }

    hidePlaylistModal(){
      this.playlistModalVisibility = false;
    }

}
