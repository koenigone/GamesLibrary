import {
  List,
  ListItem,
  Image,
  HStack,
  Spinner,
  Button,
  Heading,
  Center,
} from "@chakra-ui/react";
import useGenres, { Genre } from "../hooks/useGenres";

interface Props {
  onSelectGenre: (genre: Genre) => void;
  selectedGenre: Genre | null;
}

function GenreList({ onSelectGenre, selectedGenre }: Props) {
  const { data, isLoading, error } = useGenres();

  if (error) return null;
  if (isLoading) {
    return (
      <Center height="100vh"> {/* Use "height" to center vertically */}
        <Spinner thickness="4px" size="lg" />
      </Center>
    );
  }

  return (
    <HStack display='block' marginLeft={5}>
    <Heading fontSize='2xl' marginBottom={3}>Genres</Heading>
    <List>
      {data.map((genre) => {

        // Shortening the genre's name for a better look
        const ShortenName = genre.name === 'Massively Multiplayer' ? 'Multiplayer' : (genre.name === 'Board Games' ? 'Board' : genre.name);

        return (
            <ListItem key={genre.id} paddingY="7px">
              <HStack spacing={4}>
                <Image
                  src={genre.image_background}
                  boxSize="35px"
                  objectFit='cover'
                  borderRadius={10}
                />
                <Button
                  fontWeight={genre.id === selectedGenre?.id ? "bold" : "normal"}
                  onClick={() => onSelectGenre(genre)}
                  marginLeft='5px'
                  fontSize="md"
                  variant="link"
                >
                  { ShortenName }
                </Button>
              </HStack>
            </ListItem>
          );
        })}
      </List>
    </HStack>
  );
}

export default GenreList;
