import React, {useEffect, useMemo, useState} from 'react'
import {
    Button,
    Container,
    createTheme,
    CssBaseline,
    Grid,
    IconButton,
    List,
    ListItem, ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    Modal,
    PaletteMode,
    Paper,
    Stack,
    Switch,
    TextField,
    ThemeProvider,
    Typography,
    useMediaQuery
} from "@mui/material";
import {DateTime} from "luxon";
import {Bookmark as BookmarkType} from "../entities/bookmark";
import {Bookmark} from "../shared/ui/bookmark";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import FolderIcon from "@mui/icons-material/Folder";
import ListIcon from "@mui/icons-material/List";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import {Field, Form, Formik} from "formik";
import {BookmarksContext} from '../shared/contexts/bookmarks';
import {grey} from "@mui/material/colors";
import {isInPlainMode} from "../shared/helpers/data-storing-modes";

function Index() {

    const [dateTime, setDateTime] = useState(DateTime.now());
    const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [plainMode, setPlainMode] = useState(true);

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
                                    setAnchorEl(null);
                                }}/>
                        </ListItem>
                        <ListItemButton onClick={() => setPlainMode(!plainMode)}>
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
                    <Grid container spacing={2} sx={{alignItems: "center", justifyContent: "center"}}>
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
                    </Grid>
                </BookmarksContext.Provider>
            </Container>

            <Modal
                open={addModalIsOpen}
                onClose={() => setAddModalIsOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    padding: 3
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{margin: 3}}>
                        Добавить закладку
                    </Typography>

                    <Formik
                        initialValues={{id: bookmarks.length, title: "", url: "", faviconUrl: ""}}
                        onSubmit={(values: BookmarkType) => {
                            let b = JSON.parse(JSON.stringify(bookmarks));
                            b.push(values);
                            setBookmarks(b);
                            chrome.storage.local.set({bookmarks: b});
                            setAddModalIsOpen(false);
                        }}>
                        <Form>
                            <Stack spacing={3}>
                                <Field as={TextField} name={"title"} label={"Название"} required/>
                                <Field as={TextField} name={"url"} label={"Ссылка"} required/>
                                <Field as={TextField} name={"faviconUrl"} label={"Ссылка на favicon"}/>

                                <Button
                                    variant={"outlined"}
                                    color={"success"}
                                    startIcon={<SaveIcon/>}
                                    type={"submit"}
                                >
                                    Сохранить
                                </Button>
                            </Stack>
                        </Form>
                    </Formik>

                </Paper>
            </Modal>
        </ThemeProvider>
    );
}

export default Index
