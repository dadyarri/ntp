import React, {FC, useContext} from "react";
import {BookmarksContext} from "../../contexts/bookmarks";
import {Avatar, AvatarGroup, Box, Typography, useTheme} from "@mui/material";
import {grey} from "@mui/material/colors";
import {Folder as FolderType} from "../../../entities/folder";

interface FolderProps {
    id: number
}

export const Folder: FC<FolderProps> = ({id}) => {
    const {bookmarks, setBookmarks} = useContext(BookmarksContext);
    const folder = (bookmarks as FolderType[]).find((folder: FolderType) => folder.id == id);

    const theme = useTheme();

    let isDarkMode = theme.palette.mode === "dark";

    return <Box sx={{
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
        }}>
            <AvatarGroup max={4} sx={{marginRight: 2}}>
                {folder && folder.bookmarks.map((bookmark) => <Avatar
                    src={bookmark.faviconUrl ? bookmark.faviconUrl : `${bookmark.url}/favicon.ico`}
                    key={bookmark.id}
                    sx={{ border: "0px solid transparent" }}
                />)}
            </AvatarGroup>
            <Typography sx={{fontSize: "16px"}}>
                {folder && folder.name}
            </Typography>
        </Box>
    </Box>
}