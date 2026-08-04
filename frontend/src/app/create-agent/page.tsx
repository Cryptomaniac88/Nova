"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function CreateAgent() {
  const [step, setStep] = useState<"name-agent" | "name-user" | "chat">("name-agent");
  const [agentName, setAgentName] = useState("");
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState<{ role: "agent" | "user"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedAgent = localStorage.getItem("nova_first_agent");
    const savedUser = localStorage.getItem("nova_user_name");
    const savedMessages = localStorage.getItem("nova_chat_messages");
    const savedLevel = localStorage.getItem("nova_level");
    const evolutionShown = localStorage.getItem("nova_evolution_1");

    if (savedLevel) setLevel(Number(savedLevel));

    if (savedAgent && savedUser) {
      setAgentName(savedAgent);
      setUserName(savedUser);
      setStep("chat");

      let initialMessages: { role: "agent" | "user"; text: string }[] = [];

      if (savedMessages) {
        initialMessages = JSON.parse(savedMessages);
      } else {
        initialMessages = [
          {
            role: "agent",
            text: `Hello ${savedUser}, I am your Companion. How can I help you?`,
          },
        ];
      }

      if (!evolutionShown) {
        initialMessages.push({
          role: "agent",
          text: `I just evolved.\n\nI can now give you concrete suggestions to improve Nova.\n\nTry asking me:\n"How can I improve the hologram?"\nor\n"What should we build next?"`,
        });
        localStorage.setItem("nova_evolution_1", "true");
      }

      setMessages(initialMessages);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("nova_chat_messages", JSON.stringify(messages));

      if (messages.length >= 5 && level < 1) {
        setLevel(1);
        localStorage.setItem("nova_level", "1");
      }
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAgentName = () => {
    if (agentName.trim() === "") return;
    localStorage.setItem("nova_first_agent", agentName.trim());
    setStep("name-user");
  };

  const handleUserName = () => {
    if (userName.trim() === "") return;
    localStorage.setItem("nova_user_name", userName.trim());

    const firstMessage = {
      role: "agent" as const,
      text: `Hello ${userName.trim()}, I am your Companion. How can I help you?`,
    };

    setMessages([firstMessage]);
    setStep("chat");
  };

  const handleSend = async () => {
    if (input.trim() === "" || loading) return;

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
          agent_name: agentName || "Companion",
          user_name: userName,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "agent", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "Sorry, I could not reach the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen flex-col bg-black text-white overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-green-500/20 bg-zinc-950/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-400/50 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
          <div>
            <p className="text-sm font-medium text-green-400">
              {agentName || "Companion"} · Online
            </p>
            <p className="text-xs text-gray-500">Level {level} · Companion</p>
          </div>
        </div>
        <Link
          href="/control-room"
          className="text-sm text-gray-400 hover:text-green-400 transition-colors"
        >
          Control Room →
        </Link>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-green-600 text-black"
                  : "bg-zinc-900 border border-green-500/20 text-green-300"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-green-500/20 text-green-400/70 px-4 py-3 rounded-xl text-sm">
              Neural processing...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area - vast onderaan */}
      <div className="border-t border-green-500/20 bg-zinc-950/90 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            placeholder="Message your Companion..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-green-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-black font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}