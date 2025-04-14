import { MedicationController } from "../controllers/medication.controller";
import express from "express"
import { authenticateUser } from "../Middleware/auth.middleware";
import { isAdmin } from "../Middleware/isAdmin.middleware";

const medicationController = new MedicationController
const medicationRouter = express.Router()

medicationRouter.post("/", authenticateUser, isAdmin, medicationController.createMedicine)
medicationRouter.get("/", authenticateUser,  medicationController.getAllMedicine)

export default medicationRouter
