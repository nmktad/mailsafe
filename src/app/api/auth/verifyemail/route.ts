import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { z } from "zod";

const otpSchema = z.object({
    otp: z.string().length(5),
    email: z.string().email()
});

export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const otp = searchParams.get("otp")!;
    const email = searchParams.get("email")!;

    const { otp: otpValue, email: emailValue } = otpSchema.parse({ otp, email });

    const entry = await db.verification.findFirst({
        where: {
            email: emailValue
        }
    });

    if (entry?.otp === otpValue) {
        await db.verification.delete({
            where: {
                id: entry.id
            }
        });

        await db.user.update({
            where: {
                email: emailValue
            },
            data: {
                emailVerified: new Date()
            }
        });

        return Response.json({ message: "Email verified" }, { status: 200 });

    }

    return Response.json({ message: "Invalid OTP" }, { status: 400 });

}
