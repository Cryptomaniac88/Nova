"use client";

import { useState, useEffect } from "react";
import { Plus, Bot, Trash2 } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  instruction: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [instruction, setInstruction] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("nova_agents");
    if (saved) {
      setAgents(JSON.parse(saved));
    }
  }, []);

  const saveAgents = (list: Agent[]) => {
    setAgents(list);
    localStorage.setItem("nova_agents", JSON.stringify(list));
  };

  const handleCreate = () => {
    if (!name.trim() || !role.trim()) return;

    const newAgent: Agent = {
      id: crypto.randomUUID(),
      name: name.trim(),
      role: role.trim(),
      instruction: instruction.trim() || "You are a helpful agent.",
    };

    const updated = [...agents, newAgent];
    saveAgents(updated);

    setName("");
    setRole("");
    setInstruction("");
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    const updated = agents.filter((a) => a.id !== id);
    saveAgents(updated);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-black">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Agents</h1>
          <p className="text-zinc-400">Create and manage your AI agents.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={18} />
          New Agent
        </button>
      </header>

      {isCreating && (
        <div className="mb-8 bg-zinc-900 border border-green-500/20 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">Create Agent</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Atlas, Nova, Research Bot"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-950 border border-green-500/30 text-white focus:outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Research Assistant, Coder, Planner"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-950 border border-green-500/30 text-white focus:outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Instructions
              </label>
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="How should this agent behave?"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-950 border border-green-500/30 text-white focus:outline-none focus:border-green-400 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-green-600 hover:bg-green-500 text-black px-6 py-2 rounded-lg font-medium"
              >
                Create Agent
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-zinc-900 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all relative"
          >
            <button
              onClick={() => handleDelete(agent.id)}
              className="absolute top-4 right-4 text-zinc-600 hover:text-red-400"
            >
              <Trash2 size={16} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                <Bot className="text-green-400" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">{agent.name}</h3>
                <p className="text-sm text-green-400">{agent.role}</p>
              </div>
            </div>
            <p className="text-sm text-zinc-400 line-clamp-3">
              {agent.instruction}
            </p>
            <p className="text-xs text-zinc-600 mt-3">
              ID: {agent.id.slice(0, 8)}...
            </p>
          </div>
        ))}

        {agents.length === 0 && !isCreating && (
          <div className="col-span-full text-center py-16 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
            <Bot className="mx-auto mb-4 opacity-40" size={40} />
            <p className="text-lg">No agents yet</p>
            <p className="text-sm">Create your first agent to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}