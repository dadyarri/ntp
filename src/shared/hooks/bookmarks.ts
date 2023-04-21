import {useContext} from "react";
import {BookmarksContext} from "../contexts/bookmarks";

export const useBookmarks = () => {
    return useContext(BookmarksContext);
}