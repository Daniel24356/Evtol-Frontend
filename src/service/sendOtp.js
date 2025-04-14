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
const infobob_service_1 = __importDefault(require("./infobob.service"));
const sendOtpDirectly = () => __awaiter(void 0, void 0, void 0, function* () {
    const applicationId = "your_application_id"; // Replace with your Infobip Application ID
    const messageId = "your_message_id"; // Replace with your Infobip Message Template ID
    const phoneNumber = "2347026451386"; // Replace with the recipient's phone number
    const infobipService = new infobob_service_1.default();
    try {
        yield infobipService.sendOtp(applicationId, messageId, phoneNumber);
        console.log("OTP sent successfully to", phoneNumber);
    }
    catch (error) {
        console.error("Failed to send OTP:", error);
    }
});
sendOtpDirectly();
