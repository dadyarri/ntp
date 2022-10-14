import { Flex } from "@chakra-ui/react"
import React, { ReactNode } from "react"

type Props = {
    children: ReactNode
}

export const LinksGroup = ({ children }: Props) => {
    return <Flex flexDirection={"column"} borderWidth={1} borderColor={"grey.500"} maxWidth={"20%"} padding={2} borderRadius="11px">
        {children}
    </Flex>
}