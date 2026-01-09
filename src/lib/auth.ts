import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path

// setup nodemailer to send email
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  trustedOrigins: [process.env.API_URL!], //allowing client request

  // adding additional fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  //   enableing authentication
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  //   send verification email
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification : true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationURL = `${process.env.API_URL}/verify-email?token=${token}`;

      try {
        const info = await transporter.sendMail({
          from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
          to: user.email,
          subject: "Email verification",
          text: `Hello ${user.name}, please verify your email using this link: ${verificationURL}`,
          html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Email Verification</title>
      </head>
      <body style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">
          
          <h2 style="color:#2563eb;">Verify your email</h2>

          <p>Hello <strong>${user.name || "there"}</strong>,</p>

          <p>
            Thanks for signing up. Please click the button below to verify your email address.
          </p>

          <div style="margin:30px 0; text-align:center;">
            <a
              href="${verificationURL}"
              style="
                background:#2563eb;
                color:#ffffff;
                padding:12px 24px;
                text-decoration:none;
                border-radius:6px;
                display:inline-block;
                font-size:16px;
              "
            >
              Verify Email
            </a>
          </div>

          <p style="font-size:14px; color:#555;">
            Or copy and paste this link into your browser:
          </p>

          <p style="font-size:13px; color:#2563eb; word-break:break-all;">
            ${verificationURL}
          </p>

          <p style="margin-top:30px; font-size:14px; color:#777;">
            If you did not create this account, you can safely ignore this email.
          </p>

          <p style="margin-top:20px;">— The Team</p>
        </div>
      </body>
    </html>
  `,
        });

        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },

  //   Google auth
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
