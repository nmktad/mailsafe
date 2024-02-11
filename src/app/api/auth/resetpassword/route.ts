import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextRequest } from "next/server";
import { z } from "zod";

export const resetPassword = z.object({
    email: z.string().email(),
    otp: z.string().length(5),
    password: z.string().min(8).max(32),
    confirmPassword: z.string().min(8).max(32),
});

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { email, otp, password, confirmPassword } = resetPassword.parse(body);

    if (password !== confirmPassword) {
        return Response.json({ message: "Passwords do not match" }, { status: 400 });
    }

    const emailValue = email.toLowerCase();

    const user = await db.user.findUnique({
        where: {
            email: emailValue
        }
    });

    if (!user) {
        return Response.json({ message: "Invalid email" }, { status: 400 });
    }

    const DbOtp = await db.verification.findFirst({
        where: {
            email: emailValue,
        }
    });

    if (!DbOtp) {
        return Response.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (DbOtp.otp !== otp) {
        return Response.json({ message: "Invalid OTP" }, { status: 400 });
    }


    const hashedPassword = await hash(password, 12);

    const updateRes = await db.user.update({
        where: {
            email: emailValue
        },

        data: {
            password: hashedPassword
        }
    });

    const deleteRes = await db.verification.delete({
        where: {
            id: DbOtp.id
        }
    });

    if (!deleteRes) {
        return Response.json({ message: "Failed to delete OTP" }, { status: 500 });
    }

    if (!updateRes) {
        return Response.json({ message: "Failed to update password" }, { status: 500 });
    }

    return Response.json({ message: "Password updated successfully" }, { status: 200 });
}
