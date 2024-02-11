import VerifyEmailTemplate from '@/components/email/ConfirmEmailTemplate';
import ForgotPasswordTemplate from '@/components/email/ForgotPasswordTemplate';
import { db } from '@/lib/db';
import { generateOTP } from '@/lib/utils';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = 'force-dynamic'

export const OtpSchema = z.object({
    email: z.string().email(),
});


export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const purpose = searchParams.get("purpose");
    const email = searchParams.get("email");

    const otpData = OtpSchema.parse({
        email,
    });

    const otp = generateOTP();

    if (purpose === 'verify-email') {
        try {
            const user = await db.user.findFirst({
                where: {
                    email: otpData.email!,
                },
            });

            if (user?.emailVerified) {
                return Response.json({
                    message: 'Email already verified',
                });
            }

            const data = await resend.emails.send({
                from: 'Mailsafe <onboarding@zewdlabs.tech>',
                to: [otpData.email!],
                subject: 'Verify your email address',
                react: VerifyEmailTemplate({ verificationCode: otp }),
            });

            const result = await db.verification.create({
                data: {
                    email: otpData.email!,
                    otp: otp,
                    expiresAt: new Date(Date.now() + 1000 * 60 * 5),
                }
            });

            if (!result) {
                return Response.json({
                    message: 'Failed to create verification record',
                }, { status: 500 });
            }

            return Response.json(data);
        } catch (error) {
            return Response.json({ error });
        }
    } else if (purpose === 'forgot-password') {
        try {
            const user = await db.user.findFirst({
                where: {
                    email: otpData.email!,
                },
            });

            if (!user) {
                return Response.json({
                    message: 'User not found',
                }, { status: 404 });
            }

            const result = await db.verification.create({
                data: {
                    email: otpData.email!,
                    otp: otp,
                    expiresAt: new Date(Date.now() + 1000 * 60 * 5),
                }
            });

            if (!result) {
                return Response.json({
                    message: 'Failed to create verification record',
                }, { status: 500 });
            }

            const data = await resend.emails.send({
                from: 'Mailsafe <support@zewdlabs.tech>',
                to: [otpData.email!],
                subject: 'Password reset',
                react: ForgotPasswordTemplate({ verificationCode: otp }),
            });

            return Response.json(data);
        } catch (error) {
            return Response.json({ error });
        }
    }

}

