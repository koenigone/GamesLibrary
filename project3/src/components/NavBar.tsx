import { HStack, Image } from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import logo from "../assets/logo.webp";

function NavBar() {
  return (
    <HStack justifyContent="space-between" padding="20px">
      <Image src={logo} boxSize="70px" />
      <ColorModeSwitch />
    </HStack>
  );
}

export default NavBar;
