"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ControlRoom() {
  const [agentName, setAgentName] = useState("");
  const [userName, setUserName] = useState("");
  const [messageCount, setMessageCount] = useState(0);

  const [editingAgent, setEditingAgent] = useState(false);
  const [editingUser, setEditingUser] = useState(false);
  const [tempAgentName, setTempAgentName] = useState("");
  const [tempUserName, setTempUserName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedAgent = localStorage.getItem("nova_first_agent") || "Unknown";
    const savedUser = localStorage.getItem("nova_user_name") || "Unknown";
    const savedMessages = localStorage.getItem("nova_chat_messages");

    setAgentName(savedAgent);
    setUserName(savedUser);
    setTempAgentName(savedAgent);
    setTempUserName(savedUser);

    if (savedMessages) {
      const messages = JSON.parse(savedMessages);
      setMessageCount(messages.length);
    } else {
      setMessageCount(0);
    }
  };

  const saveAgentName = () => {
    if (tempAgentName.trim() === "") return;
    localStorage.setItem("nova_first_agent", tempAgentName.trim());
    setAgentName(tempAgentName.trim());
    setEditingAgent(false);
  };

  const saveUserName = () => {
    if (tempUserName.trim() === "") return;
    localStorage.setItem("nova_user_name", tempUserName.trim());
    setUserName(tempUserName.trim());
    setEditingUser(false);
  };

  const clearHistory = () => {
    const confirmed = confirm("Are you sure you want to delete the chat history?");
    if (!confirmed) return;

    localStorage.removeItem("nova_chat_messages");
    setMessageCount(0);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-4xl font-bold mb-2">Control Room</h1>
      <p className="text-gray-400 mb-10">Overview of your agents</p>

      <div className="w-full max-w-md border border-green-500/30 rounded-xl p-6 bg-green-500/5 space-y-6">
        {/* Agent Name */}
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-400/50 animate-pulse"></div>
            <div className="flex-1">
              {editingAgent ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempAgentName}
                    onChange={(e) => setTempAgentName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-white text-sm"
                  />
                  <button
                    onClick={saveAgentName}
                    className="px-3 py-2 bg-green-600 text-black text-sm rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xl text-green-400 font-medium">{agentName}</p>
                  <p className="text-sm text-gray-400">Status: Online</p>
                </>
              )}
            </div>
          </div>
          {!editingAgent && (
            <button
              onClick={() => setEditingAgent(true)}
              className="text-sm text-gray-400 hover:text-green-400"
            >
              Edit agent name
            </button>
          )}
        </div>

        {/* User Name */}
        <div className="border-t border-zinc-800 pt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-400 text-sm">Created by</span>
            {!editingUser && (
              <button
                onClick={() => setEditingUser(true)}
                className="text-sm text-gray-400 hover:text-green-400"
              >
                Edit
              </button>
            )}
          </div>
          {editingUser ? (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-white text-sm"
              />
              <button
                onClick={saveUserName}
                className="px-3 py-2 bg-green-600 text-black text-sm rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-white">{userName}</p>
          )}
        </div>

        {/* Stats */}
        <div className="border-t border-zinc-800 pt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Total messages</span>
            <span>{messageCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Level</span>
            <span className="text-green-400">0</span>
          </div>
        </div>

        {/* Clear History */}
        <div className="border-t border-zinc-800 pt-4">
          <button
            onClick={clearHistory}
            className="w-full px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-colors"
          >
            Clear chat history
          </button>
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