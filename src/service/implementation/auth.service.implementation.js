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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServiceImp = void 0;
const db_1 = require("../../configs/db");
const customError_error_1 = require("../../exceptions/error/customError.error");
const password_utils_1 = require("../../utils/password.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthServiceImp {
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExist = yield db_1.db.user.findUnique({
                where: {
                    email: data.email
                },
            });
            if (!isUserExist) {
                throw new customError_error_1.CustomError(401, "Invalid password or email");
            }
            const isPasswordValid = yield (0, password_utils_1.comparePassword)(data.password, isUserExist.password || '');
            if (!isPasswordValid) {
                throw new customError_error_1.CustomError(401, "invalid password or email");
            }
            const fullname = isUserExist.firstName + " " + isUserExist.lastName;
            const accessToken = this.generateAcessToken(isUserExist.id, fullname, isUserExist.role);
            const refreshToken = this.generateRefreshToken(isUserExist.id, fullname, isUserExist.role);
            return { accessToken, refreshToken };
        });
    }
    generateAcessToken(userId, name, role) {
        return jsonwebtoken_1.default.sign({ id: userId, name: role }, process.env.JWT_SECRET || '', {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
        });
    }
    generateRefreshToken(userId, name, role) {
        return jsonwebtoken_1.default.sign({ id: userId, name: role }, process.env.JWT_SECRET || '', {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        });
    }
    generateOtpExpiration() {
        return new Date(Date.now() + 10 * 60 * 1000);
    }
}
exports.AuthServiceImp = AuthServiceImp;
