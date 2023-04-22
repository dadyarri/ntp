import {
    Autocomplete,
    Button,
    ButtonGroup, createFilterOptions,
    Modal,
    Paper,
    Stack,
    TextField,
    TextFieldProps,
    Typography
} from "@mui/material";
import {Field, Form, Formik} from "formik";
import {Bookmark as BookmarkType} from "../../../entities/bookmark";
import SaveIcon from "@mui/icons-material/Save";
import React, {EventHandler, FC, useState} from "react";
import {useBookmarks} from "../../hooks/bookmarks";
import {getFolderNames, getTotalAmountOfBookmarks, isInPlainMode} from "../../helpers/data-storing-modes";
import {Folder, Folder as FolderType} from "../../../entities/folder";
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


    interface FolderOptionType {
        inputValue?: string;
        title: string;
    }

    const {bookmarks, setBookmarks, setSelectedBookmark} = useBookmarks();
    const filter = createFilterOptions<FolderOptionType>();
    const plainMode = isInPlainMode(bookmarks);
    const [folderNameValue, setFolderNameValue] = useState<FolderOptionType | null>(null);

    const getFolderNameById = (folders: FolderType[], id: number): string => {
        const folder = folders.find(folder => folder.bookmarks.some(bookmark => bookmark.id === id));
        return folder ? folder.name : "";
    };

    const updateBookmarks = (bookmarks: FolderType[] | BookmarkType[]) => {
        console.log("updating");
        if (setBookmarks) {
            console.log("set");
            setBookmarks(bookmarks);
        }
        chrome.storage.local.set({bookmarks: bookmarks});
    }

    const folderExists = (folders: FolderType[], folderName: string): boolean => {
        return folders.some(folder => folder.name === folderName);
    };


    const replaceBookmarkById = (folders: FolderType[], id: number, replacement: BookmarkType): boolean => {
        const folderName = getFolderNameById(folders, id);
        if (folderName) {
            const folder = folders.find(folder => folder.name === folderName);
            const bookmarkIndex = folder?.bookmarks.findIndex(bookmark => bookmark.id === id);
            if (bookmarkIndex !== undefined && bookmarkIndex !== -1 && folder) {
                folder.bookmarks[bookmarkIndex] = replacement;
                return true;
            }
        }
        return false;
    };

    const createFolder = (folders: FolderType[], folderName: string, bookmarks: BookmarkType[] = []): boolean => {
        const id = folders.length + 1;
        folders.push({ id, name: folderName, bookmarks });
        return true;
    };

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
                        folderName: !plainMode && bookmark ? getFolderNameById((bookmarks as FolderType[]), bookmark.id) : ""
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
                            const oldName = values.folderName;
                            values.folderName = folderNameValue?.title ?? oldName;
                            setFolderNameValue(null);

                            const {folderName, ...bm} = values;

                            if (folderExists((b as FolderType[]), values.folderName!)) {
                                if (oldName === folderNameValue?.title) {
                                    bookmark && replaceBookmarkById((b as FolderType[]), bookmark.id, values);
                                } else {
                                    bookmark && deleteBookmarkById((b as FolderType[]), bookmark.id);
                                    addBookmarkToFolder((b as FolderType[]), values);
                                }
                            } else {
                                bookmark && deleteBookmarkById((b as FolderType[]), bookmark.id);
                                createFolder((b as FolderType[]), values.folderName!, [bm]);
                            }

                            break;
                        }
                        case !bookmark && plainMode:
                            b.push(values);
                            break;
                        default:
                            addBookmarkToFolder((b as FolderType[]), values)
                            break;
                    }

                    updateBookmarks(b);
                    if (setSelectedBookmark) {
                        setSelectedBookmark(undefined);
                    }
                    setOpen(false);
                }}>
                {({values}) => <Form>
                    <Stack spacing={3}>
                        <Field as={TextField} name={"title"} label={"Название"} required/>
                        <Field as={TextField} name={"url"} label={"Ссылка"} required/>
                        <Field as={TextField} name={"faviconUrl"} label={"Ссылка на favicon"}/>

                        {!plainMode && <Field
                            freeSolo
                            blurOnSelect
                            disableClearable
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            as={Autocomplete}
                            options={getFolderNames((bookmarks as FolderType[]))}
                            renderInput={(params: TextFieldProps) => <TextField {...params} label="Папка"/>}
                            getOptionLabel={(option: any): string => {
                                // Value selected with enter, right from the input
                                if (typeof option === 'string') {
                                    return option;
                                }
                                // Add "xxx" option created dynamically
                                if (option.inputValue) {
                                    return option.inputValue;
                                }
                                // Regular option
                                return option.title;
                            }}
                            name={"folderName"}
                            value={folderNameValue ?? values.folderName}
                            onChange={(event: EventHandler<any>, newValue: string | FolderOptionType) => {
                                if (typeof newValue === 'string') {
                                    setFolderNameValue({
                                        title: newValue,
                                    });
                                } else if (newValue && newValue.inputValue) {
                                    // Create a new value from the user input
                                    setFolderNameValue({
                                        title: newValue.inputValue,
                                    });
                                } else {
                                    setFolderNameValue(newValue);
                                }
                            }}
                            filterOptions={(options: FolderOptionType[], params: any) => {
                                const filtered = filter(options, params);

                                const {inputValue} = params;
                                // Suggest the creation of a new value
                                const isExisting = options.some((option) => inputValue === option.title);
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push({
                                        inputValue,
                                        title: `Создать папку "${inputValue}"`,
                                    });
                                }

                                return filtered;
                            }}
                        />}


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

                                    if (plainMode) {
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
                </Form>}
            </Formik>

        </Paper>
    </Modal>
}