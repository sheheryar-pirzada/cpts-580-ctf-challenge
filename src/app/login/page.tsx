"use client";

import { useState } from "react";
import MatrixEffect from "@/components/magicui/MatrixEffect";
import { WordRotate } from "@/components/magicui/WordRotate";
import { useRouter } from "next/navigation";
import { Silkscreen } from "next/font/google";

const s = Silkscreen({ weight: "400", style: "normal", subsets: ["latin"] });
const s2 = Silkscreen({ weight: "700", style: "normal", subsets: ["latin"] });


export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isSignUp ? "/api/register" : "/api/login";
    const payload = { username: formData.username, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (response.flag) {
        setMessage(`${response.message} ${response.flag}`);
      } else {
        if (!isSignUp) {
          // Store auth token in cookies
          document.cookie = `auth_token=${data.token}; path=/`;

          // Store username and user ID in localStorage
          localStorage.setItem("user_id", data.id);
          localStorage.setItem("username", data.username);

          router.push("/home");
        } else {
          setIsSignUp(false);
        }
      }
    } catch (error) {
      // @ts-expect-error xyz
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MatrixEffect />
      <div className="flex h-screen bg-transparent text-gray-200 relative z-10">
        <div className={`transition-all duration-500 ${isSignUp ? "w-0 opacity-0" : "w-1/2 opacity-100"} flex flex-col justify-center items-center bg-transparent backdrop-blur-md overflow-hidden`}>
          <h1 className={`${s2.className} text-6xl`}>Challenge Hints</h1>
          <WordRotate
            duration={5000}
            className={`text-2xl text-white ${s.className}`}
            words={["Trust is good, validation is better (OR is it?)", "Admin access, either you have it OR you take it", "Weak passwords: Guess it AND you're in", "Some inputs open doors OR break them"]}
          />
        </div>

        <div className={`${isSignUp ? "w-full" : "w-1/2"} flex flex-col justify-center items-center transition-all duration-500`}>
          <div className={`${isSignUp ? "w-full" : "w-[50vw]"} transition-all duration-500 h-[100vh] flex flex-col justify-center items-center p-10 bg-black`}>
            <h2 className="text-2xl font-semibold">{isSignUp ? "Create Account" : "Login"}</h2>

            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-red-500">{message}</p>}

            <form onSubmit={handleSubmit} className="mt-6 w-full max-w-sm space-y-4">
              <div>
                <label className="block text-sm text-gray-400">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  required
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm text-gray-400">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>

            <p className="mt-4 text-gray-400">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                className="text-gray-400 hover:underline hover:text-gray-200"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Login" : "Create Account"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
