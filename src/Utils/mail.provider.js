import nodemailer from "nodemailer";

export const mailProviderService = async (
  email,
  subject,
  emailTemplate,
  otp
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NOTE_MAIL,
      pass: process.env.NOTE_MAIL_CODE,
    },
  });

  //   main info
  const info = await transporter.sendMail({
    from: `Orebi2204 Ecommerce💛💛💛 <${process.env.NOTE_MAIL}> `, // sender address
    to: email, // list of receivers
    subject: subject,
    // text: "Send Mail Orebi",
    html: emailTemplate(otp), // html body
  });
};
