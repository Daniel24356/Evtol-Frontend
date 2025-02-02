import { PrismaClient } from "@prisma/client";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOtp = async (phoneNumber: string) => {
  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set expiration time (10 minutes from now)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Save the OTP to the database
  await prisma.oTP.create({
    data: {
      phoneNumber,
      code: otp,
      expiresAt,
    },
  });

  // Send the OTP via SMS using Twilio
  await client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });

  return { message: "OTP sent successfully" };
};

export const verifyOtp = async (phoneNumber: string, code: string) => {
  const otpRecord = await prisma.oTP.findFirst({
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
  await prisma.oTP.delete({ where: { id: otpRecord.id } });

  return { message: "OTP verified successfully" };
};

