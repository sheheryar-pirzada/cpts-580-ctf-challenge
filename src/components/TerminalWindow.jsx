"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Minus } from "lucide-react";

const defaultMessages = [
  "> Welcome to the terminal!",
  "> Type help for a list of commands.",
  "> (If closed, open the terminal again by pressing [ctrl + `])",
];

const TerminalWindow = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([...defaultMessages]);
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);
  const router = useRouter();

  const commandHandlers = {
    cls: {
      description: "Clears the terminal",
      exec: () => {
        setOutput([...defaultMessages]);
      }
    },
    help: {
      description: "Displays this help message",
      exec: () => {
        const helpMessages = Object.entries(commandHandlers).map(
          ([command, { description }]) => `> ${command} - ${description}`
        );
        setOutput((prev) => [...prev, ...helpMessages]);
      }
    },
    hide: {
      description: "Minimizes the terminal",
      exec: () => {
        setIsMinimized(true);
      }
    },
    submit: {
      description: "Submits a flag. Usage: submit FLAG{FLAG_HERE}",
      exec: async (args) => {
        if (args.length === 0) {
          setOutput((prev) => [
            ...prev,
            "> Error: No flag provided. Use submit FLAG{FLAG_HERE}"
          ]);
          return;
        }
        const flag = args[0];
        try {
          const response = await fetch("/api/submit-flag", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ flag })
          });
          const data = await response.json();
          if (response.ok) {
            setOutput((prev) => [...prev, `> ${data.message}`]);
          } else {
            setOutput((prev) => [...prev, `> Error: ${data.error}`]);
          }
        } catch (error) {
          setOutput((prev) => [
            ...prev,
            "> Error: Could not submit flag"
          ]);
        }
      }
    },
    goto: {
      description: "Navigates to a specified route. Usage: goto /route",
      exec: (args) => {
        if (args.length === 0) {
          setOutput((prev) => [
            ...prev,
            "> Error: No route provided. Usage: goto /route"
          ]);
          return;
        }
        const route = args[0];
        router.push(route);
        setOutput((prev) => [...prev, `> Navigating to ${route}...`]);
      }
    },
    logout: {
      description: "Logs out the user and navigates to the main page",
      exec: async () => {
        try {
          const response = await fetch("/api/logout", { method: "POST" });
          if (response.ok) {
            localStorage.clear();
            setOutput((prev) => [...prev, "> Successfully logged out."]);
            router.push("/");
          } else {
            const data = await response.json();
            setOutput((prev) => [...prev, `> Error: ${data.error}`]);
          }
        } catch (error) {
          setOutput((prev) => [...prev, "> Error: Logout failed."]);
        }
      }
    },
    dir: {
      description: "Lists available pages in the web app",
      exec: () => {
        // Adjust this array to match your web app's available routes.
        const pages = ["/", "/login", "/home", "/scores", "/gallery", "/secret", "/profile"];
        const pagesOutput = pages.map(page => `> ${page}`);
        setOutput(prev => [...prev, ...pagesOutput]);
      }
    }
  };

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
    if (!input.trim()) return;

    setOutput((prev) => [...prev, `> ${input}`]);

    const inputParts = input.trim().split(" ");
    const command = inputParts[0].toLowerCase();
    const args = inputParts.slice(1);

    if (commandHandlers[command]) {
      const result = commandHandlers[command].exec(args);
      if (result instanceof Promise) {
        await result;
      }
    } else {
      setOutput((prev) => [...prev, `> Command not found: ${command}`]);
    }
    setInput("");
  };

  const getTextColorClass = (text) =>
    text.startsWith("> Error: ") ? "text-red-500" : "text-green-700";

  if (!isOpen) return null;

  return (
    <div
      style={{ zIndex: 999 }}
      className={`fixed ${
        isMinimized ? "bottom-4 right-4" : "inset-0 flex items-center justify-center"
      } bg-black bg-opacity-50 rounded-md`}
    >
      <div
        className={`bg-black text-green-700 bg-opacity-15 backdrop-blur-md font-mono rounded-md transition-all ${
          isMinimized ? "h-12 w-60" : "w-[50vw] h-[50vh]"
        }`}
      >
        <div className="flex justify-between items-center bg-white p-2 rounded-t-md">
          <span className="text-sm">Pseudo Terminal</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-800 hover:text-blue-500"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-800 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        {!isMinimized && (
          <div className="py-4 h-full flex flex-col">
            <div className="flex-grow overflow-y-auto">
              {output.map((line, index) => (
                <div
                  className={`pl-2 ${getTextColorClass(line)}`}
                  key={index}
                >
                  {line}
                </div>
              ))}
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex mt-2 py-2 px-2 bg-transparent rounded-b-md bottom-1 absolute w-full"
            >
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
