import type { NextPage } from "next";
import { Container, Heading } from "@chakra-ui/react";
import { Clock } from "../components/clock";

const Home: NextPage = () => {

  const date = new Date();
  let currentTime = `${date.getHours()}:${date.getMinutes()} `;

  return (
    <Container maxW={"90%"}>
      <Clock/>
    </Container>
  );
};

export default Home;
