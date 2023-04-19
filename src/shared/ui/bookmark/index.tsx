import {Box, Typography} from "@mui/material";
import {FC} from "react";
import {Bookmark as BookmarkType} from "../../../entities/bookmark";

interface BookmarkProps {
    bookmark: BookmarkType;
}

export const Bookmark: FC<BookmarkProps> = ({bookmark}) => {
    return <Box sx={{border: 1, borderRadius: "14px", padding: "10px", cursor: "pointer", userSelect: "none"}}>
        <Typography sx={{fontSize: "16px"}}>
            {bookmark.title}
        </Typography>
    </Box>
};