import React, {createContext} from "react";
import {Bookmark as BookmarkType} from "../../entities/bookmark";
import {Folder as FolderType} from "../../entities/folder";

export const BookmarksContext = createContext<{
    bookmarks: BookmarkType[] | FolderType[],
    setBookmarks: React.Dispatch<React.SetStateAction<BookmarkType[] | FolderType[]>> | null,
    editMode: boolean,
    selectedBookmark: BookmarkType | undefined,
    setSelectedBookmark: React.Dispatch<React.SetStateAction<BookmarkType | undefined>> | null,
    editModalOpen: boolean,
    setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>> | null
}>({
    bookmarks: [],
    setBookmarks: null,
    editMode: true,
    selectedBookmark: undefined,
    setSelectedBookmark: null,
    editModalOpen: false,
    setEditModalOpen: null
});