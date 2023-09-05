import { Games } from "../hooks/useGames";
import PlatformIconList from "./PlatformIconList";
import CriticScore from "./CriticScore";
import getCroppedImageUrl from "../services/image-url";
import {
  Card,
  CardBody,
  Heading,
  Image,
  Text,
  CardFooter,
} from "@chakra-ui/react";
import "./GameCard.css";

interface Prorps {
  game: Games;
}

function GameCard({ game }: Prorps) {
  return (
    <>
      <Card className="main-card">
        <Image
          src={getCroppedImageUrl(game.background_image)}
          borderTopRadius={10}
        />
        <CardBody className="card-body">
          <Heading fontSize={"2xl"}>{game.name}</Heading>
          <PlatformIconList
            platforms={game.parent_platforms.map((p) => p.platform)}
          />
        </CardBody>
        <CardFooter justifyContent={"space-between"}>
          <Text colorScheme="cyan">{game.released}</Text>
          <CriticScore score={game.metacritic} />
        </CardFooter>
      </Card>
    </>
  );
}

export default GameCard;
