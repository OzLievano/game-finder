import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

// Load environment variables from .env file
dotenv.config();

// Set the SendGrid API key
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
// Make sure you store your API key securely
const sendMatchNotificationEmail = async (
  playerAEmail,
  playerBEmail,
  discordChannelLink,
  playerAName,
  playerBName
) => {
  const msgA = {
    to: playerAEmail,
    from: "osvaldoalievano@gmail.com", // Replace with your verified email
    subject: "Match Scheduled! Join the Discord Channel",
    text: `Hello ${playerAName},\n\nA match has been scheduled for you with ${playerBName}. You can join the match via the following Discord channel:\n${discordChannelLink}`,
    html: `<strong>Hello ${playerAName},</strong><br><br>A match has been scheduled for you with ${playerBName}. You can join the match via the following Discord channel:<br><a href="${discordChannelLink}">${discordChannelLink}</a>`,
  };

  const msgB = {
    to: playerBEmail,
    from: "osvaldoalievano@gmail.com", // Replace with your verified email
    subject: "Match Scheduled! Join the Discord Channel",
    text: `Hello ${playerBName},\n\nA match has been scheduled for you with ${playerAName}. You can join the match via the following Discord channel:\n${discordChannelLink}`,
    html: `<strong>Hello ${playerBName},</strong><br><br>A match has been scheduled for you with ${playerAName}. You can join the match via the following Discord channel:<br><a href="${discordChannelLink}">${discordChannelLink}</a>`,
  };

  try {
    // Send emails to both players
    await sgMail.send(msgA);
    await sgMail.send(msgB);
    console.log("Emails sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendMatchNotificationEmail;
