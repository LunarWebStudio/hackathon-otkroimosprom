import { env } from "@lunarweb/env";
import { logger } from "@lunarweb/logger";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
export class Email {
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: env.EMAIL_HOST,
            port: env.EMAIL_PORT,
            secure: true,
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASSWORD,
            },
        });
    }
    async send({ body, subject, to, }) {
        try {
            this.transporter.sendMail({
                from: env.EMAIL_USER,
                to,
                subject: subject,
                html: await render(body),
            });
        }
        catch (error) {
            logger.error({ error, to, subject });
        }
    }
}
const globalForEmail = globalThis;
export const email = globalForEmail.email ?? new Email();
