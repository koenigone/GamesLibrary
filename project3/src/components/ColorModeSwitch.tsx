import { Button, HStack, useColorMode } from "@chakra-ui/react";
import { BsSunFill, BsMoonFill } from "react-icons/bs";

function ColorModeSwitch() {
  const { colorMode, toggleColorMode } = useColorMode();
  const colorSwitch = colorMode === "light" ? <BsMoonFill /> : <BsSunFill />;
  const backgroundSwitch = colorMode === "light" ? "#030a17" : "#ffff";
  const fontSwitch = colorMode === "light" ? "white" : "black";

  return (
    <>
      <HStack>
        <Button
          borderRadius={50}
          onClick={toggleColorMode}
          color={fontSwitch}
          backgroundColor={backgroundSwitch}
        >
          {colorSwitch}
        </Button>
      </HStack>
    </>
  );
}

export default ColorModeSwitch;
