import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-5xl font-bold mb-4 tracking-wider">NOVA</h1>
      <p className="text-lg text-gray-400 mb-10">
        Build your first AI agent
      </p>

      <Link href="/create-agent">
        <button className="px-8 py-3 bg-green-600 hover:bg-green-500 text-black font-medium rounded-lg transition-colors">
          Start Building Your First Agent
        </button>
      </Link>

      <p className="mt-8 text-sm text-gray-600">
        Phase 0 – Foundation
      </p>
    </main>
  );
}