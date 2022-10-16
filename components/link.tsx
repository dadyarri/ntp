import { Box, Text, Image, Flex, Link as ChLink } from "@chakra-ui/react";

import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  url: string;
};

export const Link = ({ children, url }: Props) => {
  return (
    <ChLink href={url}>
      <Box
        borderWidth={1}
        borderColor={"grey.500"}
        margin={2}
        textAlign="center"
        padding={2}
        borderRadius="11px"
        minWidth={"200px"}
      >
        <Flex justifyContent={"space-between"}>
          <Image
            src={`https://www.google.com/s2/favicons?domain=${url}`}
            width="24px"
            height="24px"
          />
          <Text>{children}</Text>
        </Flex>
      </Box>
    </ChLink>
  );
};
