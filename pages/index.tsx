import type { NextPage } from "next";
import { Container, Flex, Heading, IconButton, Input, InputGroup, InputRightElement, SimpleGrid} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { LinksGroup } from "../components/links-group";
import { Link } from "../components/link";
import Router from "next/router";

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

  const search = () => {
    const element = document.getElementById("search-input") as HTMLInputElement;
    if (element) {
      console.log(element.value);
      Router.push(`https://yandex.ru/search/?text=${element.value.replace(' ', '+')}`);
    }
  }

  return (
    <Container maxW={"90%"} mt={10}>

      <Flex justifyContent={"space-between"} flexDirection={["column", "row"]}>
        <Heading>{time}</Heading>
        <Heading>{date}</Heading>
      </Flex>

      <Container maxW={"50%"} mt={10}>
        <InputGroup>
          <Input placeholder="Поиск в Яндекс" id={"search-input"}/>
          <InputRightElement children={<IconButton variant={"ghost"} icon={<SearchIcon/>} color="gray.400" aria-label={"Search"} h='1.75rem' minWidth="50px" size='sm' onClick={search}/>} width="5rem" />
        </InputGroup>
        
      </Container>

      <Container maxW={"90%"} marginTop={10}>
        <SimpleGrid columns={[1, 2, 3]}>
          <LinksGroup minWidth="40%">
            <Link url="https://vk.com/im">Диалоги</Link>
            <Link url="https://ispi.cdo.vlsu.ru">Учебка</Link>
            <Link url="https://music.yandex.ru">Яндекс. Музыка</Link>
            <Link url="https://hd.kinopoisk.ru">Кинопоиск</Link>
            <Link url="https://youtube.com">Youtube</Link>
          </LinksGroup>

          <LinksGroup minWidth="40%">
            <Link url="https://mangalib.me">Mangalib</Link>
            <Link url="https://shikimori.one">Shikimori</Link>
            <Link url="https://darklibria.it">Darklibria</Link>
            <Link url="https://devdocs.io">Devdoc.io</Link>
            <Link url="https://ihateregex.io">I hate regex</Link>
          </LinksGroup>

          <LinksGroup minWidth="40%">
            <Link url="https://vk.com/im">Link 11</Link>
            <Link url="https://vk.com/im">Link 12</Link>
            <Link url="https://vk.com/im">Link 13</Link>
            <Link url="https://vk.com/im">Link 14</Link>
            <Link url="https://vk.com/im">Link 15</Link>
          </LinksGroup>
        </SimpleGrid>
      </Container>

    </Container>
  );
};

export default Home;
