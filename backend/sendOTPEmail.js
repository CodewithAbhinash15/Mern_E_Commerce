import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (email, otp) => {
  try {
    console.log("Sending OTP to:", email);

    const { data, error } = await resend.emails.send({
      from: "MERN E-Commerce <onboarding@resend.dev>",
      to: [email],
      subject: "Your OTP - MERN E-Commerce",

      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Email Verification</title>
          </head>

          <body style="
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
          ">

            <div style="
              max-width: 600px;
              margin: 40px auto;
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            ">

              <h2 style="text-align: center;">
                MERN E-Commerce
              </h2>

              <h3>
                Verify Your Email
              </h3>

              <p>
                Thank you for signing up with MERN E-Commerce.
              </p>

              <p>
                Your One-Time Password (OTP) is:
              </p>

              <div style="
                text-align: center;
                margin: 30px 0;
              ">
                <span style="
                  display: inline-block;
                  background-color: #f1f1f1;
                  padding: 15px 25px;
                  font-size: 32px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  border-radius: 8px;
                ">
                  ${otp}
                </span>
              </div>

              <p>
                This OTP is valid for <strong>10 minutes</strong>.
              </p>

              <p>
                Please do not share this OTP with anyone.
              </p>

              <p>
                If you did not request this OTP, you can safely ignore this email.
              </p>

              <hr style="margin-top: 30px;" />

              <p style="
                text-align: center;
                color: #777;
                font-size: 13px;
              ">
                © MERN E-Commerce
              </p>

            </div>

          </body>
        </html>
      `,
    });

    if (error) {
      console.error("RESEND EMAIL ERROR:", error);
      throw new Error("Failed to send OTP email");
    }

    console.log("OTP EMAIL SENT SUCCESSFULLY");
    console.log("Email ID:", data?.id);

    return data;

  } catch (error) {
    console.error("EMAIL SENDING ERROR:", error);
    throw error;
  }
};

export default sendOTPEmail;

