"use client"
import { motion } from "framer-motion"
import type { CardItem, GameMode } from "./memory-game"

interface CardProps {
  card: CardItem
  gameMode: GameMode
  onClick: () => void
}

export function Card({ card, gameMode, onClick }: CardProps) {
  return (
    <div className="aspect-square perspective-1000 cursor-pointer" onClick={onClick}>
      <motion.div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          card.flipped ? "rotate-y-180" : ""
        }`}
        initial={false}
        animate={{ rotateY: card.flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card Back */}
        <div
          className={`absolute w-full h-full backface-hidden rounded-lg border flex items-center justify-center ${
            card.matched
              ? "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          }`}
        >
          <div className="text-slate-400 dark:text-slate-500 text-2xl font-bold">?</div>
        </div>

        {/* Card Front */}
        <div
          className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-lg border flex items-center justify-center ${
            card.matched
              ? "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          }`}
        >
          {gameMode === "pictures" ? (
            <div className="text-4xl">{card.value}</div>
          ) : (
            <div className="text-center p-1 text-sm sm:text-base">{card.value}</div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
