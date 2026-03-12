import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const { email } = await req.json();

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

      to: email,

      subject: "Vimal PK Resume",

      html: `
        <h2>Hello 👋</h2>

        <p>Thank you for visiting my portfolio.</p>

        <p>You can download my resume below:</p>

        <a href="https://aortepjbbvixlgouowra.supabase.co/storage/v1/object/public/vimal-official/resume/Vimal_PK.pdf">
        Download Resume
        </a>

        <br/><br/>

        <p>Regards</p>

        <b>Vimal PK</b>
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