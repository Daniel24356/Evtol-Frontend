import { Course } from "@prisma/client";
import { CreateCourseDTO } from "../../dto/createCourse.dto";
import { db } from "../../configs/db";
import { CustomError } from "../../exceptions/error/customError.error";
import { CourseService } from "./course-service";


export class CourseServiceImpl implements CourseService{
    async createCourse(data: CreateCourseDTO): Promise<Course> {
        const isCourseExist = await db.course.findFirst({
            where: {
                title: data.title,
            }
        });
        
        if(isCourseExist){
            throw new CustomError(409, "Course already added")
        }
        const course = await db.course.create({
            data: {
              title: data.title,
              description: data.description,
              price: data.price,
              duration: data.duration,
            },
          });
          
        return course;
    }

    async getCourseById(id: number): Promise<Course | null> {
        const course = await db.course.findUnique({
            where : {
                id,
            }
        })
        if(!course){
            throw new CustomError (404, `Course with id: ${id} is not found`)
        }
        return course;
    }

    async getAllCourses(): Promise<Course[]> {
        return await db.course.findMany()
    }

    async updateCourse(id: number, data: Partial<CreateCourseDTO>): Promise<Course> {
        const isCourseAvailable = await db.course.findFirst({
            where: {
                id,
            },
        })
        if(!isCourseAvailable){
            throw new CustomError (404, `Course with id: ${id} is not found`)
        }
        const course = await db.course.update({
            where: { id },
            data,
        })
        return course;
    }

    async deleteCourse(id: number): Promise<void> {
        await db.course.delete({
            where: { id },
        })
    }
}