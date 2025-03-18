"use client"

import Link from 'next/link';
import { usePathname } from "next/navigation";

const Header = () => {
  const path = usePathname()

  const userId = localStorage.getItem("user_id");

  const left = () => {
    if (path !== '/home') {
      return (
        <Link href="/home">
          <button className="bg-fuchsia-600 text-slate-200 px-4 py-2 rounded-lg hover:bg-fuchsia-800 hover:text-white transition-colors">
            Home
          </button>
        </Link>
      )
    } else {
      return (
        <Link href="/scores">
          <button className="bg-fuchsia-600 text-slate-200 px-4 py-2 rounded-lg hover:bg-fuchsia-800 hover:text-white transition-colors">
            Scoreboard
          </button>
        </Link>
      )
    }
  }
  return (
    <header className="container mx-auto pt-10 px-4 bg-transparent">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Sherry & Aashik&apos;s CTF Challenges
          </h1>
          <p className="text-gray-400 mt-2">
            {`// TODO: come up with a catchy slogan`}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3 z-50">
          {left()}
          {!path.includes("/profile") && (
            <Link href={`/profile/${userId}`}>
              <button className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                My Profile
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
