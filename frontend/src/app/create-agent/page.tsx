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

    if (savedLevel) setLevel(Number(savedLevel));

    if (savedAgent && savedUser) {
      setAgentName(savedAgent);
      setUserName(savedUser);
      setStep("chat");

      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([
          {
            role: "agent",
            text: `Hello ${savedUser}, how can I help you?`,
          },
        ]);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("nova_chat_messages", JSON.stringify(messages));

      // Level 1 ontgrendelen na 5 berichten
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
      text: `Hello ${userName.trim()}, how can I help you?`,
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          agent_name: agentName,
          user_name: userName,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: "Sorry, I could not reach the server. Is the backend running?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
      {step !== "chat" && (
        <h1 className="text-4xl font-bold mb-3">Create Your First Agent</h1>
      )}

      {step === "name-agent" && (
        <>
          <p className="text-gray-400 mb-10 text-center">
            First, give your AI agent a name.
          </p>
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <input
              type="text"
              placeholder="Agent name (e.g. Aether, Nova, Atlas...)"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleAgentName}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 text-black font-medium rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </>
      )}

      {step === "name-user" && (
        <>
          <p className="text-green-400 text-xl mb-2">
            Agent “{agentName}” is ready.
          </p>
          <p className="text-gray-400 mb-10 text-center">
            What is your name?
          </p>
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <input
              type="text"
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleUserName}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 text-black font-medium rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </>
      )}

      {step === "chat" && (
        <div className="w-full max-w-lg flex flex-col h-[80vh]">
          {/* Verbeterde hologram met ogen */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-400/40 animate-pulse flex items-center justify-center gap-4">
                {/* Ogen */}
                <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]"></div>
              </div>
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-green-400/10 blur-xl"></div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4 px-2">
            <div>
              <p className="text-green-400 text-sm">{agentName} is online</p>
              <p className="text-xs text-gray-500">Level {level}</p>
            </div>
            <Link
              href="/control-room"
              className="text-sm text-gray-400 hover:text-green-400 transition-colors"
            >
              Control Room →
            </Link>
          </div>

          {level >= 1 && (
            <div className="mb-3 text-center text-xs text-green-500/80">
              Level 1 unlocked
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-green-600 text-black"
                      : "bg-zinc-900 border border-green-500/30 text-green-400"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-green-500 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-5 py-3 bg-green-600 hover:bg-green-500 text-black font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}