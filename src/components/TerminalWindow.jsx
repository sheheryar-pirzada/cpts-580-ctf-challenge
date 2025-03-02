"use client"

import { useState, useEffect } from "react";
import { X, Minus } from "lucide-react";

const terminalDefault = ["> Welcome to the terminal!", "> Type `help` for a list of commands."];
const terminalHelp = [
  "> Commands:",
  ">   help - Displays this message",
  ">   ctrl + ` - Opens/Closes the terminal",
  ">   cls - Clears the terminal",
  ">   submit FLAG{FLAG_HERE} - Submits a flag. (curly brackets are required)",
];

const TerminalWindow = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([...terminalDefault]);
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "`") {
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    if (input.toLowerCase() === "cls") {
      setOutput([...terminalDefault]);
      setInput("");
      return;
    }

    if (input.toLowerCase() === "help") {
      setOutput([...output, ...terminalHelp]);
      setInput("");
      return;
    }

    if (input.toLowerCase().startsWith("submit ")) {
      const flag = input.split(" ")[1];
      if (!flag) {
        setOutput((prev) => [...prev, "> Error: No flag provided. Use `submit FLAG_HERE`"]);
        setInput("");
        return;
      }

      try {
        const response = await fetch("/api/submit-flag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flag }),
        });

        const data = await response.json();
        if (response.ok) {
          setOutput((prev) => [...prev, `> ${data.message}`]);
        } else {
          setOutput((prev) => [...prev, `> Error: ${data.error}`]);
        }
      } catch (error) {
        setOutput((prev) => [...prev, "> Error: Could not submit flag"]);
      }

      setInput("");
      return;
    }

    setOutput((prev) => [...prev, `> ${input}`]);
    setInput("");
  };


  const getTextColorClass = (text) => {
    return text.startsWith("> Error: ") ? "text-red-500" : "text-green-700";
  };


  if (!isOpen) return null;

  return (
    <div className={`fixed ${isMinimized ? "bottom-4 right-4" : "inset-0 flex items-center justify-center"} bg-black bg-opacity-50 z-20 rounded-md`}>
      <div className={`bg-black text-green-700 bg-opacity-15 backdrop-blur-md font-mono rounded-md transition-all ${isMinimized ? "h-12 w-60" : "w-[50vw] h-[50vh]"}`}>
        <div className="flex justify-between items-center bg-white p-2 rounded-t-md">
          <span className="text-sm">Pseudo Terminal</span>
          <div className="flex space-x-2">
            <button onClick={() => setIsMinimized(!isMinimized)} className="text-gray-800 hover:text-blue-500">
              <Minus size={16} />
            </button>
            <button onClick={() => setIsOpen(false)} className="text-gray-800 hover:text-red-500">
              <X size={16} />
            </button>
          </div>
        </div>
        {!isMinimized && (
          <div className="py-4 h-full flex flex-col">
            <div className="flex-grow overflow-y-auto">
              {output.map((line, index) => (
                <div className={`pl-2 ${getTextColorClass(line)}`} key={index}>{line}</div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex mt-2 py-2 px-2 bg-transparent rounded-b-md bottom-1 absolute w-full">
              <span className="mr-2">$</span>
              <input
                type="text"
                className="w-full bg-transparent text-green-400 outline-none border-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalWindow;

