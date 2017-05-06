import { Component, OnInit, OnDestroy } from '@angular/core';
import  { HomeService } from './home.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Playlist } from '.././models/playlist';
import { FadeInOut } from '.././animations/fadeinout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HomeService],
  animations: [
    FadeInOut.animation
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  playlistSubscription : any;
  playlists : Playlist[];
  morePlaylists : Playlist[] = [];
  selectedId;
  nextPageUrl : string ;
  morePlaylistsSub : any;
  constructor(private _home : HomeService,
              private _router:Router,
              private _route : ActivatedRoute) { }

  ngOnInit() {
       this._route.params.subscribe((params : Params) => {
                                        this.selectedId = params['id'];
                                });
      this.getPlaylists();
  }

  getPlaylists(){
      this.playlistSubscription = this._home.getPublicPlayLists()
                                      .subscribe(res =>{
                                        this.nextPageUrl = res.next;
                                        this.playlists = res.results;
                                        this.morePlaylists = [];
                                      },
                                      err=>{ alert('Something went wrong'); });
  }

  ngOnDestroy(){
      if(this.playlistSubscription){
          this.playlistSubscription.unsubscribe();
      }
      if(this.morePlaylistsSub){
        this.morePlaylistsSub.unsubscribe();
      }
  }

  showDetails(id){
      this._router.navigate(['/dashboard/detail',id])
  }

  isSelected(id){
      return this.selectedId == id;
  }

  loadMore(){
    this.morePlaylistsSub = this._home.loadMorePlaylists(this.nextPageUrl)
                                .subscribe(res => {
                                  this.nextPageUrl = res.next;
                                  console.log(res.results);
                                  this.morePlaylists = this.morePlaylists.concat(res.results);
                                },
                                err => { alert('Problem Loading more Playlists');});
  }

}
