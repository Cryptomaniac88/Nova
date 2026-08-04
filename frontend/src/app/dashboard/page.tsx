"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bot, MessageSquare, Zap, Activity } from "lucide-react";

export default function Dashboard() {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [agents, setAgents] = useState(0);

  useEffect(() => {
    const savedXp = Number(localStorage.getItem("nova_xp") || "0");
    const savedLevel = Number(localStorage.getItem("nova_level") || "1");
    const savedAgents = localStorage.getItem("nova_agents");

    setXp(savedXp);
    setLevel(savedLevel);
    setAgents(savedAgents ? JSON.parse(savedAgents).length : 0);
  }, []);

  return (
    <div className="p-8 h-full overflow-y-auto bg-black">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-zinc-400">
          Welcome back, Owner. Here is your Nova overview.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-900 border border-green-500/20 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Activity className="text-green-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-white">{level}</span>
          </div>
          <p className="text-zinc-500 text-sm">Level</p>
        </div>

        <div className="bg-zinc-900 border border-green-500/20 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Bot className="text-green-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-white">{agents}</span>
          </div>
          <p className="text-zinc-500 text-sm">Agents</p>
        </div>

        <div className="bg-zinc-900 border border-green-500/20 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Zap className="text-green-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-white">{xp}</span>
          </div>
          <p className="text-zinc-500 text-sm">XP</p>
        </div>

        <div className="bg-zinc-900 border border-green-500/20 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <MessageSquare className="text-green-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-green-400">Online</span>
          </div>
          <p className="text-zinc-500 text-sm">Companion</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/create-agent"
          className="bg-zinc-900 border border-green-500/20 p-6 rounded-xl hover:border-green-500/50 transition-all"
        >
          <h2 className="text-xl font-bold text-white mb-2">Open Companion</h2>
          <p className="text-zinc-400 text-sm">
            Talk with your holographic Companion.
          </p>
        </Link>

        <Link
          href="/agents"
          className="bg-zinc-900 border border-green-500/20 p-6 rounded-xl hover:border-green-500/50 transition-all"
        >
          <h2 className="text-xl font-bold text-white mb-2">Manage Agents</h2>
          <p className="text-zinc-400 text-sm">
            Create and manage your AI agents.
          </p>
        </Link>
      </div>
    </div>
  );
}