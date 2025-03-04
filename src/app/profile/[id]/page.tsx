"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();
  }, [id]);

  async function updateStatus() {
    try {
      const res = await fetch(`/api/users/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();
      if (data.flag) {
        setUser(data.updatedUser);
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setStatus("");
    }
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      {!user ? (
        <h2>Loading...</h2>
      ) : (
        <div className="flex h-full w-full items-center justify-center mt-[15vh]">
          <div className="w-full max-w-lg bg-white/5 bg-opacity-5 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
            <h1 className="text-3xl font-bold text-center">{user.username}'s Profile</h1>

            <p className="mt-3 text-gray-300 text-center">
              Status: <span className="font-semibold">{user.status || "No status set"}</span>
            </p>

            <div className="mt-6">
              <label htmlFor="status" className="text-sm text-gray-400">Update Status:</label>
              <input
                type="text"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-2 w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write something..."
              />
            </div>

            <button
              className="mt-4 w-full font-semibold bg-slate-100 text-black px-4 py-3 rounded-lg hover:bg-black hover:text-white transition-colors"
              onClick={updateStatus}
            >
              Update Status
            </button>
            <div className="w-full text-center mt-4 text-red-500">
              {message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
