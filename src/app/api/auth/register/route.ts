import { userAuthSchema } from "@/lib/validations/auth"
import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as z.infer<typeof userAuthSchema>;
        const data = userAuthSchema.parse(body);

        const hashedPassword = await hash(data.password, 12);

        const user = await db.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
            },
        });

        return new NextResponse(
            JSON.stringify({
                status: "success",
                msg: "user created successfully",
                data: {
                    user: {
                        id: user.id
                    }
                }
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error: any) {
        if (error instanceof ZodError) {
            return new Response(
                JSON.stringify({
                    msg: "failed validations",
                    status: "error"
                }),
                { status: 400 }
            );
        }

        if (error.code === "P2002") {
            return new Response(
                JSON.stringify({
                    msg: "user with that email already exists",
                    status: "error"
                }),
                { status: 409 }
            );
        }

        return new Response(
            JSON.stringify({
                msg: "Internal Server Error",
                status: "error"
            }),
            { status: 500 }
        );
    }
}

