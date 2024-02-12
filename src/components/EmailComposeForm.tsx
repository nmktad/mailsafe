"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";
import { emailSchema } from "@/lib/validations/auth";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }


type FormData = z.infer<typeof emailSchema>;

export function EmailComposeForm({ }: UserAuthFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(emailSchema),
    });
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const router = useRouter();

    async function onSubmit(data: FormData) {
        console.log({ data });
        setIsLoading(true);

        const emailResult = await fetch("/api/m/send", {
            cache: "no-cache",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        setIsLoading(false);

        if (!emailResult.ok) {
            toast({
                title: "Something went wrong.",
                description: "We couldn't send your email.",
                variant: "destructive",
            });
        }

        router.push("/m");
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (
            (e.ctrlKey || e.metaKey) &&
            (e.key === 'Enter' || e.key === 'NumpadEnter')
        ) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
        }
    };


    return (
        <form className="col-span-5 flex flex-col w-full px-96 " onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 p-2 sticky top-0 h-[60px]">
                <Button
                    className="flex ml-auto hover:bg-gray-200 dark:hover:bg-gray-800 rounded px-3 py-2"
                    type="submit"
                >
                    <Icons.send />
                </Button>
            </div>
            <div className="p-1 space-y-1 flex-grow overflow-y-auto text-sm">
                <hr className="border-t border-gray-200 dark:border-gray-800" />
                <div className="relative flex flex-col space-y-2">
                    <Input
                        className="pl-[72px] border-none bg-white dark:bg-gray-950 text-black dark:text-white px-3 py-2 focus:outline-none"
                        id="to"
                        type="text"
                        placeholder="To"
                        required
                        disabled={isLoading}
                        {...register("to")}
                    />

                    {errors?.to && (
                        <p className="px-1 text-xs text-red-600">
                            {errors.to.message}
                        </p>
                    )}
                </div>
                <hr className="border-t border-gray-200 dark:border-gray-800" />
                <div className="relative flex flex-col space-y-2">
                    <Input
                        className="pl-[72px] border-none bg-white dark:bg-gray-950 text-black dark:text-white px-3 py-2 focus:outline-none"
                        placeholder="Subject"
                        id="subject"
                        type="text"
                        required
                        disabled={isLoading}
                        {...register("subject")}

                    />
                    {errors?.subject && (
                        <p className="px-1 text-xs text-red-600">
                            {errors.subject.message}
                        </p>
                    )}
                </div>
                <hr className="border-t border-gray-200 dark:border-gray-800" />
                <div>
                    <Textarea
                        rows={20}
                        className="border-none bg-white dark:bg-gray-950 text-black dark:text-white px-3 py-2 focus:outline-none w-full mt-2"
                        required
                        disabled={isLoading}
                        onKeyDown={handleKeyDown}
                        {...register("message")}
                    />
                    {errors?.message && (
                        <p className="px-1 text-xs text-red-600">
                            {errors.message.message}
                        </p>
                    )}
                </div>
            </div>
        </form>
    );
}

