export class PlaylistDetail{

    name : string;
    description : string;
    createdby : string;
    image_url : string;
    videos : Videos [];
}


export class Videos{
    id : number;
    thumbnail_url:string;
    title : string;
    date_added : Date;
}
