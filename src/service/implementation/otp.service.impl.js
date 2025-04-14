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
exports.verifyOtp = exports.sendOtp = void 0;
const client_1 = require("@prisma/client");
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const sendOtp = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    // Save the OTP to the database
    yield prisma.oTP.create({
        data: {
            phoneNumber,
            code: otp,
            expiresAt,
        },
    });
    // Send the OTP via SMS using Twilio
    yield client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
    });
    return { message: "OTP sent successfully" };
});
exports.sendOtp = sendOtp;
const verifyOtp = (phoneNumber, code) => __awaiter(void 0, void 0, void 0, function* () {
    const otpRecord = yield prisma.oTP.findFirst({
        where: {
            phoneNumber,
            code,
            expiresAt: { gte: new Date() }, // Check that the OTP hasn't expired
        },
    });
    if (!otpRecord) {
        throw new Error("Invalid or expired OTP");
    }
    // Delete the OTP after successful verification
    yield prisma.oTP.delete({ where: { id: otpRecord.id } });
    return { message: "OTP verified successfully" };
});
exports.verifyOtp = verifyOtp;
