import {Autocomplete, Button, ButtonGroup, Modal, Paper, Stack, TextField, Typography} from "@mui/material";
import {Field, Form, Formik} from "formik";
import {Bookmark as BookmarkType} from "../../../entities/bookmark";
import SaveIcon from "@mui/icons-material/Save";
import React, {FC} from "react";
import {useBookmarks} from "../../hooks/bookmarks";
import {getFolderNames, getTotalAmountOfBookmarks, isInPlainMode} from "../../helpers/data-storing-modes";
import {Folder as FolderType} from "../../../entities/folder";
import {Delete} from "@mui/icons-material";

interface BookmarkEditProps {
    bookmark?: BookmarkType;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface BookmarkWithFolder extends BookmarkType {
    folderName?: string;
}

export const BookmarkEdit: FC<BookmarkEditProps> = ({bookmark, open, setOpen}) => {

    const {bookmarks, setBookmarks, setSelectedBookmark} = useBookmarks();

    const plainMode = isInPlainMode(bookmarks);

    const updateBookmarks = (bookmarks: FolderType[] | BookmarkType[]) => {
        if (setBookmarks) {
            setBookmarks(bookmarks);
        }
        chrome.storage.local.set({bookmarks: bookmarks});
    }

    const replaceBookmarkById = (folders: FolderType[], id: number, replacement: BookmarkType): boolean => {
        for (let i = 0; i < folders.length; i++) {
            const folder = folders[i];
            for (let j = 0; j < folder.bookmarks.length; j++) {
                const bookmark = folder.bookmarks[j];
                if (bookmark.id === id) {
                    folder.bookmarks[j] = replacement;
                    return true;
                }
            }
        }
        return false;
    }

    const deleteBookmarkById = (folders: FolderType[], id: number): boolean => {
        for (let i = 0; i < folders.length; i++) {
            const folder = folders[i];
            for (let j = 0; j < folder.bookmarks.length; j++) {
                const bookmark = folder.bookmarks[j];
                if (bookmark.id === id) {
                    folder.bookmarks.splice(j, 1);
                    return true;
                }
            }
        }
        return false;
    }

    const addBookmarkToFolder = (folders: FolderType[], newBookmark: BookmarkWithFolder): boolean => {
        const {folderName, ...bookmarkWithoutFolder} = newBookmark;
        const targetFolder = folders.find(folder => folder.name === folderName);
        if (targetFolder) {
            targetFolder.bookmarks.push(bookmarkWithoutFolder);
            return true;
        }
        return false;
    }

    return <Modal
        open={open}
        onClose={() => {
            setOpen(false);

            if (setSelectedBookmark) {
                setSelectedBookmark(undefined);
            }
        }}
    >
        <Paper sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            padding: 3
        }}>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{marginBottom: 3}}>
                {bookmark ? "Редактировать" : "Добавить"} закладку
            </Typography>

            <Formik
                initialValues={
                    {
                        id: bookmark ? bookmark.id : getTotalAmountOfBookmarks(bookmarks),
                        title: bookmark ? bookmark.title : "",
                        url: bookmark ? bookmark.url : "",
                        faviconUrl: bookmark ? bookmark.faviconUrl : "",
                        folderName: undefined
                    }
                }
                onSubmit={(values: BookmarkWithFolder) => {
                    let b = JSON.parse(JSON.stringify(bookmarks));

                    switch (true) {
                        case bookmark && plainMode: {
                            let index = b.findIndex((b: BookmarkType) => b.id === bookmark?.id);
                            b[index] = values;
                            break;
                        }
                        case bookmark && !plainMode: {
                            bookmark && replaceBookmarkById((bookmarks as FolderType[]), bookmark.id, values);
                            break;
                        }
                        case !bookmark && plainMode:
                            b.push(values);
                            break;
                        default:
                            addBookmarkToFolder((bookmarks as FolderType[]), values)
                            break;
                    }

                    updateBookmarks(b);
                    if (setSelectedBookmark) {
                        setSelectedBookmark(undefined);
                    }
                    setOpen(false);
                }}>
                <Form>
                    <Stack spacing={3}>
                        <Field as={TextField} name={"title"} label={"Название"} required/>
                        <Field as={TextField} name={"url"} label={"Ссылка"} required/>
                        <Field as={TextField} name={"faviconUrl"} label={"Ссылка на favicon"}/>

                        {!plainMode && <Field as={Autocomplete} label={"Папка"}
                                              options={getFolderNames((bookmarks as FolderType[]))}/>}


                        <ButtonGroup>
                            <Button
                                variant={"outlined"}
                                color={"success"}
                                startIcon={<SaveIcon/>}
                                type={"submit"}
                            >
                                Сохранить
                            </Button>
                            {bookmark && <Button
                                variant={"outlined"}
                                color={"error"}
                                startIcon={<Delete/>}
                                onClick={() => {
                                    let b = JSON.parse(JSON.stringify(bookmarks));
                                    const index = b.findIndex((b: BookmarkType) => b.id === bookmark.id);

                                    if (plainMode){
                                        b.splice(index, 1);
                                    } else {
                                        deleteBookmarkById(b, index);
                                    }

                                    if (setBookmarks) {
                                        setBookmarks(b);
                                    }

                                    if (setSelectedBookmark) {
                                        setSelectedBookmark(undefined);
                                    }
                                    chrome.storage.local.set({bookmarks: b});
                                }}>Удалить</Button>}
                        </ButtonGroup>

                    </Stack>
                </Form>
            </Formik>

        </Paper>
    </Modal>
}