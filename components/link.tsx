import { Box, Text } from "@chakra-ui/react"

import React, { ReactNode } from "react"

type Props = {
    children: ReactNode
}

export const Link = ({children}: Props) => {
    return <Box borderWidth={1} borderColor={"grey.500"} margin={2} textAlign="center" padding={2} borderRadius="11px" minWidth={"200px"}>
        <Text>{children}</Text>
    </Box>
}