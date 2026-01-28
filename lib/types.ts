export interface Paste{
    id: string;
    content: string,
    created_at:number;
    ttl_seconds:number | null;
    max_views:number | null;
    view_count:number;
}

export interface CreatePasteRequest{
    content: string;
    ttl_seconds?:number;
    max_views?:number
}

export interface CreatePasteResponse{
    id:string;
    url:string;
}

export interface GetPasteResponse{
    content: string;
    remaining_views:number | null;
    expires_at:string | null
}

