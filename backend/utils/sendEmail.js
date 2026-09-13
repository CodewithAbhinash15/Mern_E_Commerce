import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, otp) => {
  try {
    console.log("Sending OTP to:", email);

    const { data, error } = await resend.emails.send({
      from: "MERN E-Commerce <onboarding@resend.dev>",
      to: [email],
      subject: "Your OTP - MERN E-Commerce",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 10px;
        ">

          <h2 style="text-align:center;">
            MERN E-Commerce
          </h2>

          <h3>Email Verification</h3>

          <p>Your OTP for email verification is:</p>

          <div style="
            text-align:center;
            margin:30px 0;
          ">
            <span style="
              font-size:32px;
              font-weight:bold;
              letter-spacing:8px;
              background:#f2f2f2;
              padding:15px 25px;
              border-radius:8px;
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
            If you did not request this OTP, simply ignore this email.
          </p>

          <hr />

          <p style="text-align:center;color:#777;">
            MERN E-Commerce
          </p>

        </div>
      `,
    });

    if (error) {
      console.error("RESEND EMAIL ERROR:", error);
      throw new Error("Failed to send OTP email");
    }

    console.log("OTP EMAIL SENT SUCCESSFULLY:", data?.id);

    return data;

  } catch (error) {
    console.error("EMAIL SENDING ERROR:", error);
    throw error;
  }
};

export default sendEmail;