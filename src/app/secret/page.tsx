"use client";

import React from "react";
import Header from "@/components/layout/Header";

const SecretPage: React.FC = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/corrupt.zip";
    link.setAttribute("download", "corrupt.zip");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="relative flex flex-col items-center justify-center">
        <Header />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h4 className="font-bold text-4xl leading-tight text-center text-gray-400">
          {`Files can hide in plain sight, and some paths lead to unexpected discoveries.`}
          <br/>
          {`Use binwalk to peel back the layers and find what’s hidden! 🔍`}
        </h4>
        <div className="mt-10">
          <button onClick={handleDownload} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            Is it a good idea to download a corrupted file?
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecretPage;
