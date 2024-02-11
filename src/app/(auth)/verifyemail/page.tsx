import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import Otp from "@/components/ui/otp";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Verify Email",
    description: "Register for a Zelic account",
};

export default function VerifyEmailPage() {
    return (
        <>
            <div className="container relative h-[800px] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <Link
                    href="/"
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "absolute left-4 top-4 md:left-8 md:top-8 text-primary font-medium tracking-wide z-20"
                    )}
                >
                    <>
                        <Icons.arrowleft className="mr-2 h-4 w-4" />
                        Back
                    </>
                </Link>
                <div className="relative hidden h-screen flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "url(https://images.unsplash.com/photo-1587977499825-5c809769c516?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80)",
                        }}
                    />
                    <div className="relative z-20 mt-auto text-clip">
                        <blockquote className="space-y-2">
                            <p className="text-lg w-[55ch]">
                                &ldquo;Good people with a good process will outperform good
                                people with no process every time!&rdquo;
                            </p>
                            <footer className="text-sm">Grady Booch</footer>
                        </blockquote>
                    </div>
                </div>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <Otp length={5} />
                    </div>
                </div>
            </div>
        </>
    )
};
