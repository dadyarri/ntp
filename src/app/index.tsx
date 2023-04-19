import {useEffect, useState} from 'react'
import {Container, Typography} from "@mui/material";
import {DateTime} from "luxon";

function Index() {

    const [dateTime, setDateTime] = useState(DateTime.now());

    useEffect(() => {
        setTimeout(
            () => setDateTime(DateTime.now()),
            1000
        );
    }, [dateTime])

    return (
        <Container maxWidth={"md"} sx={{
            minHeight: "100px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        }}>
            <Typography variant={"h3"}>{dateTime.toFormat("hh:mm:ss")}</Typography>
            <Typography variant={"h3"}>{dateTime.toFormat("dd.MM.yyyy")}</Typography>
        </Container>
    );
}

export default Index
