import { MedicationController } from "../controllers/medication.controller";
import express from "express"

const medicationController = new MedicationController
const medicationRouter = express.Router()

medicationRouter.post("/", medicationController.createMedicine)
medicationRouter.get("/", medicationController.getAllMedicine)

export default medicationRouter
