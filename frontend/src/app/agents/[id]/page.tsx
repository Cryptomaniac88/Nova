"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Bot } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  instruction: string;
}

interface Message {
  role: "user" | "agent";
  text: string;
}

export default function AgentChatPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const addXp = (amount = 10) => {
    const currentXp = Number(localStorage.getItem("nova_xp") || "0");
    const newXp = currentXp + amount;
    const newLevel = Math.floor(newXp / 100) + 1;

    localStorage.setItem("nova_xp", String(newXp));
    localStorage.setItem("nova_level", String(newLevel));
  };
  useEffect(() => {
    const saved = localStorage.getItem("nova_agents");
    if (saved) {
      const list: Agent[] = JSON.parse(saved);
      const found = list.find((a) => a.id === agentId);
      if (found) {
        setAgent(found);
        setMessages([
          {
            role: "agent",
            text: `Hello, I am ${found.name} (${found.role}). How can I help you?`,
          },
        ]);
      }
    }
  }, [agentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || !agent) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          agent_name: agent.name,
          user_name: "Jonas",
          instruction: agent.instruction,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "agent", text: data.reply }]);
      addXp(10); // Add 10 XP for each successful interaction
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "Sorry, I could not reach the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!agent) {
    return (
      <div className="p-8 text-zinc-400">
        Agent not found.{" "}
        <button onClick={() => router.push("/agents")} className="text-green-400">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="px-6 py-4 border-b border-green-500/20 flex items-center gap-4">
        <button
          onClick={() => router.push("/agents")}
          className="text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <Bot className="text-green-400" size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-green-400">{agent.name}</p>
            <p className="text-xs text-zinc-500">{agent.role}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-xl text-sm whitespace-pre-wrap ${msg.role === "user"
                  ? "bg-green-600 text-black"
                  : "bg-zinc-900 border border-green-500/20 text-green-300"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-green-500/60 text-sm">Thinking...</div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-green-500/20">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`Message ${agent.name}...`}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-green-500/30 text-white focus:outline-none focus:border-green-400"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-black font-medium rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}