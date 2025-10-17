import type { ReactElement } from "react";
export declare class Email {
    private transporter;
    constructor();
    send({ body, subject, to, }: {
        body: ReactElement;
        subject: string;
        to: string;
    }): Promise<void>;
}
export declare const email: Email;
