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
exports.EvtolServiceImpl = void 0;
const db_1 = require("../../configs/db");
const customError_error_1 = require("../../exceptions/error/customError.error");
class EvtolServiceImpl {
    registerEvtol(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isEvtolExist = yield db_1.db.evtol.findFirst({
                where: {
                    serialNumber: data.serialNumber
                }
            });
            if (isEvtolExist) {
                throw new customError_error_1.CustomError(409, "oops evtol already exist");
            }
            const evtol = yield db_1.db.evtol.create({
                data: {
                    serialNumber: data.serialNumber,
                    model: data.model,
                    weightLimit: data.weightLimit,
                    batteryCapacity: data.batteryCapacity,
                    state: data.state
                }
            });
            return evtol;
        });
    }
    getAllEvtol() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.evtol.findMany();
        });
    }
    loadEvtol(serialNumber, items, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Step 1: Check if the eVTOL exists
            const evtol = yield db_1.db.evtol.findUnique({
                where: { serialNumber }
            });
            if (!evtol) {
                throw new customError_error_1.CustomError(404, "eVTOL not found");
            }
            const medications = yield db_1.db.medication.findMany({
                where: {
                    code: { in: items.map((item) => item.code) } // Find medications that match the passed `codes`
                }
            });
            if (medications.length !== items.length) {
                throw new customError_error_1.CustomError(404, "Some medications were not found");
            }
            yield db_1.db.loadedMedication.createMany({
                data: medications.map((med) => ({
                    evtolId: evtol.id,
                    medicationId: med.id,
                    loadedByUserId: userId,
                    loadedAt: new Date()
                }))
            });
            // Step 3: Update eVTOL with medications by connecting their IDs
            const updatedEvtol = yield db_1.db.evtol.update({
                where: { serialNumber },
                data: {
                    medications: {
                        connect: medications.map((med) => ({ id: med.id })) // Connect using medication IDs
                    }
                }
            });
            return updatedEvtol;
        });
    }
    checkLoadedEvtolItems(serialNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const evtol = yield db_1.db.evtol.findFirst({
                where: { serialNumber },
                include: { medications: true }
            });
            if (!evtol) {
                throw new customError_error_1.CustomError(404, "eVTOL not found");
            }
            return evtol.medications;
        });
    }
    checkBatteryLevel(serialNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const evtol = yield db_1.db.evtol.findUnique({
                where: { serialNumber },
            });
            if (!evtol) {
                throw new Error("EVTOL not found");
            }
            // Log battery level
            yield db_1.db.batteryLog.create({
                data: {
                    evtolId: evtol.id,
                    level: evtol.batteryCapacity,
                },
            });
            return evtol.batteryCapacity;
        });
    }
    checkAvailableEvtolForLoading(serialNumber, items) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the eVTOL by serial number
            const evtol = yield db_1.db.evtol.findUnique({
                where: { serialNumber },
                include: { medications: { select: { id: true, weight: true } } }
            });
            if (!evtol) {
                throw new customError_error_1.CustomError(404, "eVTOL not found");
            }
            console.log("Checking eVTOL:", evtol);
            console.log("Battery Capacity:", evtol.batteryCapacity);
            // Prevent loading if battery is below 25%
            if (evtol.batteryCapacity < 25) {
                throw new customError_error_1.CustomError(400, "This item cannot be loaded until battery is higher than 25%");
            }
            const medicationCodes = items.map((item) => item.code);
            const existingMedications = yield db_1.db.medication.findMany({
                where: { code: { in: medicationCodes } },
                select: { id: true, weight: true }
            });
            console.log("Existing medications:", existingMedications);
            // Calculate total medication weight
            const newWeight = existingMedications.reduce((sum, med) => sum + med.weight, 0);
            const existingWeight = evtol.medications.reduce((sum, med) => sum + med.weight, 0);
            const totalWeight = newWeight + existingWeight;
            console.log("New weight:", newWeight);
            console.log("Existing weight:", existingWeight);
            console.log("Total weight:", totalWeight);
            // Prevent loading if weight exceeds limit
            if (totalWeight > evtol.weightLimit) {
                throw new customError_error_1.CustomError(400, "Total medication weight exceeds eVTOL weight limit");
            }
            let newState = "LOADING";
            if (totalWeight === evtol.weightLimit) {
                newState = "LOADED";
            }
            const updatedEvtol = yield db_1.db.evtol.update({
                where: { serialNumber },
                data: {
                    state: newState,
                    medications: {
                        connect: existingMedications.map((med) => ({ id: med.id }))
                    }
                },
                include: { medications: true }
            });
            return updatedEvtol;
        });
    }
    getLoadedMedications() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.loadedMedication.findMany({
                include: {
                    evtol: true,
                    medication: true,
                    loadedBy: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    }
                }
            });
        });
    }
}
exports.EvtolServiceImpl = EvtolServiceImpl;
