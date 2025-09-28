import { Badge } from "@chakra-ui/react";

interface Props {
  score: number;
}

function CriticScore({ score }: Props) {
  var color =
    score > 75 ? "green" : score > 40 ? "yellow" : score > 1 ? "red" : "";

  return (
    <>
      <Badge
        colorScheme={color}
        fontSize={14}
        paddingX={2}
        paddingY={1}
        borderRadius={5}
      >
        {score}
      </Badge>
    </>
  );
}

export default CriticScore;
