import express from "express"
import { CourseContoller } from "../controllers/course.controller";

const courseController = new CourseContoller();
const courseRouter = express.Router();

courseRouter.post("/", courseController.createCourse);
// courseRouter.get("/", courseController.getAllCourses);
// courseRouter.get("/:id", courseController.getCourseById);
// courseRouter.patch("/:id", courseController.updateCourses);
// courseRouter.delete("/:id", courseController.deleteCourses);

export default courseRouter;