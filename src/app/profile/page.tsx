'use client'

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

const Profile = () => {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        <div>
            {user ? (

            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
                <img
                src={user.picture || '/user.png'} alt={user.name || 'User Profile'}
                className="w-32 h-32 rounded-full shadow-lg"
                />
                <h2 className="mt-4 text-2xl text-primary font-semibold">{user.name || 'Anonymous'}</h2>
                <p className="mt-2 text-foreground">Email: {user.email}</p>
                <Link href="/api/auth/logout" className='mt-2 text-foreground cursor-pointer'>ออกจากระบบ</Link>
            </div>
              
                
            ) : (
                <div>
                    <h2>กรณุเข้าสู่ระบบ</h2>
                    <Link href="/api/auth/login">เข้าสู่ระบบ</Link>
                </div>
            )}
        </div>
    );
};

export default Profile;
