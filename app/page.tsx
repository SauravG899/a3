import { MemoryGame } from "@/components/memory-game"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Memory Match</h1>
        <p className="text-slate-600 dark:text-slate-400">Find all matching pairs with the fewest moves!</p>
      </div>
      <MemoryGame showInstructionsOnLoad={true} />
    </main>
  )
}
