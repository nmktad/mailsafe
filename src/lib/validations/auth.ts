import { z } from "zod";

export const userAuthSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(1, "Password is required.")
        .max(32, "Password is too long."),
});
