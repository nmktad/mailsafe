import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function EmailPage(
    { params }: {
        params: { id: string; }
    }) {

    const user = await db.user.findFirst({
        where: {
            id: cookies().get('userId')?.value
        }
    });

    const email = await db.mail.findFirst({
        where: {
            id: params.id
        }
    });

    if (email?.to !== user?.email) {
        return (
            <div>
                <h1>Email not found</h1>
            </div>
        )
    }

    if (!email) {
        return (
            <div>
                <h1>Email not found</h1>
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center h-screen">
            <Suspense fallback={<div>loading</div>}>
                <div className=" col-span-3 flex flex-col w-full px-96">
                    <div className="p-4 space-y-4 flex-grow overflow-y-auto">
                        <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                            <h2 className="text-xl font-bold">{email.subject}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {`'sent' : (email)}`}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {`To' formatEmailString(email) : 'Me'}`}
                            </p>
                            <time className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(email.createdAt).toLocaleString()}
                            </time>
                        </div>
                        <div>
                            <p>{email.text}</p>
                        </div>
                    </div>
                </div>
            </Suspense>
        </div>
    );
}
