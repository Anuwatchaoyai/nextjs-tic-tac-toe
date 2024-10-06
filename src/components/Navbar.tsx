"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

const Navbar = () => {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="bg-primary shadow-lg p-4 flex justify-between items-center">
      <Link href="/" className="cursor-pointer">
        <h2 className="text-foreground text-xl font-bold">Tic-Tac-Toe</h2>
      </Link>
      <div className="space-x-4 hidden md:flex">
        {user && (
          <>
            <Link href="/" className="text-foreground hover:underline">
              หน้าแรก
            </Link>
            <Link href="/game" className="text-foreground hover:underline">
              เล่นเกม
            </Link>
          </>
        )}
      </div>
      <div className="flex md:hidden items-center space-x-2">
		{user && (
			<button
			onClick={toggleMenu}
			className="relative w-8 h-8 block lg:hidden focus:outline-none"
			>
			<div
				className={`absolute top-1/2 w-7 h-0.5 rounded bg-foreground transform transition-transform duration-300 ease-in-out ${
				menuOpen ? "rotate-45 translate-y-0" : "-translate-y-2"
				}`}
			></div>
			<div
				className={`absolute top-1/2 w-7 h-0.5 rounded bg-foreground transition-opacity duration-300 ease-in-out ${
				menuOpen ? "opacity-0" : "opacity-100"
				}`}
			></div>
			<div
				className={`absolute top-1/2 w-7 h-0.5 rounded bg-foreground transform transition-transform duration-300 ease-in-out ${
				menuOpen ? "-rotate-45 translate-y-0" : "translate-y-2"
				}`}
			></div>
			</button>
		)}
        {!user && (
          <Link
            href="/api/auth/login"
            onClick={() => setMenuOpen(false)}
            className="bg-foreground text-primary px-3 py-1 rounded"
          >
            เข้าสู่ระบบ
          </Link>
        )}

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`fixed top-0 right-0 h-full w-64 bg-primary shadow-lg z-50 transform ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out lg:hidden`}
        >
          <div className="p-4">
            <button
              onClick={toggleMenu}
              className="block ml-auto focus:outline-none"
            >
              <svg
                className="w-6 h-6 text-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {user && (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-2 mt-8"
                >
                  <img
                    className="w-8 h-8 rounded-full shadow-lg"
                    src={user.picture || "/user.png"}
                    alt="User Profile"
                  />
                  <span className="text-white">สวัสดี, {user.name}</span>
                </Link>
              </>
            )}
            {user && (
              <>
                <ul className="my-8 space-y-4">
                  <li>
                    <Link
                      href="/"
                      onClick={() => setMenuOpen(false)}
                      className="text-foreground hover:underline"
                    >
                      หน้าแรก
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/game"
                      onClick={() => setMenuOpen(false)}
                      className="text-foreground hover:underline"
                    >
                      เล่นเกม
                    </Link>
                  </li>
                </ul>
              </>
            )}
            {user && (
              <>
                <Link
                  href="/api/auth/logout"
                  onClick={() => setMenuOpen(false)}
                  className="bg-foreground text-primary px-3 py-1 rounded hover:bg-primary-foreground"
                >
                  ออกจากระบบ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        {!user && (
          <Link
            href="/api/auth/login"
            className="bg-foreground text-primary px-3 py-1 rounded"
          >
            เข้าสู่ระบบ
          </Link>
        )}
        {user && (
          <>
            <Link href="/profile" className="flex items-center space-x-2">
              <img
                className="w-8 h-8 rounded-full shadow-lg"
                src={user.picture || "/user.png"}
                alt="User Profile"
              />
              <span className="text-white">สวัสดี, {user.name}</span>
            </Link>
            <Link
              href="/api/auth/logout"
              className="bg-foreground text-primary px-3 py-1 rounded hover:bg-primary-foreground"
            >
              ออกจากระบบ
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
