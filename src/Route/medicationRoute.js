"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medication_controller_1 = require("../controllers/medication.controller");
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../Middleware/auth.middleware");
const isAdmin_middleware_1 = require("../Middleware/isAdmin.middleware");
const medicationController = new medication_controller_1.MedicationController;
const medicationRouter = express_1.default.Router();
medicationRouter.post("/", auth_middleware_1.authenticateUser, isAdmin_middleware_1.isAdmin, medicationController.createMedicine);
medicationRouter.get("/", auth_middleware_1.authenticateUser, isAdmin_middleware_1.isAdmin, medicationController.getAllMedicine);
exports.default = medicationRouter;
