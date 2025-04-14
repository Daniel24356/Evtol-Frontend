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
exports.EvtolController = void 0;
const evtol_service_implementation_1 = require("../service/implementation/evtol-service.implementation");
const customError_error_1 = require("../exceptions/error/customError.error");
class EvtolController {
    constructor() {
        this.createEvtol = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const evtolData = req.body;
                const newEvtol = yield this.evtolService.registerEvtol(evtolData);
                res.status(201).json(newEvtol);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllEvtol = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const evtol = yield this.evtolService.getAllEvtol();
                res.status(200).json(evtol);
            }
            catch (error) {
                next(error);
            }
        });
        this.loadEvtol = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { serialNumber, medications } = req.body;
                const userId = Number(req.userAuth); // Convert to number
                if (isNaN(userId)) {
                    throw new customError_error_1.CustomError(401, "Unauthorized: Invalid user ID");
                }
                // Call service to load the medications based on the passed IDs
                const updatedEvtol = yield this.evtolService.loadEvtol(serialNumber, medications, userId);
                res.status(200).json(updatedEvtol);
            }
            catch (error) {
                next(error);
            }
        });
        this.checkLoadedEvtolItems = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { serialNumber } = req.params;
                const medications = yield this.evtolService.checkLoadedEvtolItems(serialNumber);
                res.status(200).json(medications);
            }
            catch (error) {
                next(error);
            }
        });
        this.checkBatteryLevel = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { serialNumber } = req.params;
                const batteryLevel = yield this.evtolService.checkBatteryLevel(serialNumber);
                res.json({ batteryLevel });
            }
            catch (error) {
                next(error);
            }
        });
        this.checkAvailableEvtolForLoading = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { serialNumber, medications } = req.body;
                // Call the service method
                const updatedEvtol = yield this.evtolService.checkAvailableEvtolForLoading(serialNumber, medications);
                res.status(200).json(updatedEvtol);
            }
            catch (error) {
                next(error);
            }
        });
        this.getLoadedMedications = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const loadedMedications = yield this.evtolService.getLoadedMedications();
                res.status(200).json(loadedMedications);
            }
            catch (error) {
                next(error);
            }
        });
        this.evtolService = new evtol_service_implementation_1.EvtolServiceImpl();
    }
}
exports.EvtolController = EvtolController;
