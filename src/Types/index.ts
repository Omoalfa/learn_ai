import { Request } from "express";

export interface RequestWithAuth extends Request {
  user: IUser;
}

export enum ETables {
  USERS = "users",
  COURSES = "courses",
  COURSE_CONTENTS = "course_contents",
  USER_COURSES = "user_courses",
  RESOURCES = "resources",
}

export enum EUserCourseStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed"
}

export interface IMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface IUser {
  id?: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password?: string;
  is_verified?: boolean;
  deleted_at?: Date,
  updated_at?: Date,
  created_at?: Date,
  password_pin?: string;
  verification_code?: string;
}

export interface IUserCourse {
  id: number;
  user_id: number;
  course_id: number;
  latest_lesson: number;
  course?: ICourse;
  user?: IUser;
  progress?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ICourse {
  id: number;
  name: string;
  description: string;
  creator_id: number;
  creator: IUser;
  created_at?: Date;
  updated_at?: Date;
  contents?: ICourseContent[]
}

export interface ICourseContent {
  id: number;
  title: string;
  content_position: number;
  is_last_lesson: boolean;
  created_at?: Date;
  updated_at?: Date;
  course_id?: number;
  resources?: IContentResource[]
}

export interface IContentResource {
  title: string;
  description?: string;
  links?: string[];
  content_id?: number;
  created_at?: Date;
  updated_at?: Date;
}
