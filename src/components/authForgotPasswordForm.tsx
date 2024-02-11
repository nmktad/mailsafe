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
import { useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import useStorage from "@/lib/hooks/useSession";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export const userAuthSchema = z.object({
    email: z.string().email(),
});

type FormData = z.infer<typeof userAuthSchema>;

export function AuthForgotPassword({ className, ...props }: UserAuthFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(userAuthSchema),
    });
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const router = useRouter();
    const { setItem } = useStorage();

    async function onSubmit(data: FormData) {
        setIsLoading(true);

        console.log({ data });

        const result = await fetch(`/api/send?purpose=forgot-password&email=${data.email}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        setIsLoading(false);

        if (!result.ok) {
            return toast({
                title: "Something went wrong.",
                description: "Your sign in request failed. Please try again.",
                variant: "destructive",
            });
        }

        setItem("email", data.email);

        toast({
            title: "Reset email sent",
            description: "Please check your email for a reset link.",
        });

        return router.push("/resetpassword");
    }

    return (
        <div className={cn("grid gap-4", className)} {...props}>
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
                            disabled={isLoading}
                            {...register("email")}
                        />
                        {errors?.email && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Send Reset Email
                    </Button>
                </div>
            </form>
        </div>
    );
}
