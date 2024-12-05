import { sendExpirationAlert } from "@/utils/sendEmail";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { to, subject, text } = req.body;

      // If essential data is missing
      if (!to || !subject || !text) {
        return res.status(400).json({ error: 'Required email fields are missing' });
      }

      // Construct email content from the provided fields
      const emailContent = {
        subject,
        text,
      };

      // Call the function to send the email
      await sendExpirationAlert({ to, ...emailContent });

      return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error in sending email:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
