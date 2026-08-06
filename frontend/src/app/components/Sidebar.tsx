"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bot, MessageSquare, Settings, Layers } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/create-agent", label: "Companion", icon: MessageSquare },
    { href: "/agents", label: "Agents", icon: Bot },
    { href: "/learn", label: "Learn", icon: BookOpen },
    { href: "/control-room", label: "Control Room", icon: Settings },
  ];

  return (
    <div className="w-64 bg-zinc-950 border-r border-green-500/20 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-green-500/20">
        <div className="p-2 bg-green-600/20 border border-green-500/40 rounded-lg">
          <Layers className="text-green-400" size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">NOVA</h1>
          <p className="text-xs text-green-500/70">Companion Platform</p>
        </div>
      </div>

      {/* Navigatie */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? "bg-green-500/10 text-green-400 border-l-2 border-green-400"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Status */}
      <div className="p-4 border-t border-green-500/20">
        <div className="bg-zinc-900/80 p-3 rounded-lg border border-green-500/10">
          <p className="text-xs text-zinc-500 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-zinc-300">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}