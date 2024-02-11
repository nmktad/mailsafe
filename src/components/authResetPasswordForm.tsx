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

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export const userAuthSchema = z.object({
    otp: z.string().length(5),
    password: z.string().min(8).max(32),
    confirmPassword: z.string().min(8).max(32),
});

type FormData = z.infer<typeof userAuthSchema>;

export function AuthResetPassword({ className, ...props }: UserAuthFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(userAuthSchema),
    });
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const router = useRouter();
    const { getItem, removeItem } = useStorage();

    async function onSubmit(data: FormData) {
        if (data.password !== data.confirmPassword) {
            return toast({
                title: "Passwords do not match.",
                description: "Please make sure your passwords match.",
                variant: "destructive",
            });
        }

        const email = getItem("email");

        setIsLoading(true);

        const dataTBS = { ...data, email };
        console.log({ dataTBS });

        const resetPassRes = await fetch("/api/auth/resetpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data, email }),
        });

        setIsLoading(false);

        if (!resetPassRes.ok) {
            return toast({
                title: "Something went wrong.",
                description: "Your reset password request failed. Please try again.",
                variant: "destructive",
            });
        }

        removeItem("email");

        return router.push("/login");
    }

    return (
        <div className={cn("grid gap-4", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <div className="grid gap-1 py-2">
                        <Label className="sr-only" htmlFor="otp">
                            OTP code
                        </Label>
                        <Input
                            id="otp"
                            type="text"
                            placeholder="OTP code"
                            disabled={isLoading}
                            {...register("otp")}
                        />
                        {errors?.otp && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.otp.message}
                            </p>
                        )}

                        <Label className="sr-only" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="password"
                            disabled={isLoading}
                            {...register("password")}
                        />
                        {errors?.password && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                        <Label className="sr-only" htmlFor="confirmPassword">
                            Password
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="confirm password"
                            disabled={isLoading}
                            {...register("confirmPassword")}
                        />
                        {errors?.confirmPassword && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}

