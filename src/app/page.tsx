import { Globe } from "@/components/magicui/globe";
import {SpinningText} from "@/components/magicui/SpinningText";
import {RetroGrid} from "@/components/magicui/RetroGrid";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      {/*<div className="absolute flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border">*/}
        <RetroGrid />
      {/*</div>*/}
      <div className="static" style={{ width: "100vw", top: '15vh' }}>
        <SpinningText duration={30} radius={13} reverse className="text-4xl font-bold text-white absolute
        top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          WELCOME TO OUR CTF CHALLENGE
        </SpinningText>
        <Globe />
      </div>
      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <Link href="/login">
          <button className="bg-slate-100 text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-colors">
            Let's Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
