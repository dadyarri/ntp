import React, {useEffect, useMemo, useState} from 'react'
import {
    Button,
    Container,
    createTheme,
    CssBaseline,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    PaletteMode,
    Switch,
    ThemeProvider,
    Typography,
    useMediaQuery
} from "@mui/material";
import {DateTime} from "luxon";
import {Bookmark as BookmarkType} from "../entities/bookmark";
import {Folder as FolderType} from "../entities/folder";
import {Bookmark} from "../shared/ui/bookmark";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import FolderIcon from "@mui/icons-material/Folder";
import ListIcon from "@mui/icons-material/List";
import SettingsIcon from "@mui/icons-material/Settings";
import {BookmarksContext} from '../shared/contexts/bookmarks';
import {grey} from "@mui/material/colors";
import {convertToComplexMode, convertToPlainMode, isInPlainMode} from "../shared/helpers/data-storing-modes";
import {Folder} from "../shared/ui/folder";
import {BookmarkEdit} from "../shared/ui/bookmark-edit";
import {FolderPreview} from "../shared/ui/folder-preview";

function Index() {

    const [dateTime, setDateTime] = useState(DateTime.now());
    const [bookmarks, setBookmarks] = useState<BookmarkType[] | FolderType[]>([]);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [plainMode, setPlainMode] = useState(true);
    const [folderPreviewIsOpen, setFolderPreviewIsOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);

    const showSettings = Boolean(anchorEl);

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const colorMode = prefersDarkMode ? "dark" : "light";

    const getDesignTokens = (mode: PaletteMode) => ({
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    background: {
                        default: grey[50]
                    },
                    text: {
                        primary: grey[900],
                        secondary: grey[800],
                    },
                }
                : {
                    background: {
                        default: grey[900]
                    },
                    text: {
                        primary: '#fff',
                        secondary: grey[500],
                    },
                }),
        },
    });

    const theme = useMemo(() => createTheme(getDesignTokens(colorMode)), [colorMode]);

    useEffect(() => {
        setTimeout(
            () => setDateTime(DateTime.now()),
            60000
        );

        chrome.storage.local.get(null).then((data) => {
            if (data.bookmarks === undefined) {
                let bookmarks: BookmarkType[] = [];
                chrome.storage.local.set({bookmarks: bookmarks})
                data.bookmarks = bookmarks;
            }

            if (data.editMode === undefined) {
                chrome.storage.local.set({editMode: true});
                data.editMode = true;
            }

            setEditMode(data.editMode);
            setBookmarks(data.bookmarks);
            setPlainMode(isInPlainMode(data.bookmarks));

        });

    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Container maxWidth={"md"} sx={{
                minHeight: "100px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Typography variant={"h3"}>{dateTime.toFormat("HH:mm")}</Typography>
                <Typography variant={"h3"}>{dateTime.toFormat("dd.MM.yyyy")}</Typography>
                <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                    <SettingsIcon/>
                </IconButton>
                <Menu
                    open={showSettings}
                    onClose={() => setAnchorEl(null)}
                    anchorEl={anchorEl}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <EditIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Режим редактирования"}/>
                            <Switch
                                edge={"end"}
                                checked={editMode}
                                onChange={() => {
                                    setEditMode(!editMode);
                                    chrome.storage.local.set({editMode: !editMode});
                                }}/>
                        </ListItem>
                        <ListItemButton onClick={() => {
                            setPlainMode(!plainMode);
                            let newBookmarks;
                            if (plainMode) {
                                newBookmarks = convertToComplexMode(bookmarks as BookmarkType[]);
                            } else {
                                newBookmarks = convertToPlainMode(bookmarks as FolderType[]);
                            }
                            chrome.storage.local.set({bookmarks: newBookmarks});
                            setBookmarks(newBookmarks);
                        }}>
                            <ListItemIcon>
                                {plainMode ? <FolderIcon/> : <ListIcon/>}
                            </ListItemIcon>
                            <ListItemText>
                                {plainMode ? "Переключиться в режим с папками" : "Переключиться в простой режим"}
                            </ListItemText>
                        </ListItemButton>
                    </List>
                </Menu>
            </Container>


            <Container maxWidth={"xl"} sx={{display: "flex", alignItems: "center"}}>
                <BookmarksContext.Provider
                    value={{bookmarks: bookmarks, setBookmarks: setBookmarks, editMode: editMode}}>
                    {plainMode ? <Grid container spacing={2} sx={{alignItems: "center", justifyContent: "center"}}>
                        {bookmarks.map((bookmark: any) => (
                            <Grid item>
                                <Bookmark bookmark={bookmark}/>
                            </Grid>
                        ))}

                        {editMode && <Grid item>
                            <Button variant={"outlined"}
                                    color={"success"}
                                    startIcon={<AddIcon/>}
                                    sx={{margin: 3}}
                                    onClick={() => setAddModalIsOpen(true)}
                            >
                                Добавить
                            </Button>
                        </Grid>}
                    </Grid> : <Grid spacing={2} sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>

                            {(bookmarks as FolderType[]).map((folder) =>
                                <Folder id={folder.id}
                                        onClick={() => {
                                            setSelectedFolder(folder)
                                            setFolderPreviewIsOpen(true)
                                        }}/>
                            )}
                        <FolderPreview
                            open={folderPreviewIsOpen}
                            onClose={() => setFolderPreviewIsOpen(false)}
                            folder={selectedFolder}
                        />
                    </Grid>}
                    <BookmarkEdit open={addModalIsOpen} setOpen={setAddModalIsOpen}/>
                </BookmarksContext.Provider>
            </Container>
        </ThemeProvider>
    );
}

export default Index
