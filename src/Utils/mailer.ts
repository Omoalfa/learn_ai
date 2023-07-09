import { MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_USER } from "@/Config";
import { logger } from "@/Logger";
import { IMailOptions } from "@/Types";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: Number(MAIL_PORT),
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  }
});

export const sendMail = async (options: IMailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      ...options
    })
  } catch (error) {
    logger.error(error);
    throw error;
  }
}
