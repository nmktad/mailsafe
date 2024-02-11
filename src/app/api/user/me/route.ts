import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const userId = req.headers.get("X-USER-ID");

    if (!userId) {
        return new Response(
            JSON.stringify({
                msg: "You are not logged in, please provide token to gain access",
                status: "error",
            }),
            { status: 401 }
        );
    }

    const user = await db.user.findUnique({ where: { id: userId } });

    return NextResponse.json({
        status: "success",
        data: { user: { ...user, password: undefined } },
    });
}

