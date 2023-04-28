import { FaRegHeart, FaStar } from "react-icons/fa";
import { Box, Button, Grid, HStack, Heading, Image, Skeleton, SkeletonText, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query"
import Workout from "../components/Workout";
import WorkoutSkeleton from "../components/WorkoutSkeleton";
import { getWorkouts } from "../api";
import { IWorkoutList } from "../types";


interface IPhoto {
    pk: string;
    file: string;
    description: string;
}

interface IWorkout {
    pk: number;
    name: string;
    country: string;
    city: string;
    rating: number;
    is_host: boolean;
    photos: IPhoto[];
}

export default function Home() {
    const { isLoading, data } = useQuery<IWorkoutList[]>(["workouts"], getWorkouts);
    return (
        <Grid mt={10} px={{ base: 10, lg: 40 }} columnGap={4} rowGap={8} templateColumns={{ sm: "1fr", md: "1fr, 1fr", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)", "2xl": "repeat(5, 1fr)" }}>
            {isLoading ? (
                <>
                    <WorkoutSkeleton />
                    <WorkoutSkeleton />
                    <WorkoutSkeleton />
                    <WorkoutSkeleton />
                </>
            ) : null}
            {data?.map((workout) => (
                <Workout
                    key={workout.pk}
                    pk={workout.pk}
                    isHost={workout.is_host}
                    imageUrl={workout.photos[0]?.file}
                    name={workout.name}
                    rating={workout.rating}
                    city={workout.city}
                    country={workout.country}

                />
            ))}
        </Grid>
    );
}