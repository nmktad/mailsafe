import Logout from '@/components/Logout';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function EmailPage() {
    const user = await db.user.findFirst({
        where: {
            id: cookies().get('userId')?.value
        }
    });

    const emails = await db.mail.findMany({
        where: {
            to: user?.email!
        }
    });

    return (
        <div className='w-full flex justify-center h-screen'>
            <div className="w-full gap-2 h-screen py-2 px-96" >
                <div className=" border-r border-gray-200 dark:border-gray-800 overflow-y-auto p-2 col-span-2">
                    <div className="w-full flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Emails</h1>
                        <div className='flex gap-4'>
                            <Link href="/m/new">
                                <button className="bg-primary text-white rounded-md p-2 w-28 mt-4">
                                    Compose
                                </button>
                            </Link>
                            {
                                user?.role === 'ADMIN' &&
                                <Link className='bg-secondary p-2 mt-4 rounded-md' href="/register">
                                    register users
                                </Link>
                            }
                            <Logout />
                        </div>
                    </div>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                        {emails.map((email: any) => (
                            <Link key={email.id} href={`/m/${email.id}`}>
                                <li className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-start rounded-lg">
                                    <div className="w-full truncate">
                                        <h2 className="text-base font-bold">
                                            {email.from}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {email.subject}
                                        </p>
                                        <p className="text-sm truncate overflow-ellipsis">
                                            {email.text}
                                        </p>
                                    </div>
                                    <time className="text-xs text-gray-500 dark:text-gray-400 self-center flex justify-end">
                                        {new Date(email.createdAt).toLocaleDateString()}
                                    </time>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>
            </div >
        </div>
    );
}
