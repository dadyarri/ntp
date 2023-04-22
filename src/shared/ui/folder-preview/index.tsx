import {Box, Grid, Modal, Paper, Stack, Typography} from "@mui/material";
import React, {FC} from "react";
import {Folder} from "../../../entities/folder";
import {Bookmark} from "../bookmark";

interface FolderPreviewProps {
    open: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    folder: Folder | null
}

export const FolderPreview: FC<FolderPreviewProps> = ({open, onClose, folder}) => {
    return (folder && <Modal open={open} onClose={onClose}>
        <Paper sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 850,
            padding: 3
        }}>
            <Typography variant={"h6"} sx={{marginBottom: 3}}>{folder.name}</Typography>

            <Box sx={{display: "grid", gap: 2, gridTemplateColumns: 'repeat(3, 1fr)'}}>
                {folder.bookmarks.map((bookmark) => <Bookmark bookmark={bookmark}/>)}
            </Box>
        </Paper>
    </Modal>)
}