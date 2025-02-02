import InfobipService from "./infobob.service";

const sendOtpDirectly = async () => {
  const applicationId = "your_application_id"; // Replace with your Infobip Application ID
  const messageId = "your_message_id";       // Replace with your Infobip Message Template ID
  const phoneNumber = "2347026451386";       // Replace with the recipient's phone number

  const infobipService = new InfobipService();

  try {
    await infobipService.sendOtp(applicationId, messageId, phoneNumber);
    console.log("OTP sent successfully to", phoneNumber);
  } catch (error) {
    console.error("Failed to send OTP:", error);
  }
};

sendOtpDirectly();
