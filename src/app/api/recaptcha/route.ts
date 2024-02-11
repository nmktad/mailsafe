import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const postData = await request.json();
    const { gReCaptchaToken } = postData;

    const formData = `secret=${secretKey}&response=${gReCaptchaToken}`;

    try {
        const response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",

                },
                body: formData,
            }
        );

        const data = await response.json();

        if (data.success && data.score > 0.5) {
            return Response.json({
                message: "Success",
                score: data.score,
            });
        } else {
            return Response.json({
                message: "Failed",
                score: data.score,
            });
        }

    } catch (error) {

    }
}
