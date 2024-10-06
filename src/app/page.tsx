"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();
  return (
    <div className="bg-background relative flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="leading-normal md:mb-4 text-3xl md:text-5xl font-bold text-white z-10">
        ยินดีต้อนรับสู่เกม{" "}
      </h1>
      <h1 className="leading-normal text-3xl md:text-5xl font-bold text-white z-10">
        Tic-Tac-Toe With AI{" "}
      </h1>

      {!user && (
        <p className="mt-4 z-10 text-md md:text-lg text-foreground">
          กรุณา
          <Link
            href="/api/auth/login"
            className="text-foreground hover:underline"
          >
            เข้าสู่ระบบ
          </Link>
          เพื่อเริ่มเล่นเกม!
        </p>
      )}
      {user && (
        <Link
          href="/game"
          className="mt-6 z-10 px-6 py-3 bg-primary text-white rounded-full text-md md:text-xl shadow-lg hover:bg-violet-800 transition duration-200"
        >
          เริ่มเกม
        </Link>
      )}

      <svg
        className="absolute z-0 left-0 right-0 top-0 bottom-0 m-auto rotate-12 max-w-full"
        width="400px"
        height="400px"
        viewBox="0 0 24 24"
        fill="#0c101e"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.29289 2.29289C2.68342 1.90237 3.31658 1.90237 3.70711 2.29289L6.5 5.08579L9.29289 2.29289C9.68342 1.90237 10.3166 1.90237 10.7071 2.29289C11.0976 2.68342 11.0976 3.31658 10.7071 3.70711L7.91421 6.5L10.7071 9.29289C11.0976 9.68342 11.0976 10.3166 10.7071 10.7071C10.3166 11.0976 9.68342 11.0976 9.29289 10.7071L6.5 7.91421L3.70711 10.7071C3.31658 11.0976 2.68342 11.0976 2.29289 10.7071C1.90237 10.3166 1.90237 9.68342 2.29289 9.29289L5.08579 6.5L2.29289 3.70711C1.90237 3.31658 1.90237 2.68342 2.29289 2.29289ZM17.5 4C16.1193 4 15 5.11929 15 6.5C15 7.88071 16.1193 9 17.5 9C18.8807 9 20 7.88071 20 6.5C20 5.11929 18.8807 4 17.5 4ZM13 6.5C13 4.01472 15.0147 2 17.5 2C19.9853 2 22 4.01472 22 6.5C22 8.98528 19.9853 11 17.5 11C15.0147 11 13 8.98528 13 6.5ZM6.5 15C5.11929 15 4 16.1193 4 17.5C4 18.8807 5.11929 20 6.5 20C7.88071 20 9 18.8807 9 17.5C9 16.1193 7.88071 15 6.5 15ZM2 17.5C2 15.0147 4.01472 13 6.5 13C8.98528 13 11 15.0147 11 17.5C11 19.9853 8.98528 22 6.5 22C4.01472 22 2 19.9853 2 17.5ZM13.2929 13.2929C13.6834 12.9024 14.3166 12.9024 14.7071 13.2929L17.5 16.0858L20.2929 13.2929C20.6834 12.9024 21.3166 12.9024 21.7071 13.2929C22.0976 13.6834 22.0976 14.3166 21.7071 14.7071L18.9142 17.5L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L17.5 18.9142L14.7071 21.7071C14.3166 22.0976 13.6834 22.0976 13.2929 21.7071C12.9024 21.3166 12.9024 20.6834 13.2929 20.2929L16.0858 17.5L13.2929 14.7071C12.9024 14.3166 12.9024 13.6834 13.2929 13.2929Z"
          fill="#0c101e"
        />
      </svg>
    </div>
  );
}
