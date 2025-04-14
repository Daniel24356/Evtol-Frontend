"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../controllers/course.controller");
const courseController = new course_controller_1.CourseContoller();
const courseRouter = express_1.default.Router();
courseRouter.post("/", courseController.createCourse);
// courseRouter.get("/", courseController.getAllCourses);
// courseRouter.get("/:id", courseController.getCourseById);
// courseRouter.patch("/:id", courseController.updateCourses);
// courseRouter.delete("/:id", courseController.deleteCourses);
exports.default = courseRouter;
