import { FaCamera, FaRegHeart, FaStar } from "react-icons/fa";
import { Box, Button, Grid, HStack, Image, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

interface IWorkoutProps {
    imageUrl: string;
    name: string;
    rating: number;
    city: string;
    country: string;
    pk: number;
    isHost: boolean;
}

export default function Workout({
    pk, imageUrl, name, rating, city, country, isHost,
}: IWorkoutProps) {
    const gray = useColorModeValue("gray.600", "gray.300");
    const navigate = useNavigate();
    const onCameraClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigate(`/workout/${pk}/photos`);
    };
    return (
        <Link to={`/workout/${pk}`}><VStack alignItems={"flex-start"}>
            <Box position={"relative"} overflow={"hidden"} mb={3} rounded={"3xl"}>
                <Image objectFit={"cover"} minH="280" src={imageUrl} />
                <Button onClick={onCameraClick} variant={"unstyled"} cursor={"pointer"} position={"absolute"} top={0} right={0} color={"white"}>
                    {isHost ? <FaCamera size={"20px"} /> : <FaRegHeart size={"20px"} />}
                </Button>
            </Box>
            <Box>
                <Grid gap={2} templateColumns={"6fr 1fr"}>
                    <Text as="b" noOfLines={1} fontSize={"md"}>
                        {name}
                    </Text>
                    <HStack>
                        <FaStar size={15} />
                        <Text>{rating}</Text>
                    </HStack>
                </Grid>
            </Box>
            <Text fontSize={"sm"} color={"gray"} >
                {city}, {country}
            </Text>
        </VStack></Link>
    )
}