export class MyPlaylistDetail{

    name : string;
    description : string;
    image_url : string;
    is_public : boolean;
    videos : MyVideos [];
}


export class MyVideos{
    id : number;
    thumbnail_url:string;
    title : string;
    date_added : Date;
}
