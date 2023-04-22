import {Bookmark} from "../bookmark";

export interface Folder {
    id: number;
    name: string;
    bookmarks: Bookmark[];
}