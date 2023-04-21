import React, {createContext} from "react";
import {Bookmark as BookmarkType} from "../../entities/bookmark";
import {Folder as FolderType} from "../../entities/folder";

export const BookmarksContext = createContext<{
    bookmarks: BookmarkType[] | FolderType[],
    setBookmarks: React.Dispatch<React.SetStateAction<BookmarkType[] | FolderType[]>> | null,
    editMode: boolean
}>({bookmarks: [], setBookmarks: null, editMode: true});