"use client";

import { useState } from "react";

export default function CreateAgent() {
  const [step, setStep] = useState<"name-agent" | "name-user" | "done">("name-agent");
  const [agentName, setAgentName] = useState("");
  const [userName, setUserName] = useState("");
  const [reply, setReply] = useState("");

  const handleAgentName = () => {
    if (agentName.trim() === "") return;
    localStorage.setItem("nova_first_agent", agentName.trim());
    setStep("name-user");
  };

  const handleUserName = () => {
    if (userName.trim() === "") return;
    setReply(`Hello ${userName.trim()}, how can I help you?`);
    localStorage.setItem("nova_user_name", userName.trim());
    setStep("done");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-4xl font-bold mb-3">Create Your First Agent</h1>

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

      {step === "done" && (
        <div className="flex flex-col items-center text-center max-w-md">
          {/* Eenvoudige holografische orb */}
          <div className="relative mb-8">
            <div className="w-28 h-28 rounded-full bg-green-500/20 border border-green-400/50 animate-pulse"></div>
            <div className="absolute inset-0 w-28 h-28 rounded-full bg-green-400/10 blur-xl"></div>
          </div>

          <div className="mb-6 p-6 border border-green-500/30 rounded-xl bg-green-500/5">
            <p className="text-xl text-green-400">{reply}</p>
          </div>

          <p className="text-sm text-gray-500">
            Level 0 completed – Your first agent is alive
          </p>
        </div>
      )}
    </main>
  );
}