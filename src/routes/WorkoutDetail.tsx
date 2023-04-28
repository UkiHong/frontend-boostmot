import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { checkBooking, getWorkout, getWorkoutReviews } from "../api";
import { IReview, IWorkoutDetail } from "../types";
import { Avatar, Box, Button, Container, Grid, GridItem, HStack, Heading, Image, Skeleton, Text, VStack } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet"

export default function WorkoutDetail() {
    const { workoutPk } = useParams();
    const { isLoading, data } = useQuery<IWorkoutDetail>([`workouts`, workoutPk], getWorkout);
    const { data: reviewsData, isLoading: isReviewsLoading } = useQuery<IReview[]>([`workouts`, workoutPk, `reviews`], getWorkoutReviews);
    const [dates, setDates] = useState<Date[] | undefined>();
    const { data: checkBookingData, isLoading: isCheckingBooking, refetch } = useQuery(["check", workoutPk, dates,], checkBooking, { cacheTime: 0, enabled: dates !== undefined, });
    const handleDateChange = (value: any) => {
        setDates(value);
    };
    return <Box mt={10} px={{ base: 10, lg: 40 }}>
        <Helmet>
            <title>{data ? data.name : "Loading..."}</title>
        </Helmet>
        <Skeleton height={"100px"} width={"25%"} isLoaded={!isLoading}>
            <Heading>
                {data?.name}
            </Heading>
        </Skeleton>

        <Grid mt={4} rounded={"xl"} overflow={"hidden"} gap={2} height="60vh" templateRows={"1fr 1fr"} templateColumns={"repeat(4, 1fr)"}>
            {[0, 1, 2, 3, 4].map((index) =>
                <GridItem
                    colSpan={index === 0 ? 2 : 1}
                    rowSpan={index === 0 ? 2 : 1}
                    overflow={"hidden"}
                    key={index}
                >
                    <Skeleton isLoaded={!isLoading} h="100%" w="100%">
                        {data?.photos && data.photos.length > 0 ? (
                            <Image objectFit={"cover"} w="100%" h="100%" src={data?.photos[index]?.file} />
                        ) : null}
                    </Skeleton>
                </GridItem>
            )}
        </Grid>

        <Grid gap={20} templateColumns={"2fr 1fr"} maxW="container.lg">
            <Box>
                <HStack width={"40%"} justifyContent={"space-between"} mt={10}>
                    <VStack alignContent={"flex-start"}>
                        <Skeleton isLoaded={!isLoading} height={"30px"}>
                            <Heading fontSize={"2xl"}>Workout hosted by {data?.host.name}</Heading>
                        </Skeleton>
                    </VStack>
                    <Avatar name={data?.host.name} size={"xl"} src={data?.host.avatar} />
                </HStack>
                <Box mt={10}>
                    <Heading mb={5} fontSize={"2xl"}>
                        <HStack>
                            <FaStar /> <Text>{data?.rating}</Text>
                            <Text>·</Text>
                            <Text>{reviewsData?.length} Review{reviewsData?.length === 1 ? "" : "s"}</Text>
                        </HStack>
                    </Heading>
                    <Container mt={20} maxW={"container.lg"} marginX={"none"}>
                        <Grid gap={10} templateColumns={"1fr 1fr"}>
                            {reviewsData?.map((review, index) =>
                                <VStack alignItems={"flex-start"} key={index}>
                                    <HStack>
                                        <Avatar name={review.user.name} src={review.user.avatar} size={"md"} />
                                        <VStack spacing={0} alignItems={"flex-start"}>
                                            <Heading fontSize={"md"}>
                                                {review.user.name}
                                            </Heading>
                                            <HStack spacing={1}>
                                                <FaStar size={"12px"} />
                                                <Text>{review.rating}</Text>
                                            </HStack>
                                        </VStack>
                                    </HStack>
                                    <Text>{review.payload}</Text>
                                </VStack>)}
                        </Grid>
                    </Container>
                </Box>
            </Box>
            <Box pt={10}>
                <Calendar
                    onChange={handleDateChange}
                    prev2Label={null}
                    next2Label={null}
                    minDate={new Date()}
                    maxDate={new Date(Date.now() + (60 * 60 * 24 * 7 * 4 * 3 * 1000))}
                    selectRange
                />
                <Button disabled={!checkBookingData?.ok} isLoading={isCheckingBooking} my={5} w="100%" colorScheme={"green"}>
                    Make Booking
                </Button>
                {!isCheckingBooking && !checkBookingData?.ok ?
                    <Text>Can't book on those dates, sorry.</Text> : null}
            </Box>
        </Grid>

    </Box >;
}