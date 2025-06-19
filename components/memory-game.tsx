"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/card"
import { SettingsPanel } from "@/components/settings-panel"
import { InstructionsPopup } from "@/components/instructions-popup"
import { Button } from "@/components/ui/button"
import { Settings, RotateCcw, HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"

// Game types
export type GameMode = "pictures" | "facts"
export type Difficulty = "easy" | "medium" | "hard"

// Card data interfaces
export interface CardItem {
  id: number
  value: string
  matched: boolean
  flipped: boolean
  matchId?: number
}

interface MemoryGameProps {
  showInstructionsOnLoad?: boolean
}

export function MemoryGame({ showInstructionsOnLoad = false }: MemoryGameProps) {
  const [cards, setCards] = useState<CardItem[]>([])
  const [flippedCards, setFlippedCards] = useState<CardItem[]>([])
  const [moves, setMoves] = useState(0)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [gameMode, setGameMode] = useState<GameMode>("pictures")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [showSettings, setShowSettings] = useState(false)
  const [showInstructions, setShowInstructions] = useState(showInstructionsOnLoad)
  const [gameComplete, setGameComplete] = useState(false)
  const { toast } = useToast()

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [gameMode, difficulty])

  const initializeGame = () => {
    setFlippedCards([])
    setMoves(0)
    setMatchedPairs(0)
    setGameComplete(false)

    let cardCount = 0
    switch (difficulty) {
      case "easy":
        cardCount = 12
        break
      case "medium":
        cardCount = 16
        break
      case "hard":
        cardCount = 24
        break
    }

    const newCards = generateCards(cardCount, gameMode)
    setCards(newCards)
  }

  const generateCards = (count: number, mode: GameMode): CardItem[] => {
    let items: CardItem[] = []

    if (mode === "pictures") {
      // Emoji cards for picture mode
      const emojis = [
        "🐶",
        "🐱",
        "🐭",
        "🐹",
        "🐰",
        "🦊",
        "🐻",
        "🐼",
        "🐨",
        "🐯",
        "🦁",
        "🐮",
        "🐷",
        "🐸",
        "🐵",
        "🐔",
        "🐧",
        "🐦",
        "🦆",
        "🦉",
      ]
      const selectedEmojis = emojis.slice(0, count / 2)

      items = selectedEmojis.flatMap((emoji, index) => [
        { id: index * 2, value: emoji, matched: false, flipped: false },
        { id: index * 2 + 1, value: emoji, matched: false, flipped: false },
      ])
    } else {
      // Fact pairs for fact mode
      const factPairs = [
        { q: "France", a: "Paris" },
        { q: "Japan", a: "Tokyo" },
        { q: "Egypt", a: "Cairo" },
        { q: "Brazil", a: "Brasília" },
        { q: "Australia", a: "Canberra" },
        { q: "Canada", a: "Ottawa" },
        { q: "Germany", a: "Berlin" },
        { q: "India", a: "New Delhi" },
        { q: "Italy", a: "Rome" },
        { q: "Mexico", a: "Mexico City" },
        { q: "Russia", a: "Moscow" },
        { q: "Spain", a: "Madrid" },
      ]

      const selectedPairs = factPairs.slice(0, count / 2)

      items = selectedPairs.flatMap((pair, index) => [
        { id: index * 2, value: pair.q, matched: false, flipped: false, matchId: index },
        { id: index * 2 + 1, value: pair.a, matched: false, flipped: false, matchId: index },
      ])
    }

    // Shuffle cards
    return items.sort(() => Math.random() - 0.5)
  }

  const handleCardClick = (clickedCard: CardItem) => {
    // Prevent clicking if card is already flipped or matched
    if (clickedCard.flipped || clickedCard.matched || flippedCards.length >= 2) {
      return
    }

    // Flip the card
    const updatedCards = cards.map((card) => (card.id === clickedCard.id ? { ...card, flipped: true } : card))
    setCards(updatedCards)

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, clickedCard]
    setFlippedCards(newFlippedCards)

    // Check for match if we have 2 flipped cards
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)

      let isMatch = false

      if (gameMode === "pictures") {
        isMatch = newFlippedCards[0].value === newFlippedCards[1].value
      } else {
        isMatch = newFlippedCards[0].matchId === newFlippedCards[1].matchId
      }

      if (isMatch) {
        // Mark cards as matched
        setTimeout(() => {
          const matchedCards = cards.map((card) =>
            card.id === newFlippedCards[0].id || card.id === newFlippedCards[1].id ? { ...card, matched: true } : card,
          )
          setCards(matchedCards)
          setFlippedCards([])
          setMatchedPairs(matchedPairs + 1)

          // Check if game is complete
          if (matchedPairs + 1 === cards.length / 2) {
            setGameComplete(true)
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            })
            toast({
              title: "Game Complete!",
              description: `You completed the game in ${moves + 1} moves.`,
            })
          }
        }, 500)
      } else {
        // Flip cards back
        setTimeout(() => {
          const resetCards = cards.map((card) =>
            card.id === newFlippedCards[0].id || card.id === newFlippedCards[1].id ? { ...card, flipped: false } : card,
          )
          setCards(resetCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const handleSettingsChange = (mode: GameMode, diff: Difficulty) => {
    setGameMode(mode)
    setDifficulty(diff)
    setShowSettings(false)
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSettings(true)} className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          <Button variant="outline" size="sm" onClick={initializeGame} className="flex items-center gap-1">
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInstructions(true)}
            className="flex items-center gap-1"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Instructions</span>
          </Button>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
            Mode: <span className="font-medium">{gameMode === "pictures" ? "Pictures" : "Facts"}</span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
            Moves: <span className="font-medium">{moves}</span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
            Matches:{" "}
            <span className="font-medium">
              {matchedPairs}/{cards.length / 2}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`grid gap-3 mx-auto ${
          difficulty === "easy"
            ? "grid-cols-3 sm:grid-cols-4"
            : difficulty === "medium"
              ? "grid-cols-3 sm:grid-cols-4"
              : "grid-cols-4 sm:grid-cols-6"
        }`}
      >
        {cards.map((card) => (
          <Card key={card.id} card={card} gameMode={gameMode} onClick={() => handleCardClick(card)} />
        ))}
      </div>

      {showSettings && (
        <SettingsPanel
          currentMode={gameMode}
          currentDifficulty={difficulty}
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsChange}
        />
      )}
      {showInstructions && <InstructionsPopup open={showInstructions} onClose={() => setShowInstructions(false)} />}
    </div>
  )
}
