"use client"
import { motion } from "framer-motion"
import type { CardItem, GameMode } from "./memory-game"

interface CardProps {
  card: CardItem
  gameMode: GameMode
  onClick: () => void
}

export function Card({ card, gameMode, onClick }: CardProps) {
  // Color classes for each mode
  const cardBackClass = gameMode === "pictures"
    ? card.matched
      ? "bg-[#ffff4d] border-yellow-300" // matched = yellow
      : "bg-[#ff7f32] border-[#ff7f32]" // orange
    : card.matched
      ? "bg-[#e3e3e3] border-[#e3e3e3]" // lighter gray for matched facts
      : "bg-[#bfc4c9] border-[#bfc4c9]" // darker gray for unmatched facts
  const questionClass = gameMode === "pictures"
    ? "text-[#23407a]"
    : "text-white"
  const cardFrontClass = gameMode === "pictures"
    ? card.matched
      ? "bg-[#ffff4d] border-yellow-300"
      : "bg-[#ff7f32] border-[#ff7f32]"
    : card.matched
      ? "bg-[#e3e3e3] border-[#e3e3e3]" // lighter gray for matched facts
      : "bg-[#bfc4c9] border-[#bfc4c9]" // darker gray for unmatched facts
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
          className={`absolute w-full h-full backface-hidden rounded-lg border flex items-center justify-center ${cardBackClass}`}
        >
          <div className={`text-4xl font-bold ${questionClass}`}>?</div>
        </div>
        {/* Card Front */}
        <div
          className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-lg border flex items-center justify-center ${cardFrontClass}`}
        >
          {gameMode === "pictures" ? (
            <div className="text-4xl">{card.value}</div>
          ) : (
            <div className="text-center p-1 text-base sm:text-lg font-fancy">{card.value}</div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
