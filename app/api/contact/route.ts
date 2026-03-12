import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const { name, email, message } = await req.json();

    const transporter = nodemailer.createTransport({

      host: process.env.EMAIL_HOST,

      port: Number(process.env.EMAIL_PORT),

      secure: true,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }

    });

    await transporter.sendMail({

      from: process.env.EMAIL_FROM,

      to: process.env.ADMIN_EMAIL,

      subject: `New Portfolio Message from ${name}`,

      html: `
        <h2>New Contact Message</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Message:</strong></p>
        <p>${message}</p>

        <hr/>

        <p>This message was sent from your portfolio contact form.</p>
      `

    });

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );

  }

}