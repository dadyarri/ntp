import type { NextPage } from "next";
import { Container, Flex, Heading, IconButton, Input, InputGroup, InputRightElement} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { LinksGroup } from "../components/links-group";
import { Link } from "../components/link";

const Home: NextPage = () => {

  const [hydrated, setHydrated] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [date, setDate] = useState(new Date().toLocaleDateString());

  useEffect(() => {
    setHydrated(true);
    let timeTimer = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    
    let dateTimer = setInterval(() => {
      setDate(new Date().toLocaleDateString())
    }, 1000)

    return () => {
      clearInterval(timeTimer);
      clearInterval(dateTimer);
    }
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <Container maxW={"90%"} mt={10}>

      <Flex justifyContent={"space-between"}>
        <Heading>{time}</Heading>
        <Heading>{date}</Heading>
      </Flex>

      <Container maxW={"50%"} mt={10}>
        <InputGroup>
          <Input placeholder="Поиск в Яндекс"/>
          <InputRightElement children={<IconButton variant={"ghost"} icon={<SearchIcon/>} color="gray.400" aria-label={"Search"} h='1.75rem' minWidth="50px" size='sm'/>} width="5rem" />
        </InputGroup>
        
      </Container>

      <Container maxW={"90%"} marginTop={10}>
        <Flex justifyContent={"space-evenly"}>
        <LinksGroup>
          <Link>Link 1</Link>
          <Link>Link 2</Link>
          <Link>Link 3</Link>
          <Link>Link 4</Link>
          <Link>Link 5</Link>
        </LinksGroup>

        <LinksGroup>
          <Link>Link 6</Link>
          <Link>Link 7</Link>
          <Link>Link 8</Link>
          <Link>Link 9</Link>
          <Link>Link 10</Link>
        </LinksGroup>

        <LinksGroup>
          <Link>Link 11</Link>
          <Link>Link 12</Link>
          <Link>Link 13</Link>
          <Link>Link 14</Link>
          <Link>Link 15</Link>
        </LinksGroup>
        </Flex>
      </Container>

    </Container>
  );
};

export default Home;
