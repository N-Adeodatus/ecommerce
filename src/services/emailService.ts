import { BrevoClient, Brevo } from '@getbrevo/brevo';

// Initialize the Brevo client using the API key from environment variables
// Note: You set it as BREVO_API in your .env file
const brevo = new BrevoClient({ 
  apiKey: process.env.BREVO_API || ''
});

export interface SendEmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
}

/**
 * Sends a transactional email using Brevo
 * @param options - The email details (to, subject, htmlContent)
 */
export const sendEmail = async (options: SendEmailOptions) => {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: options.subject,
      htmlContent: options.htmlContent,
      sender: { 
        name: 'Your E-Commerce Store', 
        email: process.env.BREVO_SENDER_EMAIL || 'no-reply@yourstore.com' 
      },
      to: options.to,
    });
    
    console.log('Email sent successfully. Message ID:', result.messageId);
    return result;
  } catch (err: any) {
    if (err instanceof Brevo.UnauthorizedError) {
      console.error('Invalid Brevo API key');
    } else if (err instanceof Brevo.TooManyRequestsError) {
      console.error('Rate limited by Brevo');
    } else {
      console.error('Error sending email:', err.message || err);
    }
    throw err;
  }
};
