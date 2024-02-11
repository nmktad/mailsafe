import { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AuthRegisterForm } from "@/components/authRegisterForm";
import { Icons } from "@/components/icons";

export const metadata: Metadata = {
    title: "Register",
    description: "Register for a Zelic account",
};

export default function RegisterPage() {
    return (
        <>
            <div className="container relative h-[800px] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <Link
                    href="/login"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "absolute right-4 top-4 md:right-8 md:top-8 text-primary font-medium tracking-wide"
                    )}
                >
                    Login
                </Link>
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
                        <div className="flex flex-col space-y-2">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Create a new account
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                To continue to Zelic
                            </p>
                        </div>
                        <AuthRegisterForm />
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            By clicking continue, you agree to our{" "}
                            <Link
                                href="/terms"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/privacy"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
