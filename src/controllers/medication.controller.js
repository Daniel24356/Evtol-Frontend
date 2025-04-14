"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationController = void 0;
const medication_service_implementation_1 = require("../service/implementation/medication-service.implementation");
class MedicationController {
    constructor() {
        this.createMedicine = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const medicationData = req.body;
                const newMedication = yield this.medicationService.createMedicine(medicationData);
                res.status(201).json(newMedication);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllMedicine = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const medicine = yield this.medicationService.getAllMedicine();
                res.status(200).json(medicine);
            }
            catch (error) {
                next(error);
            }
        });
        this.medicationService = new medication_service_implementation_1.MedicationServiceImpl();
    }
}
exports.MedicationController = MedicationController;
