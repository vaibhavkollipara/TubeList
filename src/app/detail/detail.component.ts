import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DetailService } from './detail.service';
import { PlaylistDetail } from '.././models/playlistdetail';
import { Video } from '.././models/video';
import { FadeInOut } from '.././animations/fadeinout';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  providers: [DetailService],
  animations: [
    FadeInOut.animation
  ]
})
export class DetailComponent implements OnInit, OnDestroy {

    id:number;
    detailSub : any;
    videoSub : any;
    playlist : PlaylistDetail;
    video_source : string;
    video_detail : Video;
    selected_video_id : number;

  constructor(private _route : ActivatedRoute,
              private _router : Router,
              private _detail : DetailService,
              public sanitizer: DomSanitizer) { }

  ngOnInit() {
      this._route.params.subscribe((params : Params) => {
          this.id = (params['id']);
      });
      this.loadData();
  }

  ngOnDestroy(){
      if(this.detailSub){
          this.detailSub.unsubscribe();
      }
      if(this.videoSub){
        this.videoSub.unsubscribe();
      }
  }

  loadData(){
      this.detailSub = this._detail.getDetails(this.id)
                          .subscribe(res =>{
                              this.playlist = res;
                          },
                          err =>{
                              alert("Something Wrong...");
                          });
  }

   goBack(){
    let selected_id = this.id ? this.id : null;
    this._router.navigate(['/dashboard',{id : selected_id}]);
  }

  playVideo(id){
      this.selected_video_id = id;
        this.videoSub = this._detail.getVideo(id).subscribe(res => {
                          this.video_detail = res;
                          this.video_source = 'https://www.youtube.com/embed/'+ this.video_detail.youtube_url+'?&autoplay=1';
                        },err => {
                          alert('Something wrong')
                        });

  }

  getVideoSource(){
    if(this.video_source){
      return this.video_source;
    }
  }

  isSelectedVideo(id){
    return id == this.selected_video_id;
  }

}
