import React, {createContext} from "react";
import {Bookmark as BookmarkType} from "../../entities/bookmark";

export const BookmarksContext = createContext<{
    bookmarks: BookmarkType[],
    setBookmarks: React.Dispatch<React.SetStateAction<BookmarkType[]>> | null
}>({bookmarks: [], setBookmarks: null});