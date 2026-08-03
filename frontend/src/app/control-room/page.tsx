"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ControlRoom() {
  const [agentName, setAgentName] = useState("");
  const [userName, setUserName] = useState("");
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const savedAgent = localStorage.getItem("nova_first_agent") || "Unknown";
    const savedUser = localStorage.getItem("nova_user_name") || "Unknown";
    const savedMessages = localStorage.getItem("nova_chat_messages");

    setAgentName(savedAgent);
    setUserName(savedUser);

    if (savedMessages) {
      const messages = JSON.parse(savedMessages);
      setMessageCount(messages.length);
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-4xl font-bold mb-2">Control Room</h1>
      <p className="text-gray-400 mb-10">Overview of your agents</p>

      <div className="w-full max-w-md border border-green-500/30 rounded-xl p-6 bg-green-500/5">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-400/50 animate-pulse"></div>
          <div>
            <p className="text-xl text-green-400 font-medium">{agentName}</p>
            <p className="text-sm text-gray-400">Status: Online</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Created by</span>
            <span>{userName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total messages</span>
            <span>{messageCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Level</span>
            <span className="text-green-400">0</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <Link href="/create-agent">
          <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-black font-medium rounded-lg transition-colors">
            Back to Chat
          </button>
        </Link>
        <Link href="/">
          <button className="px-6 py-3 border border-zinc-700 hover:border-green-500 text-gray-300 rounded-lg transition-colors">
            Home
          </button>
        </Link>
      </div>
    </main>
  );
}