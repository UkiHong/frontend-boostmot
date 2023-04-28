export interface IWorkoutPhotoPhoto {
  pk: string;
  file: string;
  description: string;
}

export interface IWorkoutList {
  pk: number;
  name: string;
  country: string;
  city: string;
  rating: number;
  is_host: boolean;
  photos: IWorkoutPhotoPhoto[];
}

export interface IWorkoutHost {
  name: string;
  username: string;
  avatar: string;
}

export interface IPreparation {
  pk: string;
  name: string;
  description: string;
}

export interface ICategory {
  pk: number;
  name: string;
  kind: string;
}

export interface IWorkoutDetail extends IWorkoutList {
  id: number;
  created_at: string;
  updated_at: string;
  workout: number;
  description: string;
  address: string;
  pets_allowed: true;
  kind: string;
  is_host: boolean;
  is_liked: boolean;
  category: ICategory;
  host: IWorkoutHost;
  preparations: IPreparation[];
}

export interface IReview {
  payload: string;
  rating: number;
  user: IWorkoutHost;
}

export interface IUser {
  last_login: string;
  username: string;
  email: string;
  date_joined: string;
  avatar: string;
  name: string;
  is_host: boolean;
  gender: string;
  language: string;
}
