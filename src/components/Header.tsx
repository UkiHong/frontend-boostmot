import { FaMoon, FaSun } from "react-icons/fa";
import { GiThreeFriends } from "react-icons/gi";
import {
  Avatar,
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  LightMode,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Toast,
  ToastId,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import useUser from "../lib/useUser";
import { logOut } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";


export default function Header() {
  const { userLoading, isLoggedIn, user } = useUser();
  const {
    isOpen: isLoginOpen,
    onClose: onLoginClose,
    onOpen: onLoginOpen,
  } = useDisclosure();
  const {
    isOpen: isSignUpOpen,
    onClose: onSignUpClose,
    onOpen: onSignUpOpen,
  } = useDisclosure();
  const { toggleColorMode } = useColorMode();
  const Icon = useColorModeValue(FaMoon, FaSun);
  const toast = useToast();
  const queryClient = useQueryClient();
  const toastId = useRef<ToastId>();
  const mutation = useMutation(logOut, {
    onMutate: () => {
      toastId.current = toast({
        title: "Login out...",
        description: "Sad to see you go...",
        status: "loading",
        position: "bottom-right"
      });
    },
    onSuccess: () => {
      if (toastId.current) {
        queryClient.refetchQueries(["me"]);
        toast.update(toastId.current, {
          status: "success",
          title: "Done!",
          description: "See you later!",
        });
      }
    }
  })
  const onLogOut = async () => {
    mutation.mutate();
  }
  return (
    <Stack
      justifyContent={"space-between"}
      alignItems="center"
      py={5}
      px={40}
      direction={{ sm: "column", md: "row", }}
      spacing={{ sm: 4, md: 0 }}
      borderBottomWidth={1}
    >
      <Box color="green.500">
        <Link to={"/"}>
          <GiThreeFriends size={"48"} />
        </Link>
      </Box>
      <HStack spacing={2}>
        <IconButton
          onClick={toggleColorMode}
          variant={"ghost"}
          aria-label="Toggle dark mode"
          icon={<Icon />}
        />
        {!userLoading ? !isLoggedIn ? (<>
          <Button onClick={onLoginOpen}>Log in</Button>
          <LightMode>
            <Button onClick={onSignUpOpen} colorScheme={"green"}>
              Sign up
            </Button>
          </LightMode>
        </>
        ) : (
          <Menu>
            <MenuButton>
              <Avatar name={user?.name} src={user?.avatar} size={"md"} />
            </MenuButton>
            <MenuList>
              {user?.is_host ?
                <Link to="/workout/upload">
                  <MenuItem>Upload Workout</MenuItem>
                </Link> : null}
              <MenuItem onClick={onLogOut}>Log out</MenuItem>
            </MenuList>
          </Menu>

        ) : null}
      </HStack>
      <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
      <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
    </Stack>
  );
}