import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    Heading,
    Input,
    InputGroup,
    InputLeftAddon,
    InputLeftElement,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Text,
    Textarea,
    VStack,
    useToast,
} from "@chakra-ui/react";
import useHostOnlyPage from "../components/HostOnlyPage";
import ProtectedPage from "../components/ProtectedPage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IUploadWorkoutVariables, getCategories, getPreparations, uploadWorkout } from "../api";
import { ICategory, IPreparation, IWorkoutDetail } from '../types';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


export default function UploadRoom() {
    const { register, handleSubmit } = useForm<IUploadWorkoutVariables>();
    const toast = useToast();
    const navigate = useNavigate();
    const mutation = useMutation(uploadWorkout, {
        onSuccess: (data: IWorkoutDetail) => {
            toast({
                status: "success",
                title: "Workout created",
                position: "bottom-right",
            });
            navigate(`/workout/${data.id}`);
        },

    })
    const { data: preparations, isLoading: isPreparationsLoading } = useQuery<IPreparation[]>(["preparations"], getPreparations);
    const { data: categories, isLoading: isCategoriesLoading } = useQuery<ICategory[]>(["categories"], getCategories);
    useHostOnlyPage();
    const onSubmit = (data: IUploadWorkoutVariables) => {
        mutation.mutate(data);
    }
    return (
        <ProtectedPage>
            <h1>upload workoutttt</h1>
            <Box
                pb={40}
                mt={10}
                px={{
                    base: 10,
                    lg: 40,
                }}
            >
                <Container>
                    <Heading textAlign={"center"}>Upload Workout</Heading>
                    <VStack spacing={10} as="form" onSubmit={handleSubmit(onSubmit)} mt={5}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input {...register("name", { required: true })} required type="text" />
                            <FormHelperText>Write the name of your workout.</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Country</FormLabel>
                            <Input {...register("country", { required: true })} required type="text" />
                        </FormControl>
                        <FormControl>
                            <FormLabel>City</FormLabel>
                            <Input {...register("city", { required: true })} required type="text" />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Address</FormLabel>
                            <Input {...register("address", { required: true })} required type="text" />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea {...register("description", { required: true })} />
                        </FormControl>
                        <FormControl>
                            <Checkbox {...register("pets_allowed", { required: true })}>Pets allowed?</Checkbox>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Kind of Workout</FormLabel>
                            <Select {...register("kind", { required: true })} placeholder="Choose a kind">
                                <option value="football">Football</option>
                                <option value="running">Running</option>
                                <option value="Yoga">Yoga</option>
                            </Select>
                            <FormHelperText>
                                What kind of workout do you want?
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Category</FormLabel>
                            <Select {...register("category", { required: true })} placeholder="Choose a category">
                                {categories?.map(category => <option key={category.pk} value={category.pk}>{category.name}</option>)}
                            </Select>
                            <FormHelperText>
                                What kind of category is your workout?
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Preparations</FormLabel>
                            <Grid templateColumns={"1fr 1fr"} gap={5}>
                                {preparations?.map(preparation => (
                                    <Box key={preparation.pk}>
                                        <Checkbox value={preparation.pk} {...register("preparation", { required: true })}>{preparation.name}</Checkbox>
                                        <FormHelperText>{preparation.description}</FormHelperText>
                                    </Box>
                                ))}
                            </Grid>
                        </FormControl>
                        {mutation.isError ? <Text color="red.500">Something went wrong</Text> : null}
                        <Button type="submit" isLoading={mutation.isLoading} colorScheme="green" size="lg" width="100%">Upload Workout</Button>
                    </VStack>
                </Container>
            </Box>
        </ProtectedPage>
    );
}