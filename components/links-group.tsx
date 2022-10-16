import { Flex } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  minWidth?: string | number;
};

export const LinksGroup = ({ children, minWidth }: Props) => {
  return (
    <Flex
      flexDirection={"column"}
      minWidth={minWidth}
      borderWidth={1}
      borderColor={"grey.500"}
      margin={3}
      padding={2}
      borderRadius="11px"
    >
      {children}
    </Flex>
  );
};
