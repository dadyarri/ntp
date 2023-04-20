import React, {useEffect, useMemo, useState} from 'react'
import {
    Button,
    Container,
    createTheme,
    CssBaseline,
    Grid,
    Modal,
    PaletteMode,
    Paper,
    Stack,
    TextField,
    ThemeProvider,
    Typography,
    useMediaQuery
} from "@mui/material";
import {DateTime} from "luxon";
import {Bookmark as BookmarkType} from "../entities/bookmark";
import {Bookmark} from "../shared/ui/bookmark";
import {Add, Save} from "@mui/icons-material";
import {Field, Form, Formik} from "formik";
import {BookmarksContext} from '../shared/contexts/bookmarks';
import {grey} from "@mui/material/colors";

function Index() {

    const [dateTime, setDateTime] = useState(DateTime.now());
    const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);

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

            setBookmarks(data.bookmarks);

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
            </Container>


            <Container maxWidth={"xl"} sx={{display: "flex", alignItems: "center"}}>
                <BookmarksContext.Provider value={{bookmarks: bookmarks, setBookmarks: setBookmarks}}>
                    <Grid container spacing={2} sx={{alignItems: "center"}}>
                        {bookmarks.map((bookmark: any) => (
                            <Grid item>
                                <Bookmark bookmark={bookmark}/>
                            </Grid>
                        ))}

                        <Grid item>
                            <Button variant={"outlined"}
                                    color={"success"}
                                    startIcon={<Add/>}
                                    sx={{margin: 3}}
                                    onClick={() => setAddModalIsOpen(true)}
                            >
                                Добавить
                            </Button>
                        </Grid>
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
                                    startIcon={<Save/>}
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
