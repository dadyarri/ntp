import {Box, IconButton, Link, Typography, useTheme} from "@mui/material";
import React, {FC, useContext} from "react";
import {Bookmark as BookmarkType} from "../../../entities/bookmark";
import {Edit} from "@mui/icons-material";
import {BookmarksContext} from "../../contexts/bookmarks";
import {grey} from "@mui/material/colors";

interface BookmarkProps {
    bookmark: BookmarkType;
}

export const Bookmark: FC<BookmarkProps> = ({bookmark}) => {

    const {bookmarks, setBookmarks, editMode, setSelectedBookmark, setEditModalOpen} = useContext(BookmarksContext);

    const theme = useTheme();

    let isDarkMode = theme.palette.mode === "dark";
    return <Link href={bookmark.url} sx={{color: isDarkMode ? grey[300] : grey[900], textDecoration: "none"}}>

        <Box sx={{
            border: 1,
            borderColor: isDarkMode ? grey[300] : grey[900],
            borderRadius: "14px",
            padding: "13px",
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minWidth: "250px"
        }}>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: editMode ? 0 : "2px"
            }}>
                <img
                    src={bookmark.faviconUrl ? bookmark.faviconUrl : `${bookmark.url}/favicon.ico`} alt={"favicon"}
                    style={{height: "26px", marginRight: "8px"}}/>
                <Typography sx={{fontSize: "16px"}}>
                    {bookmark.title}
                </Typography>
            </Box>
            {editMode &&
                <IconButton
                    size={"small"}
                    onClick={(event) => {
                        event.preventDefault();
                        if (setSelectedBookmark) {
                            setSelectedBookmark(bookmark);
                        }

                        if (setEditModalOpen) {
                            setEditModalOpen(true);
                        }
                    }}
                >
                    <Edit/>
                </IconButton>}
        </Box>
    </Link>
};
