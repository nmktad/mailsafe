import { db } from "@/lib/db";
import { logger } from "@/lib/logging";
import { signJWT } from "@/lib/token";
import { userAuthSchema } from "@/lib/validations/auth";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as z.infer<typeof userAuthSchema>;
        const data = userAuthSchema.parse(body);

        const user = await db.user.findUnique({
            where: { email: data.email },
        });

        if (!user || !(await compare(data.password, user.password))) {
            return new Response(
                JSON.stringify({
                    msg: "Invalid email or password",
                    status: "error",
                }),
                { status: 401 }
            );
        }

        const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

        const token = await signJWT(
            { sub: user.id },
            { exp: `${JWT_EXPIRES_IN}m` }
        );

        const tokenMaxAge = parseInt(JWT_EXPIRES_IN) * 60;

        const cookieOptions = {
            name: "token",
            value: token,
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV !== "development",
            maxAge: tokenMaxAge,
        };

        const response = new NextResponse(
            JSON.stringify({
                status: "success",
                token,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );

        await Promise.all([
            response.cookies.set(cookieOptions),
            response.cookies.set({
                name: "authenticated",
                value: "true",
                maxAge: tokenMaxAge,
            }),
        ]);

        logger.info({
            message: "User logged in",
            userId: user.id,
            userEmail: user.email,
            ip: req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for"),
        });

        return response;
    } catch (error: any) {
        if (error instanceof ZodError) {
            return new Response(
                JSON.stringify({
                    msg: "failed validations",
                    status: "error",
                }),
                { status: 400 }
            );
        }

        return new Response(
            JSON.stringify({
                msg: "Internal Server Error horray",
                status: "error",
            }),
            { status: 500 }
        );
    }
}
