import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { BsChevronBarDown } from "react-icons/bs";
import usePlatforms from "../hooks/usePlatforms";
import { Platforms } from "../hooks/useGames";

interface Props {
  onSelectPlatform: (platform: Platforms) => void;
  selectedPlatform: Platforms | null;
}

function PlatfromSelector({ onSelectPlatform, selectedPlatform }: Props) {
  const { data, error } = usePlatforms();

  if (error) return null;

  return (
    <HStack margin="0px 20px">
      <Menu>
        <MenuButton as={Button} rightIcon={BsChevronBarDown}>
          {selectedPlatform?.name || "Platfroms"}
        </MenuButton>
        <MenuList>
          {data.map((platform) => (
            <MenuItem
              onClick={() => onSelectPlatform(platform)}
              key={platform.id}
            >
              {platform.name === "PlayStation" ? "" : platform.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </HStack>
  );
}

export default PlatfromSelector;
