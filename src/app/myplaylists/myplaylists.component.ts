import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Playlist } from '.././models/playlist';
import { MyplaylistService } from './myplaylists.service';
import { FadeInOut } from '.././animations/fadeinout';


@Component({
  selector: 'app-myplaylists',
  templateUrl: './myplaylists.component.html',
  styleUrls: ['./myplaylists.component.css'],
  providers: [MyplaylistService],
  animations: [
    FadeInOut.animation
  ]
})
export class MyplaylistsComponent implements OnInit, OnDestroy {
    playlistSubscription : any;
    playlistCreateSub : any;
    morePlaylistsSub : any;
    playlists : Playlist[];
    morePlaylists : Playlist[] = [];
    selectedId;
    playlistForm : FormGroup;
    loading = false;
    modalVisibility : boolean = false;
    nextPageUrl : string ;

  constructor(private _mylist : MyplaylistService,
              private _router : Router,
              private _route : ActivatedRoute,
              private _formBuilder : FormBuilder) { }

  ngOnInit() {
      this._route.params.subscribe((params : Params) => {
                                        this.selectedId = params['id'];
                                });
      this.initilizeForm();
      this.getPlaylists();
  }

  initilizeForm(){
    this.playlistForm = this._formBuilder.group({
        name :['',[Validators.required,Validators.minLength(6)]],
        description : ['',[Validators.required,Validators.minLength(6)]],
        image_url : ['',[Validators.required]]
    });
  }

  ngOnDestroy(){
      if(this.playlistSubscription){
          this.playlistSubscription.unsubscribe();
      }
      if(this.playlistCreateSub){
        this.playlistCreateSub.unsubscribe();
      }
      if(this.morePlaylistsSub){
        this.morePlaylistsSub.unsubscribe();
      }
  }

  getPlaylists(){
      this.playlistSubscription = this._mylist.getMyPlaylists()
                                      .subscribe(res =>{
                                        this.nextPageUrl = res.next;
                                        this.playlists = res.results;
                                        this.morePlaylists = [];
                                      },
                                      err=>{ alert('Something went wrong'); });
  }

  createPlaylist(){
    this.loading = true;
      let data = this.playlistForm.value;
      let playlist_details = {
          'name' : data.name,
          'description' : data.description,
          'image_url' : data.image_url,
          'is_public' : false
      }
      this.playlistCreateSub = this._mylist.newPlaylist(data)
                                  .subscribe(res => {
                                     if(res && res.name){
                                       alert('New Playlist Created');
                                       this.getPlaylists();
                                       this.playlistForm.reset();
                                       this.hideModal();
                                     }else{
                                       alert('Problem Creating Playlist');
                                     }
                                     this.loading = false;
                                  },
                                  err => {
                                    alert('ERROR : Problem Creating Playlist');
                                    this.loading = false;
                                  });
  }

  showDetails(id){
      this._router.navigate(['/dashboard/myplaylistdetail',id]);
  }

  isSelected(id){
      return this.selectedId == id;
  }

  isPlaylistFormSubmitable(){
    return !(this.playlistForm.valid && !this.loading);
  }

  showModal(){
    this.modalVisibility = true;
  }

  hideModal(){
    this.modalVisibility = false;
  }

  loadMore(){
    this.morePlaylistsSub = this._mylist.loadMorePlaylists(this.nextPageUrl)
                                .subscribe(res => {
                                  this.nextPageUrl = res.next;
                                  console.log(res.results);
                                  this.morePlaylists = this.morePlaylists.concat(res.results);
                                },
                                err => { alert('Problem Loading more Playlists');});
  }

  modalView(){
    if(this.modalView){
      return 'shown';
    }else{
      return 'hidden';
    }
  }
}
