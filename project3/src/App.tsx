import { Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";
import GenreList from "./components/GenreList";
import { useState } from "react";
import { Genre } from "./hooks/useGenres";
import { Platforms } from "./hooks/useGames";
import PlatfromSelector from "./components/PlatformSelector";
import SortSelector from "./components/SortSelector";
import "./Scrollbar-custom.css";

export interface GameQuery {
  genre: Genre | null;
  platform: Platforms | null;
}

function App() {

  const [gameQuery, setGameQuery] = useState<GameQuery>({} as GameQuery)
  return (
    <>
      <Grid
        fontFamily="sans-serif"
        templateAreas={{
          base: `"main" "nav"`,
          lg: `"nav nav" "aside main"`,
        }}
        templateColumns={{
          base: "1fr",
          lg: "200px 1fr",
        }}
      >
        <GridItem area="nav">
          <NavBar />
        </GridItem>
        <Show above="lg">
          <GridItem area="aside">
            <GenreList
              selectedGenre={gameQuery.genre}
              onSelectGenre={(genre) => setGameQuery({ ...gameQuery, genre })}
            />
          </GridItem>
        </Show>
        <GridItem area="main">
          <HStack spacing={4} paddingLeft={3}>
            <PlatfromSelector
              selectedPlatform={gameQuery.platform}
              onSelectPlatform={(platform) => setGameQuery({ ...gameQuery, platform })}
            />
            <SortSelector />
          </HStack>
          <GameGrid
            gameQuery={gameQuery}
          />
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
