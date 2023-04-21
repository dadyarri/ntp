import {Bookmark} from "../../../entities/bookmark";
import {Folder} from "../../../entities/folder";

export const isInPlainMode = (data: (Bookmark | Folder)[]): boolean => {

    return data.every((item): item is Bookmark => {
        return (item as Bookmark).url !== undefined && (item as Bookmark).title !== undefined;
    });
};

export const convertToPlainMode = (folders: Folder[]): Bookmark[] => {
    const bookmarks: Bookmark[] = [];

    folders.forEach(folder => {
        folder.bookmarks.forEach(bookmark => {
            bookmarks.push(bookmark);
        });
    });

    return bookmarks;
};

export const convertToComplexMode = (bookmarks: Bookmark[]): Folder[] => {
    const folder: Folder = {
        id: 1,
        name: "Converted",
        bookmarks: bookmarks
    };

    return [folder];
};

export const getTotalAmountOfBookmarks = (bookmarks: Bookmark[] | Folder[]): number =>
    isInPlainMode(bookmarks) ? bookmarks.length :
        (bookmarks as Folder[]).reduce((total, folder) => total + folder.bookmarks.length, 0);

