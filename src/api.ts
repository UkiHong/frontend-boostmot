import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import Cookie from "js-cookie";
import { response } from "express";
import { formatDate } from "./lib/utils";
axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8000/api/v1/"
      : "https://boostmot.onrender.com/api/v1/",
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

export const getWorkouts = () =>
  instance.get("workout/").then((response) => response.data);

export const getWorkout = ({ queryKey }: QueryFunctionContext) => {
  const [, workoutPk] = queryKey;
  return instance.get(`workout/${workoutPk}`).then((response) => response.data);
};

export const getWorkoutReviews = ({ queryKey }: QueryFunctionContext) => {
  const [, workoutPk] = queryKey;
  return instance
    .get(`workout/${workoutPk}/reviews`)
    .then((response) => response.data);
};

export const getMe = () =>
  instance.get(`users/me`).then((response) => response.data);

export const logOut = () =>
  instance
    .post(`users/log-out`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export interface IUsernameLoginVariables {
  username: string;
  password: string;
}

export interface IUsernameLoginSuccess {
  ok: string;
}

export interface IUsernameLoginError {
  error: string;
}

export const usernameLogIn = ({
  username,
  password,
}: IUsernameLoginVariables) =>
  instance.post(
    `/users/log-in`,
    { username, password },
    {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    }
  );

interface ISignUpVariables {
  name: string;
  email: string;
  username: string;
  password: string;
  gender: string;
}

export const userSignUp = ({
  username,
  password,
  email,
  name,
  gender,
}: ISignUpVariables) =>
  instance
    .post(
      `users/`,
      { username, password, email, name, gender },
      {
        headers: { "X-CSRFToken": Cookie.get("csrftoken") || "" },
      }
    )
    .then((response) => response.data);

export const getPreparations = () =>
  instance.get(`workout/preparations`).then((response) => response.data);

export const getCategories = () =>
  instance.get(`categories`).then((response) => response.data);

export interface IUploadWorkoutVariables {
  name: string;
  country: string;
  city: string;
  address: string;
  description: string;
  pets_allowed: boolean;
  kind: string;
  host: string;
  avatar: string;
  preparation: number[];
  category: number;
}

export const uploadWorkout = (variables: IUploadWorkoutVariables) =>
  instance
    .post(`workout/`, variables, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export const getUploadURL = () =>
  instance
    .post(`medias/photos/get-url`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export interface IUploadImageVariables {
  file: FileList;
  uploadURL: string;
}

export const uploadImage = ({ file, uploadURL }: IUploadImageVariables) => {
  const form = new FormData();
  form.append("file", file[0]);
  return axios
    .post(uploadURL, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

export interface ICreatePhotoVariables {
  description: string;
  file: string;
  workoutPk: string;
}

export const createPhoto = ({
  description,
  file,
  workoutPk,
}: ICreatePhotoVariables) =>
  instance
    .post(
      `workout/${workoutPk}/photos`,
      { description, file },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

type CheckBookingQueryKey = [string, string?, Date[]?];

export const checkBooking = ({
  queryKey,
}: QueryFunctionContext<CheckBookingQueryKey>) => {
  const [, workoutPk, dates] = queryKey;
  if (dates) {
    const [firstDate, secondDate] = dates;
    const checkIn = formatDate(firstDate);
    const checkOut = formatDate(secondDate);
    return instance
      .get(
        `workout/${workoutPk}/bookings/check?check_in=${checkIn}&check_out=${checkOut}`
      )
      .then((response) => response.data);
  }
};
