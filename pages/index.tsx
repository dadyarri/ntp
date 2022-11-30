import type { NextPage } from "next";
import {
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { LinksGroup } from "../components/links-group";
import { Link } from "../components/link";
import Router from "next/router";

type Bookmark = {
  title: string,
  url: string
}

const Home: NextPage = () => {
  const [hydrated, setHydrated] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [date, setDate] = useState(new Date().toLocaleDateString());

  const search = () => {
    const element = document.getElementById("search-input") as HTMLInputElement;
    if (element) {
      console.log(element.value);
      Router.push(
        `https://yandex.ru/search/?text=${element.value.replace(" ", "+")}`
      );
    }
  };

  const handleKeyPress = useCallback((event: { key: any }) => {
    const element = document.getElementById("search-input") as HTMLInputElement;

    if (event.key == "Enter" && element.value == "") {
      element.focus();
    } else if (
      event.key == "Enter" &&
      element.value != "" &&
      element === document.activeElement
    ) {
      search();
    }
  }, []);

  useEffect(() => {
    setHydrated(true);
    let timeTimer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    let dateTimer = setInterval(() => {
      setDate(new Date().toLocaleDateString());
    }, 1000);

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      clearInterval(timeTimer);
      clearInterval(dateTimer);
    };
  }, [handleKeyPress]);

  if (!hydrated) {
    return null;
  }

  const bookmarks: Array<Array<Bookmark>> = [
    [
      {
        "url": "https://vk.com/im",
        "title": "Диалоги"
      },
      {
        "url": "https://ispi.cdo.vlsu.ru",
        "title": "Учебка"
      },
      {
        "url": "https://music.yandex.ru",
        "title": "Яндекс. Музыка"
      },
      {
        "url": "https://hd.kinopoisk.ru",
        "title": "Кинопоиск"
      },
      {
        "url": "https://youtube.com",
        "title": "YouTube"
      },
      {
        "url": "https://github.com",
        "title": "GitHub"
      }
    ],
    [
      {
        "url": "https://mangalib.me",
        "title": "MangaLib"
      },
      {
        "url": "https://shikimori.one",
        "title": "Shikimori"
      },
      {
        "url": "https://darklibria.it",
        "title": "DarkLibria"
      },
      {
        "url": "https://devdocs.io",
        "title": "DevDocs"
      },
      {
        "url": "https://ihateregex.io",
        "title": "I Hate Regex"
      },
      {
        "url": "https://regex101.com",
        "title": "Regex101"
      },
    ],
    [
      {
        "url": "https://calendar.google.com",
        "title": "Календарь"
      },
      {
        "url": "https://mail.google.com",
        "title": "Почта"
      },
      {
        "url": "https://translate.yandex.ru",
        "title": "Переводчик"
      },
      {
        "url": "https://weather.yandex.ru",
        "title": "Погода"
      },
      {
        "url": "https://keep.google.com",
        "title": "Google Keep"
      },
      {
        "url": "https://drive.google.com",
        "title": "Диск"
      },
    ]
  ]

  return (
    <Container maxW={"90%"} mt={10}>
      <Flex justifyContent={"space-between"} flexDirection={["column", "row"]}>
        <Heading>{time}</Heading>
        <Heading>{date}</Heading>
      </Flex>

      <Container maxW={"50%"} mt={10}>
        <InputGroup>
          <Input placeholder="Поиск в Яндекс" id={"search-input"} />
          <InputRightElement
            children={
              <IconButton
                variant={"ghost"}
                icon={<SearchIcon />}
                color="gray.400"
                aria-label={"Search"}
                h="1.75rem"
                minWidth="50px"
                size="sm"
                onClick={search}
              />
            }
            width="5rem"
          />
        </InputGroup>
      </Container>

      <Container maxW={"90%"} marginTop={10} alignItems="center">
        <SimpleGrid columns={[1, 2, 2, 3]}>
          {bookmarks.map((group, index) => (
            <LinksGroup key={index} minWidth={`${100 / bookmarks.length}%`}>
              {group.map((bookmark, index) => (
                <Link key={index} url={bookmark.url}>{bookmark.title}</Link>
              ))}
            </LinksGroup>
          ))}
        </SimpleGrid>
      </Container>
    </Container>
  );
};

export default Home;
