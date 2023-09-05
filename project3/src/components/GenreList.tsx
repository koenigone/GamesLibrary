import {
  List,
  ListItem,
  Image,
  HStack,
  Spinner,
  Button,
} from "@chakra-ui/react";
import useGenres, { Genre } from "../hooks/useGenres";

interface Props {
  onSelectGenre: (genre: Genre) => void;
  selectedGenre: Genre | null;
}

function GenreList({ onSelectGenre, selectedGenre }: Props) {
  const { data, isLoading, error } = useGenres();

  if (error) return null;
  if (isLoading) return <Spinner thickness="4px" size="lg" />;

  return (
    <List>
      {data.map((genre) => (
        <ListItem key={genre.id} paddingY="7px" paddingX="20px">
          <HStack spacing={4}>
            <Image
              src={genre.image_background}
              boxSize="35px"
              borderRadius={10}
            />
            <Button
              fontWeight={genre.id === selectedGenre?.id ? "bold" : "normal"}
              onClick={() => onSelectGenre(genre)}
              fontSize="md"
              variant="link"
            >
              {genre.name}
            </Button>
          </HStack>
        </ListItem>
      ))}
    </List>
  );
}

export default GenreList;
