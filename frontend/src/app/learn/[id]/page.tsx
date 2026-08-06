"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const LEVEL_CONTENT: Record<
    string,
    {
        title: string;
        xp: number;
        goal: string;
        learn: string[];
        assignment: string[];
        doneWhen: string[];
    }
> = {
    "0": {
        title: "Orientation",
        xp: 50,
        goal: "You can use Nova as a learning and building environment.",
        learn: [
            "What Companion, Agents, Dashboard and XP do",
            "How to create an agent and chat with it",
            "How to see your progress",
        ],
        assignment: [
            "Open Companion and ask 1 question about Nova",
            "Create an agent (or open Research Bot)",
            "Send 1 message and check XP on the Dashboard",
        ],
        doneWhen: [
            "You have talked to Companion and an agent",
            "You know where XP and Level are shown",
            "You can explain in 2 sentences what Nova is",
        ],
    },
    "1": {
        title: "First Interface",
        xp: 100,
        goal: "You understand how a screen in Nova is structured.",
        learn: [
            "Page vs simple UI parts",
            "Where text, buttons and layout sit",
            "That the UI works with data (agents list, chat)",
        ],
        assignment: [
            "Open the Agents page",
            "List 3 parts you see (title, button, card)",
            "Edit an agent instruction and test if chat behavior changes",
        ],
        doneWhen: [
            "You can point out navigation, list and action button",
            "You proved agent instructions change behavior",
            "You briefly explained this to Companion",
        ],
    },
};

export default function LevelDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const content = LEVEL_CONTENT[id];

    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("nova_learn_completed");
        if (saved) {
            const list: number[] = JSON.parse(saved);
            setCompleted(list.includes(Number(id)));
        }
    }, [id]);

    const markComplete = () => {
        const key = "nova_learn_completed";
        const saved = localStorage.getItem(key);
        const list: number[] = saved ? JSON.parse(saved) : [];
        const levelId = Number(id);

        if (!list.includes(levelId)) {
            list.push(levelId);
            localStorage.setItem(key, JSON.stringify(list));

            const currentXp = Number(localStorage.getItem("nova_xp") || "0");
            const add = content?.xp || 0;
            const newXp = currentXp + add;
            const newLevel = Math.floor(newXp / 100) + 1;
            localStorage.setItem("nova_xp", String(newXp));
            localStorage.setItem("nova_level", String(newLevel));
        }

        setCompleted(true);
    };

    if (!content) {
        return (
            <div className="p-8 text-zinc-400">
                Level not found.{" "}
                <Link href="/learn" className="text-green-400">
                    Back
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 h-full overflow-y-auto bg-black max-w-3xl">
            <button
                onClick={() => router.push("/learn")}
                className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 text-sm"
            >
                <ArrowLeft size={16} />
                Back to Learn
            </button>

            <p className="text-green-500 text-sm mb-1">LEVEL {id}</p>
            <h1 className="text-3xl font-bold text-white mb-2">{content.title}</h1>
            <p className="text-yellow-500 text-sm mb-8">{content.xp} XP</p>

            {completed && (
                <div className="mb-6 flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3">
                    <CheckCircle2 size={18} />
                    Level completed
                </div>
            )}

            <section className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-2">Goal</h2>
                <p className="text-zinc-400">{content.goal}</p>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-2">What you will learn</h2>
                <ul className="list-disc list-inside text-zinc-400 space-y-1">
                    {content.learn.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-2">Assignment</h2>
                <ol className="list-decimal list-inside text-zinc-400 space-y-1">
                    {content.assignment.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ol>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-2">Done when</h2>
                <ul className="list-disc list-inside text-zinc-400 space-y-1">
                    {content.doneWhen.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>

            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href="/create-agent"
                    className="px-4 py-2.5 rounded-lg border border-green-500/40 text-green-400 text-center text-sm hover:bg-green-500/10"
                >
                    Ask Companion for help
                </Link>
                <button
                    onClick={markComplete}
                    disabled={completed}
                    className="px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-black font-medium text-sm disabled:opacity-50"
                >
                    {completed ? "Completed" : "Mark as complete"}
                </button>
            </div>
        </div>
    );
}