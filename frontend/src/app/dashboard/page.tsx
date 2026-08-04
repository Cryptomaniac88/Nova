"use client";

import Link from "next/link";
import { Bot, MessageSquare, Zap, Activity } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-8 h-full overflow-y-auto bg-black">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-zinc-400">
          Welcome back, Owner. Here is your Nova overview.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-900 border border-green-500/20 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Activity className="text-green-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-white">1</span>
          </div>
          <p className="text-zinc-500 text-sm">Level</p>
        </div>

        <div className="bg-zinc-900 border border-green-500/20 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Bot className="text-green-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-white">1</span>
          </div>
          <p className="text-zinc-500 text-sm">Agents</p>
        </div>

        <div className="bg-zinc-900 border border-green-500/20 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Zap className="text-green-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-white">0</span>
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

      {/* Quick actions */}
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