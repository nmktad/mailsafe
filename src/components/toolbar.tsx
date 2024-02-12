'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search } from '@/components/search';
import { Icons } from '@/components/icons';
import { deleteEmail } from '@/app/db/actions';

type Params = {
    name: string;
};

export function Toolbar() {
    const params: Params = useParams();
    const searchParams = useSearchParams();
    const emailId = searchParams.get('id');

    const deleteEmail = async (folderName: string, emailId: string) => {
    }


    return (
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 py-4 px-2 sticky top-0 h-[60px]">
            <div className="space-x-1">
                <Link
                    href={`/f/${params.name}/new`}
                    className="inline-flex hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-3 py-2"
                >
                    <Icons.email />
                </Link>
                <form
                    className="inline-flex"
                    onSubmit={async (e) => {
                        e.preventDefault();

                        if (emailId) {
                            await deleteEmail(params.name, emailId);
                        }
                    }}
                >
                    <button
                        type="submit"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-3 py-2"
                    >
                        <Icons.trash />
                    </button>
                </form>
                <button className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-3 py-2">
                    <Icons.arrowleft />
                </button>
                <button className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-3 py-2">
                    <Icons.arrowright />
                </button>
            </div>
            <button className="flex ml-auto">
                <Search />
            </button>
        </div>
    );
}

export function ToolbarSkeleton() {
    return (
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 py-4 px-2 sticky top-0 h-[60px]" />
    );
}
