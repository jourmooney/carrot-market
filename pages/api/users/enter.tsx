import mail from "@sendgrid/mail";
import twilio from "twilio";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";

mail.setApiKey(process.env.SENDGRID_KEY!);
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone: +phone } : { email };
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MSID,
      to: process.env.MY_PHONE!,
      body: `Your login token is ${payload}`,
    });
    console.log(message);
    else if(email) {
      const email = await mail.send({
        from: "mail@mail",
        to: "mail@mail",
        subject:"Your Carrot Market Verification Email",
        text: `Your token is${payload}`,
        html: `<strong>Your token is${payload}</strong>`,
      })
    }
  }
  return res.json({
    ok: true,
  });
}

export default withHandler("POST", handler);
