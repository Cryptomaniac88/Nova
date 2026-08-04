"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Bot, Trash2, MessageSquare, Pencil } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  instruction: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [instruction, setInstruction] = useState("");

  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("nova_agents");
    if (saved) setAgents(JSON.parse(saved));
  }, []);

  const saveAgents = (list: Agent[]) => {
    setAgents(list);
    localStorage.setItem("nova_agents", JSON.stringify(list));
  };

  const resetForm = () => {
    setName("");
    setRole("");
    setInstruction("");
    setIsCreating(false);
    setEditingId(null);
  };

  const handleCreate = () => {
    if (!name.trim() || !role.trim()) return;

    const newAgent: Agent = {
      id: crypto.randomUUID(),
      name: name.trim(),
      role: role.trim(),
      instruction: instruction.trim() || "You are a helpful agent.",
    };

    saveAgents([...agents, newAgent]);
    resetForm();
  };

  const startEdit = (agent: Agent) => {
    setEditingId(agent.id);
    setIsCreating(false);
    setName(agent.name);
    setRole(agent.role);
    setInstruction(agent.instruction);
  };

  const handleUpdate = () => {
    if (!editingId || !name.trim() || !role.trim()) return;

    const updated = agents.map((a) =>
      a.id === editingId
        ? {
            ...a,
            name: name.trim(),
            role: role.trim(),
            instruction: instruction.trim() || "You are a helpful agent.",
          }
        : a
    );

    saveAgents(updated);
    resetForm();
  };

  const handleDelete = (id: string) => {
    saveAgents(agents.filter((a) => a.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-black">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Agents</h1>
          <p className="text-zinc-400">Create and manage your AI agents.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsCreating(true);
          }}
          className="bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
        >
          <Plus size={18} />
          New Agent
        </button>
      </header>

      {(isCreating || editingId) && (
        <div className="mb-8 bg-zinc-900 border border-green-500/20 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingId ? "Edit Agent" : "Create Agent"}
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-950 border border-green-500/30 text-white focus:outline-none focus:border-green-400"
            />
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role"
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-950 border border-green-500/30 text-white focus:outline-none focus:border-green-400"
            />
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Instructions"
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-950 border border-green-500/30 text-white focus:outline-none focus:border-green-400 resize-none"
            />
            <div className="flex justify-end gap-3">
              <button onClick={resetForm} className="px-4 py-2 text-zinc-400">
                Cancel
              </button>
              <button
                onClick={editingId ? handleUpdate : handleCreate}
                className="bg-green-600 hover:bg-green-500 text-black px-6 py-2 rounded-lg font-medium"
              >
                {editingId ? "Save Changes" : "Create Agent"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-zinc-900 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <Bot className="text-green-400" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{agent.name}</h3>
                  <p className="text-sm text-green-400">{agent.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(agent)}
                  className="text-zinc-600 hover:text-green-400"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(agent.id)}
                  className="text-zinc-600 hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-sm text-zinc-400 mb-4 line-clamp-3">
              {agent.instruction}
            </p>
            <p className="text-xs text-zinc-600 mb-4">
              ID: {agent.id.slice(0, 8)}...
            </p>

            <button
              onClick={() => router.push(`/agents/${agent.id}`)}
              className="w-full flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/40 text-green-400 py-2 rounded-lg text-sm transition-colors"
            >
              <MessageSquare size={16} />
              Open Chat
            </button>
          </div>
        ))}

        {agents.length === 0 && !isCreating && (
          <div className="col-span-full text-center py-16 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
            <Bot className="mx-auto mb-4 opacity-40" size={40} />
            <p className="text-lg">No agents yet</p>
          </div>
        )}
      </div>
    </div>
  );
}