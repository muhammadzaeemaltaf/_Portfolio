import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";
// Handles POST requests to /api

export async function POST(request: NextRequest) {
  const password = process.env.NEXT_PUBLIC_BURNER_PASSWORD;
  const myEmail = process.env.NEXT_PUBLIC_PERSONAL_EMAIL;

  const formData = await request.formData();
  const email = formData.get("email");
  const message = formData.get("message");
  const subject = formData.get("subject");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: myEmail,
      pass: password,
    },
  });

  try {
    const mail = await transporter.sendMail({
        from: email,
        to: myEmail,
        subject: `Email from Portfolio: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; background-color: #f9f9f9;">
            <h2 style="color: #333; border-bottom: 2px solid #4a90e2; padding-bottom: 10px;">
            <img src="https://www.zaeemaltaf.tech/logo.png" alt="logo" width="36" height="36" style="vertical-align: middle; margin-right: 8px;" />
            New Message from Portfolio</h2>
            <p style="font-size: 16px; color: #555;"><strong>From:</strong> ${email}</p>
            <p style="font-size: 16px; color: #555;"><strong>Subject:</strong> ${subject}</p>
            <div style="margin-top: 20px;">
              <p style="font-size: 16px; color: #555;"><strong>Message:</strong></p>
              <div style="background: #fff; padding: 16px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #ddd;">
                ${message}
              </div>
            </div>
            <footer style="margin-top: 30px; text-align: center; font-size: 14px; color: #999;">
              Sent from your portfolio contact form 🚀
            </footer>
          </div>
        `,
      });
      

    return NextResponse.json({ message: "Success: email was sent" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "COULD NOT SEND MESSAGE" }, { status: 500 });
  }
}
