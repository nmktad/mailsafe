import { db } from "@/lib/db";
import { computeHash } from "@/lib/utils";
import { emailSchema } from "@/lib/validations/auth";
import * as crypto from 'crypto';
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()
    const userId = cookies().get("userId");

    const data = emailSchema.parse(body);

    const user = await db.user.findUnique({
        where: {
            id: userId?.value
        }
    });

    const receiver = await db.user.findUnique({
        where: {
            email: data.to
        }
    });

    if (!receiver) {
        return NextResponse.json({ msg: "receiver not found" }, { status: 404 })
    }

    const res = await db.mail.create({
        data: {
            from: user?.email!,
            to: data.to,
            subject: data.subject,
            text: data.message,
            hash: computeHash({ subject: data.subject, message: data.message }),
        },
    });

    if (!res) {
        return NextResponse.json({ msg: "email sending failed" }, { status: 500 })
    }

    const response = new NextResponse(JSON.stringify({ status: "success" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });

    return response;
}
