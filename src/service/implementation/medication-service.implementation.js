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
exports.MedicationServiceImpl = void 0;
const db_1 = require("../../configs/db");
const customError_error_1 = require("../../exceptions/error/customError.error");
class MedicationServiceImpl {
    createMedicine(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isMedicineExist = yield db_1.db.medication.findFirst({
                where: {
                    code: data.code
                }
            });
            if (isMedicineExist) {
                throw new customError_error_1.CustomError(400, "Medicine with this code already exist");
            }
            const medicine = yield db_1.db.medication.create({
                data: {
                    name: data.name,
                    weight: data.weight,
                    code: data.code,
                    imageUrl: data.imageUrl
                }
            });
            return medicine;
        });
    }
    getAllMedicine() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.medication.findMany();
        });
    }
}
exports.MedicationServiceImpl = MedicationServiceImpl;
