"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import useStorage from "@/lib/hooks/useSession";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export const userAuthSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(1, "Password is required.")
        .max(32, "Password is too long."),
});

type FormData = z.infer<typeof userAuthSchema>;

export function AuthRegisterForm({ className, ...props }: UserAuthFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(userAuthSchema),
    });
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);

    const { setItem } = useStorage();

    const router = useRouter();

    const { executeRecaptcha } = useGoogleReCaptcha();

    //TODO: Add searchparams from useSearchParams

    async function onSubmit(data: FormData) {
        setIsLoading(true);

        if (!executeRecaptcha) {
            return toast({
                title: "Something went wrong.",
                description: "We couldn't verify you as a human.",
                variant: "destructive",
            });
        }

        const gReCaptchaToken = await executeRecaptcha("register");

        if (!gReCaptchaToken) {
            return toast({
                title: "Something went wrong.",
                description: "We couldn't verify you as a human.",
                variant: "destructive",
            });
        }

        const response = await fetch("/api/recaptcha", {
            method: "POST",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ gReCaptchaToken }),
        })

        const registerResult = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!registerResult.ok) {
            return toast({
                title: "Something went wrong.",
                description: "Your sign in request failed. Please try again.",
                variant: "destructive",
            });
        }

        const result = await fetch(`/api/send?purpose=verify-email&email=${data.email}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!result.ok) {
            return toast({
                title: "Something went wrong.",
                description: "We couldn't send you a verification email.",
                variant: "destructive",
            });
        }

        setItem("email", data.email);

        toast({
            title: "Check your email",
            description: "We sent you a confirmation email. Be sure to check your spam too.",
            duration: 1500
        });

        return router.push("/verifyemail");
    }

    return (
        <div className={cn("grid gap-4", className)} {...props}>
            <Button
                variant="outline"
                type="button"
                disabled={isLoading || isGoogleLoading}
                onClick={() => {
                    setIsGoogleLoading(true);
                    // signIn("google");
                }}
            >
                {isGoogleLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}{" "}
                Continue with Google
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background p-2 text-muted-foreground">Or</span>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <div className="grid gap-1 py-2">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading || isGoogleLoading}
                            {...register("email")}
                        />
                        {errors?.email && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                        <Label className="sr-only" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            placeholder="password"
                            type="password"
                            disabled={isLoading || isGoogleLoading}
                            {...register("password")}
                        />
                        {errors?.email && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <Button disabled={isLoading || isGoogleLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In with Credentials
                    </Button>
                </div>
            </form>
        </div>
    );
}
