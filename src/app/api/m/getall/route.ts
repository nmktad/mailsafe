import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const userId = cookies().get("userId");

    console.log({ id: userId?.value });

    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
        where: {
            id: userId?.value
        }
    });

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const data = await db.mail.findMany({
        where: {
            to: user.email!
        }
    });

    return NextResponse.json({
        mail: data
    }, {
        headers: { "Content-Type": "application/json" },
        status: 200
    });
}
