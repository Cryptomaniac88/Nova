"use client";

import { useState } from "react";
import Link from "next/link";

export default function CompanionWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Mini chat panel */}
      {open && (
        <div className="w-80 bg-zinc-950 border border-green-500/30 rounded-2xl shadow-2xl shadow-green-500/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-green-500/20 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-400">Companion</p>
              <p className="text-xs text-zinc-500">Online</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-zinc-500 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
          <div className="p-4 h-48 flex items-center justify-center text-zinc-500 text-sm">
            <Link
              href="/create-agent"
              className="text-green-400 hover:underline"
            >
              Open full Companion chat →
            </Link>
          </div>
        </div>
      )}

      {/* Hologram orb button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-green-500/20 border border-green-400/50 flex items-center justify-center gap-1 hover:scale-105 transition-all shadow-lg shadow-green-500/20 animate-pulse"
        title="Open Companion"
      >
        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]"></div>
        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]"></div>
      </button>
    </div>
  );
}