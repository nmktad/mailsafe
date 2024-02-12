'use client'

import { useRouter } from "next/navigation";


export default function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (res.ok) {
            router.push('/login');
        }

    }

    return (
        <button onClick={handleLogout} className="bg-primary text-white rounded-md p-2 w-28 mt-4">
            Logout
        </button>
    )

}

