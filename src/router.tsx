import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import WorkoutDetail from "./routes/WorkoutDetail";
import UploadWorkout from "./routes/UploadWorkout";
import UploadPhotos from "./routes/UploadPhotos";



const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <NotFound />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "workout/upload",
                element: <UploadWorkout />,
            },
            {
                path: "workout/:workoutPk",
                element: <WorkoutDetail />
            },
            {
                path: "workout/:workoutPk/photos",
                element: <UploadPhotos />
            },
        ],
    },
]);

export default router;