import {Box, Button, ButtonGroup, IconButton, Link, Modal, Paper, Stack, TextField, Typography} from "@mui/material";
import React, {FC, useContext, useState} from "react";
import {Bookmark as BookmarkType} from "../../../entities/bookmark";
import {Delete, Edit, Save} from "@mui/icons-material";
import {Field, Form, Formik} from "formik";
import {BookmarksContext} from "../../contexts/bookmarks";

interface BookmarkProps {
    bookmark: BookmarkType;
}

export const Bookmark: FC<BookmarkProps> = ({bookmark}) => {

    const {bookmarks, setBookmarks} = useContext(BookmarksContext);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);

    return <>

        <Box sx={{
            border: 1,
            borderRadius: "14px",
            padding: "13px",
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minWidth: "250px"
        }}>
            <Link href={bookmark.url}>
                <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <img
                        src={bookmark.faviconUrl ? bookmark.faviconUrl : `${bookmark.url}/favicon.ico`} alt={"favicon"}
                        style={{height: "26px", marginRight: "8px"}}/>
                    <Typography sx={{fontSize: "16px"}}>
                        {bookmark.title}
                    </Typography></Box>
            </Link>
            <IconButton size={"small"} onClick={() => {
                setEditModalIsOpen(true)
            }}>
                <Edit/>
            </IconButton>
        </Box>

        <Modal
            open={editModalIsOpen}
            onClose={() => setEditModalIsOpen(false)}
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
                    Изменить закладку
                </Typography>

                <Formik
                    initialValues={bookmark}
                    onSubmit={(values: BookmarkType) => {
                        let b = JSON.parse(JSON.stringify(bookmarks));
                        const index = b.findIndex((b: BookmarkType) => b.id === bookmark.id);

                        b[index] = values;

                        if (setBookmarks) {
                            setBookmarks(b);
                        }
                        chrome.storage.local.set({bookmarks: b});
                        setEditModalIsOpen(false);

                    }}>
                    <Form>
                        <Stack spacing={3}>
                            <Field as={TextField} name={"title"} label={"Название"} required/>
                            <Field as={TextField} name={"url"} label={"Ссылка"} required/>
                            <Field as={TextField} name={"faviconUrl"} label={"Ссылка на favicon"}/>

                            <ButtonGroup>
                                <Button
                                    variant={"outlined"}
                                    color={"success"}
                                    startIcon={<Save/>}
                                    type={"submit"}
                                >
                                    Сохранить
                                </Button>
                                <Button
                                    variant={"outlined"}
                                    color={"error"}
                                    startIcon={<Delete/>}
                                    onClick={() => {
                                        let b = JSON.parse(JSON.stringify(bookmarks));
                                        const index = b.findIndex((b: BookmarkType) => b.id === bookmark.id);

                                        b.splice(index, 1);

                                        if (setBookmarks) {
                                            setBookmarks(b);
                                        }
                                        chrome.storage.local.set({bookmarks: b});
                                    }}>Удалить</Button>
                            </ButtonGroup>
                        </Stack>
                    </Form>
                </Formik>

            </Paper>
        </Modal>
    </>
};
