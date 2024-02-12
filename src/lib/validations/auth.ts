import { z } from "zod";

export const userAuthSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(1, "Password is required.")
        .max(32, "Password is too long."),
});

export const MailSchema = z.object({
    to: z.string().email(),
    subject: z.string(),
    message: z.string(),
});

export const emailSchema = z.object({
    to: z.string().email(),
    subject: z.string().min(1, "Subject is required."),
    message: z.string().min(1, "Message is required.").max(1000, "Message is too long."),
});
