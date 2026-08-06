"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Lock, CheckCircle2, Circle } from "lucide-react";

type LevelStatus = "completed" | "available" | "locked";

interface Level {
    id: number;
    title: string;
    description: string;
    xp: number;
    status: LevelStatus;
}

const LEVELS: Level[] = [
    {
        id: 0,
        title: "Orientation",
        description: "Meet Companion, create your first agent, understand the dashboard.",
        xp: 50,
        status: "available",
    },
    {
        id: 1,
        title: "First Interface",
        description: "Understand UI structure: pages, buttons, agent cards.",
        xp: 100,
        status: "locked",
    },
    {
        id: 2,
        title: "Talking to the Backend",
        description: "Learn how the frontend talks to an API.",
        xp: 100,
        status: "locked",
    },
    {
        id: 3,
        title: "Data that Stays",
        description: "Save and load data (agents, chat, progress).",
        xp: 100,
        status: "locked",
    },
    {
        id: 4,
        title: "Memory & Context",
        description: "Give agents persistent notes/memory.",
        xp: 150,
        status: "locked",
    },
    {
        id: 5,
        title: "Full-Stack Mini Feature",
        description: "Build a small feature end-to-end.",
        xp: 200,
        status: "locked",
    },
];

export default function LearnPage() {
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [completed, setCompleted] = useState<number[]>([]);

    useEffect(() => {
        setXp(Number(localStorage.getItem("nova_xp") || "0"));
        setLevel(Number(localStorage.getItem("nova_level") || "1"));
        const saved = localStorage.getItem("nova_learn_completed");
        if (saved) setCompleted(JSON.parse(saved));
    }, []);

    const getStatus = (id: number): LevelStatus => {
        if (completed.includes(id)) return "completed";
        if (id === 0 || completed.includes(id - 1)) return "available";
        return "locked";
    };

    return (
        <div className="p-8 h-full overflow-y-auto bg-black">
            <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <p className="text-green-500 text-sm font-medium mb-2 flex items-center gap-2">
                        <BookOpen size={16} />
                        BUILDER TRACK
                    </p>
                    <h1 className="text-3xl font-bold text-white mb-2">Learn</h1>
                    <p className="text-zinc-400">
                        Nova Builder Track — level up by completing real building tasks
                    </p>
                </div>
                <div className="bg-zinc-900 border border-green-500/20 rounded-xl px-5 py-4 min-w-[200px]">
                    <div className="flex justify-between text-sm text-zinc-400 mb-1">
                        <span>Level {level}</span>
                        <span>{xp} XP</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${Math.min((xp % 100), 100)}%` }}
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {LEVELS.map((item) => {
                    const status = getStatus(item.id);
                    const locked = status === "locked";

                    return (
                        <div
                            key={item.id}
                            className={`bg-zinc-900 border rounded-xl p-6 transition-all ${locked
                                    ? "border-zinc-800 opacity-50"
                                    : "border-green-500/20 hover:border-green-500/40"
                                }`}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${status === "completed"
                                            ? "bg-green-500 text-black"
                                            : "bg-green-500/10 text-green-400 border border-green-500/30"
                                        }`}
                                >
                                    {status === "completed" ? (
                                        <CheckCircle2 size={20} />
                                    ) : locked ? (
                                        <Lock size={18} />
                                    ) : (
                                        <span className="font-bold">{item.id}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wide">
                                        Level {item.id}
                                    </p>
                                    <h2 className="text-xl font-bold text-white">{item.title}</h2>
                                </div>
                            </div>

                            <p className="text-sm text-zinc-400 mb-4">{item.description}</p>

                            <div className="flex items-center gap-2 mb-4">
                                <span
                                    className={`text-xs px-2 py-1 rounded-full border ${status === "completed"
                                            ? "border-green-500/40 text-green-400"
                                            : status === "available"
                                                ? "border-zinc-600 text-zinc-300"
                                                : "border-zinc-700 text-zinc-500"
                                        }`}
                                >
                                    {status === "completed"
                                        ? "Completed"
                                        : status === "available"
                                            ? "Available"
                                            : "Locked"}
                                </span>
                                <span className="text-xs text-yellow-500">{item.xp} XP</span>
                            </div>

                            {locked ? (
                                <button
                                    disabled
                                    className="w-full py-2.5 rounded-lg bg-zinc-800 text-zinc-500 text-sm cursor-not-allowed"
                                >
                                    Locked
                                </button>
                            ) : (
                                <Link
                                    href={`/learn/${item.id}`}
                                    className="block w-full text-center py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-black font-medium text-sm transition-colors"
                                >
                                    Open level
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}