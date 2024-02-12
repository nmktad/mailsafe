import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const userId = cookies().get("userId");

    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id")!;

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

    const data = await db.mail.findFirst({
        where: {
            id: id
        }
    });

    return new Response(JSON.stringify({
        mail: data
    }), {
        headers: { "Content-Type": "application/json" },
        status: 200
    });
}

