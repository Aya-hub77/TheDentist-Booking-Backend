import transporter from '../middleware/mailer.js';

export const sendEmail = async (req, res) => {
  const { service, name, email, phone, date, time, status } = req.body;
  const subject = "Booking Confirmation";
  const text = `
Hello ${name},

Thank you for booking an appointment! Here are your booking details:

- Service: ${service}
- Date: ${date}
- Time: ${time}
- Email: ${email}
- Phone: ${phone}
- Status: ${status}

We look forward to seeing you!

Best regards,
TheDentist
`;
  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER, to: email, subject, text, });
    res.status(200).json({ message: "Confirmation email sent successfully" });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ message: "Failed to send confirmation email" });
  }
};