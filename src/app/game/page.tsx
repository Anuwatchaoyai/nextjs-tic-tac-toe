'use client'

import TicTacToe from "@/components/TicTacToe";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/api/auth/login');
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) {
        return <div>Loading...</div>;
    }
    return (
        <TicTacToe />
    )
}

export default Page;