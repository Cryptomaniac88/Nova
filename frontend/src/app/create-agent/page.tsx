"use client";

import { useState } from "react";

export default function CreateAgent() {
  const [agentName, setAgentName] = useState("");
  const [created, setCreated] = useState(false);

  const handleCreate = () => {
    if (agentName.trim() === "") return;
    setCreated(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-4xl font-bold mb-3">Create Your First Agent</h1>
      <p className="text-gray-400 mb-10 text-center">
        Give your first AI agent a name to get started.
      </p>

      {!created ? (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <input
            type="text"
            placeholder="Agent name (e.g. Aether, Nova, Atlas...)"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-green-500"
          />
          <button
            onClick={handleCreate}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 text-black font-medium rounded-lg transition-colors"
          >
            Create Agent
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-2xl text-green-400 mb-4">
            Agent “{agentName}” created!
          </p>
          <p className="text-gray-400">
            This is the beginning of your first agent.
          </p>
        </div>
      )}
    </main>
  );
}