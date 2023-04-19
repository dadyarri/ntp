import {useEffect, useState} from 'react'
import {Container, Typography} from "@mui/material";
import {DateTime} from "luxon";
import {Bookmark as BookmarkType} from "../entities/bookmark";

function Index() {

    const [dateTime, setDateTime] = useState(DateTime.now());
    const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);

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
        <>
            <Container maxWidth={"md"} sx={{
                minHeight: "100px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Typography variant={"h3"}>{dateTime.toFormat("HH:mm")}</Typography>
                <Typography variant={"h3"}>{dateTime.toFormat("dd.MM.yyyy")}</Typography>
            </Container>


            {bookmarks.map((bookmark: any) => (
                // <Bookmark/>
                <Typography>{bookmark.title}</Typography>
            ))}
        </>
    );
}

export default Index
