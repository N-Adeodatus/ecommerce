import * as dotenv from 'dotenv';
import { sendEmail } from './src/services/emailService';

// Load environment variables from .env
dotenv.config();

async function runTest() {
  console.log("Testing Brevo Email integration...");
  
  if (!process.env.BREVO_API) {
    console.error("Error: BREVO_API is not set in your .env file!");
    return;
  }

  try {
    const result = await sendEmail({
      // IMPORTANT: Replace this email with your personal email so you can check your inbox!
      to: [{ email: 'nkundiman3@gmail.com', name: 'Test User' }],
      subject: 'Developer Test Email',
      htmlContent: '<h1>It Works!</h1><p>The Brevo SDK is successfully configured and sending emails.</p>'
    });
    console.log("Success! Email queued properly. Result:", result);
  } catch (err) {
    console.error("Test failed:", err);
  }
}

runTest();
